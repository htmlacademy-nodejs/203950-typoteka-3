'use strict';
const express = require(`express`);
const request = require(`supertest`);

const {mockArticles} = require(`../../mocks`);
const category = require(`./category`);
const DataService = require(`../data-service/category`);
const {HttpCode} = require(`../../constants`);

const app = express();
app.use(express.json());
category(app, new DataService(mockArticles));

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 4 categories`, () => expect(response.body.length).toBe(6));

  test(`Category names are "Деревья", "За жизнь", "Без рамки", "Разное", "Музыка"`,
      () => expect(response.body).toEqual(
          expect.arrayContaining([`Деревья`, `За жизнь`, `Без рамки`, `Разное`, `Музыка`])
      )
  );
});
