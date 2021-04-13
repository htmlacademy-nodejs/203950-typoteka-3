'use strict';
const express = require(`express`);
const request = require(`supertest`);

const {
  mockArticles,
  mockArticlesCategories,
  mockFirstArticleId,
  mockSecondArticleId,
  mockSecondArticleTitle,
  mockNotFound,
  mockNoExistId,
  mockInvalidArticle,
  mockArticleCommentId,
} = require(`../../mocks`);
const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);

const createAPI = () => {
  const app = express();
  app.use(express.json());
  article(app, new DataService(mockArticles), new CommentService(mockArticles));
  return app;
};

describe(`API /articles GET`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Should return correct count of articles`, () => {
    expect(response.body.length).toBe(mockArticles.length);
  });
  test(`First article's id should be correct`, () => {
    expect(response.body[0].id).toBe(mockFirstArticleId);
  });
});

describe(`API /articles/:articleId GET`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/${mockSecondArticleId}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article's title should be correct`, () => expect(response.body.title).toBe(mockSecondArticleTitle));
  test(`API returns status code 404 when trying to pass invalid Id`, () => {
    return request(app)
      .get(`/articles/${mockNotFound}`)
      .send(mockNotFound)
      .expect(HttpCode.NOT_FOUND);
  });
});

describe(`API /articles POST`, () => {
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
    .expect((res) => expect(res.body.length).toBe(mockArticles.length))
  );
  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(mockInvalidArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API /articles PUT`, () => {
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
      .put(`/articles/${mockSecondArticleId}`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
  test(`Article is really changed`, () => request(app)
    .get(`/articles/${mockSecondArticleId}`)
    .expect((res) => expect(res.body.title).toBe(newArticle.title))
  );

  test(`API returns status code 400 when trying to change an article with invalid data`, () => {
    return request(app)
      .put(`/articles/${mockSecondArticleId}`)
      .send(mockInvalidArticle)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`API returns status code 404 when trying to change non-existent article`, () => {
    return request(app).put(`/articles/${mockNoExistId}`).send(newArticle).expect(HttpCode.NOT_FOUND);
  });
});

describe(`API /articles/:articleId DELETE`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/${mockFirstArticleId}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted article`, () => expect(response.body.id).toBe(mockFirstArticleId));
  test(`List of articles should be correct`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(5))
  );

  test(`API refuses to delete non-existent article`, () => {
    const app = createAPI();

    return request(app)
      .delete(`/articles/${mockNoExistId}`)
      .expect(HttpCode.NOT_FOUND);
  });
});

describe(`API /articles/:articlesId/comments GET`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/${mockSecondArticleId}/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Count of Article should be correct`, () => expect(response.body.length).toBe(mockArticles[1].comments.length));
  test(`API returns status code 404 when trying to pass invalid Id`, () => {
    return request(app)
      .get(`/articles/${mockNotFound}/comments`)
      .send(mockNotFound)
      .expect(HttpCode.NOT_FOUND);
  });
});

describe(`API /articles/:articlesId/comments POST`, () => {
  const newComment = {
    text: `Новый комментарий`,
  };
  const invalidComment = `invalid comment`;
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/${mockFirstArticleId}/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));
  test(`API refuses to create a comment to non-existent article and returns status code 400`, () => {
    return request(app)
      .post(`/articles/${mockFirstArticleId}/comments`)
      .send(invalidComment)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`API returns status code 404 when trying to change non-existent article`, () => {
    return request(app).post(`/articles/${mockNoExistId}/comments`).send(newComment).expect(HttpCode.NOT_FOUND);
  });
});

describe(`API /articles/:articleId/comments/:commentId DELETE`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/${mockSecondArticleId}/comments/${mockArticleCommentId}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted comment`, () => expect(response.body.id).toBe(mockArticleCommentId));

  test(`API refuses to delete non-existent comment`, () => {
    return request(app)
      .delete(`/articles/${mockFirstArticleId}/comments/${mockNoExistId}`)
      .expect(HttpCode.NOT_FOUND);
  });
});
