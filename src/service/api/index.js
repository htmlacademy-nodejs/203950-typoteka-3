'use strict';

const {Router} = require(`express`);
const getMockData = require(`../lib/get-mock-data`);
const category = require(`./category`);
const search = require(`./search`);
const article = require(`./article`);

const {
  CategoryService,
  ArticleService,
  CommentService,
  SearchService,
} = require(`../data-service`);

const app = new Router();
(async () => {
  const mockData = await getMockData();

  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
  article(app, new ArticleService(mockData), new CommentService(mockData));
})();

module.exports = app;
