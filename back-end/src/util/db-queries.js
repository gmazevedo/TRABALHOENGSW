// Requiring packages
const format = require("pg-format");

// Requiring scripts
const APIUtil = require("./API-util");

// Queries
const SELECT_SESSIONS = (params) => {
  let selectQuery = `SELECT s.session_id, s.name, u.name as leader_name, s.members 
  FROM Sessions s
  LEFT JOIN Users u ON s.leader = u.user_id
  ORDER BY s.name

    `;

  return selectQuery;
};

const INSERT_SESSION = (params) => {
  const name = params.name;
  const leader = params.leader;
  const members = params.members.split(",");

  let insertQuery = `
  INSERT INTO Sessions(name, leader, members)
  VALUES (%L, (SELECT user_id FROM Users WHERE email=%L), ARRAY((SELECT user_id FROM Users
  WHERE email ~~ ANY(ARRAY[%L]) )) 
  )
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
    email = %L
  WHERE email = %L
  `;

  return format(updateQuery, name, password, email, email);
};

const SELECT_USERS = () => {
  let selectQuery = `SELECT * FROM users
  `;

  return selectQuery;
};

const SELECT_USER_PASSWORD = (params) => {
  const email = params.email;

  let selectQuery = `SELECT *
  FROM users 
    WHERE email = %L
  `;

  return format(selectQuery, email);
};

module.exports = {
  SELECT_SESSIONS,
  SELECT_USERS,
  SELECT_USER_PASSWORD,
  UPDATE_USER,
  INSERT_SESSION,
};
