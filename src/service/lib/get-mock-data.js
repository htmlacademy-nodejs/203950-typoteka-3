'use strict';

const fs = require(`fs`).promises;
const FILENAME = `mocks.json`;
let data = null;

module.exports = async () => {
  if (data !== null) {
    return Promise.resolve(data);
  }

  try {
    const fileContent = await fs.readFile(FILENAME);
    data = JSON.parse(fileContent);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }

  return Promise.resolve(data);
};
