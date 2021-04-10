'use strict';
const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);


class ArticleService {
  constructor(article) {
    this._article = article;
  }

  create(article) {
    const newArticle = Object
      .assign({id: nanoid(MAX_ID_LENGTH), comments: []}, article);

    this._article.push(newArticle);
    return newArticle;
  }

  drop(id) {
    const article = this._article.find((item) => item.id === id);

    if (!article) {
      return null;
    }

    this._article = this._article.filter((item) => item.id !== id);
    return article;
  }

  findAll() {
    return this._article;
  }

  findOne(id) {
    return this._article.find((item) => item.id === id);
  }

  update(id, article) {
    const oldArticle = this._article
      .find((item) => item.id === id);

    if (!oldArticle) {
      return null;
    }

    return Object.assign(oldArticle, article);
  }
}

module.exports = ArticleService;
