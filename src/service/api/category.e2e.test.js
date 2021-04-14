'use strict';
const express = require(`express`);
const request = require(`supertest`);

const {mockArticles, mockArticlesCategories} = require(`../../mocks`);
const category = require(`./category`);
const DataService = require(`../data-service/category`);
const {HttpCode} = require(`../../constants`);

const app = express();
app.use(express.json());
category(app, new DataService(mockArticles));

describe(`API /categories GET`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Should return correct count categories`, () => expect(response.body.length).toBe(mockArticlesCategories.length));

  test(`Should return correct list of names`,
      () => expect(response.body).toEqual(
          expect.arrayContaining(mockArticlesCategories)
      )
  );
});
