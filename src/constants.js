'use strict';

const ExitCode = {
  success: 1,
};

const DEFAULT_COMMAND = `--version`;

const USER_ARGV_INDEX = 2;

const HttpCode = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

module.exports = {
  ExitCode,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  HttpCode
};
