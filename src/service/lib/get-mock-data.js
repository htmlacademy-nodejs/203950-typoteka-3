'use strict';

const fs = require(`fs`).promises;
const {getLogger} = require(`../lib/logger`);

const FILENAME = `mocks.json`;
const logger = getLogger({name: `mock`});
let data = null;

module.exports = async () => {
  if (data !== null) {
    return Promise.resolve(data);
  }

  try {
    const fileContent = await fs.readFile(FILENAME);
    data = JSON.parse(fileContent);
  } catch (err) {
    logger.error(err);
    return Promise.reject(err);
  }

  return Promise.resolve(data);
};
