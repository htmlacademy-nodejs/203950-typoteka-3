'use strict';

const fs = require(`fs`).promises;
const {getRandomInt, shuffle} = require(`../../utils`);
const {getLogger} = require(`../lib/logger`);

const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;
const FILE_NAME = `fill-db.sql`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const logger = getLogger({name: `generate`});

const getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    logger.error(err);
    return [];
  }
};

const generateComments = (count, articleId, userCount, comments) => (
  Array(count).fill({}).map(() => ({
    userId: getRandomInt(1, userCount),
    articleId,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generatePublications = (count, titles, sentences, categoryCount, comments, userCount) => (
  Array(count).fill({}).map((_, index) => ({
    userId: getRandomInt(1, userCount),
    announce: shuffle(sentences).slice(1, 5).join(` `),
    fullText: shuffle(sentences).slice(1, 5).join(` `),
    title: titles[getRandomInt(0, titles.length - 1)],
    сategory: [getRandomInt(1, categoryCount)],
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), index + 1, userCount, comments),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
  }))
);

module.exports = {
  name: `--fill`,
  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const commentSentences = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countArticles = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const users = [
      {
        email: `ivanov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Иван`,
        lastName: `Иванов`,
        avatar: `avatar1.jpg`
      },
      {
        email: `petrov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Пётр`,
        lastName: `Петров`,
        avatar: `avatar2.jpg`
      }
    ];

    const articles = generatePublications(countArticles, titles, sentences, categories.length, commentSentences, users.length);

    const comments = articles.flatMap((article) => article.comments);

    const articleCategories = articles.map((article, index) => ({articleId: index + 1, categoryId: article.сategory[0]}));

    const userValues = users.map(
        ({email, passwordHash, firstName, lastName, avatar}) =>
          `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
    ).join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const articleValues = articles.map(
        ({title, announce, fullText, picture, userId}) =>
          `('${title}', '${announce}', '${fullText}', '${picture}', ${userId})`
    ).join(`,\n`);

    const articleCategoryValues = articleCategories.map(
        ({articleId, categoryId}) =>
          `(${articleId}, ${categoryId})`
    ).join(`,\n`);

    const commentValues = comments.map(
        ({text, userId, articleId}) =>
          `('${text}', ${userId}, ${articleId})`
    ).join(`,\n`);

    const content = `
      INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
      ${userValues};
      INSERT INTO categories(name) VALUES
      ${categoryValues};
      ALTER TABLE articles DISABLE TRIGGER ALL;
      INSERT INTO articles(title, announce, fullText, picture, user_id) VALUES
      ${articleValues};
      ALTER TABLE articles ENABLE TRIGGER ALL;
      ALTER TABLE article_categories DISABLE TRIGGER ALL;
      INSERT INTO article_categories(article_id, category_id) VALUES
      ${articleCategoryValues};
      ALTER TABLE article_categories ENABLE TRIGGER ALL;
      ALTER TABLE comments DISABLE TRIGGER ALL;
      INSERT INTO COMMENTS(text, user_id, article_Id) VALUES
      ${commentValues};
      ALTER TABLE comments ENABLE TRIGGER ALL;
    `;

    try {
      await fs.writeFile(FILE_NAME, content);
      logger.info(`Operation success. File created.`);
    } catch (err) {
      logger.error(err);
    }
  }
};
