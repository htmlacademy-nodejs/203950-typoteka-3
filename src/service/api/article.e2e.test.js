'use strict';
const express = require(`express`);
const request = require(`supertest`);

const {mockArticles} = require(`../../mocks`);
const offer = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);

const createAPI = () => {
  const app = express();
  app.use(express.json());
  offer(app, new DataService(mockArticles), new CommentService(mockArticles));
  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));
  test(`First offer's id equals "tL9tPm"`, () => expect(response.body[0].id).toBe(`tL9tPm`));
});

describe(`API returns an offer with given id`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/OgPyZM`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer's title is "Куплю антиквариат"`, () => expect(response.body.title).toBe(`Что такое золотое сечение`));
});

describe(`API creates an offer if data is valid`, () => {

  const newArticle = {
    category: `Без рамки`,
    title: `Дам погладить котика`,
    announce: `Дам погладить котика. Дорого. Не гербалайф`,
    fullText: `Первая большая ёлка была установлена только в 1938 году`,
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newArticle = {
    category: `Без рамки`,
    title: `Дам погладить котика`,
    announce: `Дам погладить котика. Дорого. Не гербалайф`,
    fullText: `Первая большая ёлка была установлена только в 1938 году`,
  };
  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badOffer = {...newArticle};
      delete badOffer[key];
      await request(app)
        .post(`/articles`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    category: `Без рамки`,
    title: `Дам погладить котика`,
    announce: `Дам погладить котика. Дорого. Не гербалайф`,
    fullText: `Первая большая ёлка была установлена только в 1938 году`,
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/mvlbf5`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
  test(`Offer is really changed`, () => request(app)
    .get(`/articles/mvlbf5`)
    .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`))
  );
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {
  const app = createAPI();
  const invalidArticle = {
    category: `Это`,
    title: `невалидный`,
    announce: `объект`,
    fullText: `нет поля sum`,
  };

  return request(app)
    .put(`/aricles/NOEXST`)
    .send(invalidArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const app = createAPI();
  const invalidArticle = {
    category: `Это`,
    title: `валидный`,
    announce: `объект`,
    fullText: `однако`,
  };

  return request(app).put(`/articles/NOEXST`).send(invalidArticle).expect(HttpCode.NOT_FOUND);
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/Qeli0N`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted article`, () => expect(response.body.id).toBe(`Qeli0N`));
  test(`Article count is 5 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(5))
  );
});

test(`API refuses to delete non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
  const app = createAPI();
  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/Qeli0N/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});
