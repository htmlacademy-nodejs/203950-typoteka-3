'use strict';
const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search`);
const DataService = require(`../data-service/search`);
const {HttpCode} = require(`../../constants`);
const {
  mockArticles,
  mockFirstArticleId,
} = require(`../../mocks`);

const app = express();
app.use(express.json());
search(app, new DataService(mockArticles));

describe(`API /search GET`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Рок — это протест`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 offer found`, () => expect(response.body.length).toBe(1));
  test(`Offer has correct id`, () => expect(response.body[0].id).toBe(mockFirstArticleId));

  test(`API returns code 404 if nothing is found`,
      () => request(app)
        .get(`/search`)
        .query({
          query: `Продам свою душу`
        })
        .expect(HttpCode.NOT_FOUND)
  );

  test(`API returns 400 when query string is absent`,
      () => request(app)
        .get(`/search`)
        .expect(HttpCode.BAD_REQUEST)
  );
});
