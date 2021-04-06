'use strict';

const ExitCode = {
  success: 1,
};

const DEFAULT_COMMAND = `--version`;
const USER_ARGV_INDEX = 2;
const API_PREFIX = `/api`;

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};

const MAX_ID_LENGTH = 6;

module.exports = {
  ExitCode,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  MAX_ID_LENGTH,
  HttpCode,
  API_PREFIX
};
