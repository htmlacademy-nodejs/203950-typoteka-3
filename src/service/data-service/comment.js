'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {
  constructor(article) {
    this._article = article;
  }

  create(articleId, comment) {
    const commentsList = this._article.find((item) => item.id === articleId);

    if (!commentsList) {
      return null;
    }

    const newComment = {id: nanoid(MAX_ID_LENGTH), text: comment.text};
    this._article = this._article.map((item) => {
      return item.id === articleId ? item.comments.push(newComment) : item;
    });

    return newComment;
  }

  drop(articleId, commentId) {
    const commentsList = this._article.find((item) => item.id === articleId);

    if (!commentsList) {
      return null;
    }
    const comment = commentsList.comments.find((item) => item.id === commentId);

    if (!comment) {
      return null;
    }

    this._article = this._article.map((item) => {
      return item.id === articleId ? item.comments.filter(({id}) => id !== commentId) : item;
    });

    return comment;
  }

  findAll(articleId) {
    const commentsList = this._article.find((item) => item.id === articleId);

    if (!commentsList) {
      return null;
    }

    return commentsList.comments;
  }

}

module.exports = CommentService;
