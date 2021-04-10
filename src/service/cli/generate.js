'use strict';

const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);
const {getRandomInt, shuffle} = require(`../../utils`);
const {MAX_ID_LENGTH} = require(`../../constants`);
const {getLogger} = require(`../lib/logger`);

const logger = getLogger({name: `generate`});

const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;
const FILE_NAME = `mocks.json`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const randomTime = () => {
  const firstDate = new Date().getTime();
  const lastDate = new Date(new Date() - 1000 * 60 * 60 * 24 * 90).getTime();
  const diff = lastDate - firstDate;
  const newDiff = diff * Math.random();
  const date = new Date(firstDate + newDiff);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay() + 1} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`)
      .map((text) => text.trim())
      .filter((text) => text.length);
  } catch (err) {
    logger.error(err);
    return [];
  }
};

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generatePublications = (count, titles, sentences, categories, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    announce: shuffle(sentences).slice(1, 5).join(` `),
    fullText: shuffle(sentences).slice(1, 5).join(` `),
    title: titles[getRandomInt(0, titles.length - 1)],
    сategory: [sentences[getRandomInt(0, categories.length - 1)]],
    createdDate: randomTime(),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments)
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generatePublications(countOffer, titles, sentences, categories, comments));

    try {
      await fs.writeFile(FILE_NAME, content);
      logger.info(`Operation success. File created.`);
    } catch (err) {
      logger.error(err);
      logger.error(`Can't write data to file...`);
    }
  }
};
