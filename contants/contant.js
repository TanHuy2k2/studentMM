const SALT_ROUNDS = 10;
const PAGE_SIZE = 4;
const DEFAULT_PASSWORD = '123';
const CONTENT_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const CONTENT_DISPOSITION = 'attachment; filename="data.xlsx"'

module.exports = { SALT_ROUNDS, PAGE_SIZE, DEFAULT_PASSWORD, CONTENT_TYPE, CONTENT_DISPOSITION };
