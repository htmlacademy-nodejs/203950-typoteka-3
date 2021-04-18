'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();

const {getAPI} = require(`../api`);

const api = getAPI();

mainRouter.get(`/`, async (req, res) => {
  try {
    const articles = await api.getArticles();

    const popularArticles = articles.slice(0, 5);
    const lastComments = articles
      .reduce((acc, article) => [...acc, ...article.comments], [])
      .slice(0, 3);

    res.render(`main`, {popularArticles, lastComments, articles});
  } catch (error) {
    res.render(`main`, {popularArticles: [], lastComments: [], articles: []});
  }
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res) => {
  try {
    const {search} = req.query;

    const results = await api.search(search);
    res.render(`search`, {results});

  } catch (error) {
    res.render(`search`, {results: []});
  }
});

mainRouter.get(`/categories`, async (req, res) => {
  try {
    const categories = await api.getCategories();

    res.render(`all-categories`, {categories});
  } catch (error) {
    res.render(`all-categories`, {categories: []});
  }
});

module.exports = mainRouter;
