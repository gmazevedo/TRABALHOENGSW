// Requiring packages
const format = require("pg-format");

// Requiring scripts
const APIUtil = require("./API-util");

// Queries
const SELECT_SESSIONS = (params) => {
  let email = params;
  let selectQuery = `SELECT s.session_id, s.name, u.name as leader, uc.name as members
  FROM Sessions s
  LEFT JOIN Users u ON ARRAY[s.session_id]::text[] && u.leader_of 
  LEFT JOIN Users uc ON ARRAY[s.session_id]::text[] && uc.member_of
  WHERE u.email=%L OR uc.email=%L
  ORDER BY session_id
    `;

  return format(selectQuery, email, email);
};

const INSERT_SESSION = (params) => {
  const name = params.name;
  const leader = params.leader;
  const members = params.members.split(",");

  let insertQuery = `
  INSERT INTO Sessions(name, leader, members)
  VALUES (%L, ARRAY(SELECT user_id FROM Users WHERE email=%L)::text[], ARRAY((SELECT user_id FROM Users
  WHERE email ~~ ANY(ARRAY[%L])))::text[])
  `;

  return format(insertQuery, name, leader, members);
};

const INSERT_USER = (params) => {
  const name = params.name;
  const password = params.password;
  const email = params.email;

  let insertQuery = `INSERT INTO users(name,password,email) VALUES (%L)
  ON CONFLICT (email) DO NOTHING
  `;

  return format(insertQuery, [name, password, email]);
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

const UPDATE_SESSION_MEMBERS = (params) => {
  const id = params.session_id;
  const members = params.members;

  let updateQuery = `UPDATE sessions
  SET
    members = %L
  WHERE session_id = %L
  `;

  return format(updateQuery, members, id);
};

const UPDATE_USER_MEMBERSHIP = (params) => {
  const email = params.email;
  const session_name = params.session_name;

  let updateQuery = `UPDATE users
  SET
    member_of = array_append(member_of,(SELECT session_id FROM sessions WHERE name = %L)::text)
  WHERE email = %L
  `;

  return format(updateQuery, session_name, email);
};

const UPDATE_USER_LEADERSHIP = (params) => {
  const email = params.email;
  const session_name = params.session_name;

  let updateQuery = `UPDATE users
  SET
    leader_of = array_append(leader_of,(SELECT session_id FROM sessions WHERE name = %L)::text)
  WHERE email = %L
  `;

  return format(updateQuery, session_name, email);
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
  UPDATE_SESSION_MEMBERS,
  UPDATE_USER_MEMBERSHIP,
  UPDATE_USER_LEADERSHIP,
  INSERT_SESSION,
  INSERT_USER,
};
