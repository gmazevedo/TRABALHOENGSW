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
  console.log(format(insertQuery, [name, leader, members]));

  return format(insertQuery, [name, leader, members]);
};

const UPDATE_USER = (params) => {
  const registration_number = params.registration_number;
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

  return format(updateQuery, name, password, email, registration_number);
};

const SELECT_USERS = () => {
  let selectQuery = `SELECT * FROM users
  `;

  return selectQuery;
};

const SELECT_USER_PASSWORD = (params) => {
  const email = params.email;

  let selectQuery = `SELECT password
  FROM users u
    WHERE email = %L
  `;

  return format(selectQuery, email);
};

module.exports = {
  SELECT_SESSIONS,
  SELECT_USERS,
  SELECT_USER_PASSWORD,
  UPDATE_USER,
  UPSERT_SESSION,
};
