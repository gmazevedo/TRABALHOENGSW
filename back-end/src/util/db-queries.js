// Requiring packages
const format = require("pg-format");

// Requiring scripts
const APIUtil = require("./API-util");

// Queries
const SELECT_SESSIONS = (params) => {
  let selectQuery = `SELECT * FROM Sessions
    `;

  return selectQuery;
};

const UPSERT_SESSION = (params) => {
  const name = params.name;
  const leader = params.leader;
  const members = params.members;

  let insertQuery = `
  INSERT INTO Sessions(name, leader, members)
  VALUES (%L)
  `;

  return format(insertQuery, name, leader, members);
};

const UPDATE_USER = (params) => {
  const name = params.name;
  const password = params.password;
  const email = params.email;

  let updateQuery = `UPDATE users
  SET
    name = %L,
    password = %L,
    email = %L,
  WHERE registration_number = %L
  `;

  return format(updateQuery, name, password, email);
};

const SELECT_USERS = (params) => {
  let selectQuery = `SELECT * FROM users
  `;

  return selectQuery;
};

const SELECT_USER_PASSWORD = (params) => {
  const user_number = params.user_number;

  let selectQuery = `SELECT *
  FROM users 
    WHERE email = %L
  `;

  return format(selectQuery, user_number);
};

module.exports = {
  SELECT_SESSIONS,
  SELECT_USERS,
  SELECT_USER_PASSWORD,
  UPDATE_USER,
  UPSERT_SESSION,
};
