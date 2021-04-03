'use strict';

class SearchService {
  constructor(article) {
    this._article = article;
  }

  async findAll(searchText) {
    return this._article
      .filter(({title}) => title.toLowerCase().includes(searchText.toLowerCase()));
  }

}

module.exports = SearchService;
