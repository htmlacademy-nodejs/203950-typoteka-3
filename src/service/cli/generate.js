'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {getRandomInt, shuffle} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

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
    console.error(chalk.red(err));
    return [];
  }
};

const generatePublications = (count, titles, sentences, categories) => (
  Array(count).fill({}).map(() => ({
    announce: shuffle(sentences).slice(1, 5).join(` `),
    fullText: shuffle(sentences).slice(1, 5).join(` `),
    title: titles[getRandomInt(0, titles.length - 1)],
    сategory: [sentences[getRandomInt(0, categories.length - 1)]],
    createdDate: randomTime(),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generatePublications(countOffer, titles, sentences, categories));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.log(err);
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
