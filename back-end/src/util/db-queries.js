// Requiring packages
const format = require("pg-format");

// Requiring scripts
const APIUtil = require("./API-util");

// Queries
const SELECT_SESSIONS = (params) => {
  let selectQuery = `SELECT v.*,va.area_name
  FROM vacancies v
  LEFT JOIN vacancy_areas va ON v.vacancy_id = va.vacancy_id
    `;

  return selectQuery;
};

const UPSERT_SESSION = (params) => {
  const vacancy_id = params.vacancy_id;
  const owner_registration_number = params.owner_registration_number;
  const name = params.name;
  const type = params.type;
  const description = params.description;
  const total_payment = params.total_payment || null;

  let insertQuery = vacancy_id
    ? `
  UPDATE vacancies SET 
  owner_registration_number = %L,
  name = %L,
  description = %L,
  type = %L,
  total_payment = %L
  WHERE vacancy_id = %L
  `
    : `
  INSERT INTO vacancies(owner_registration_number, name, description, type, total_payment)
  VALUES (%L, %L, %L, %L, %L)
  RETURNING vacancy_id
  `;

  return vacancy_id
    ? format(
        insertQuery,
        owner_registration_number,
        name,
        description,
        type,
        total_payment,
        vacancy_id
      )
    : format(
        insertQuery,
        owner_registration_number,
        name,
        description,
        type,
        total_payment
      );
};

const UPDATE_USER = (params) => {
  const registration_number = params.registration_number;
  const name = params.name;
  const password = params.password;
  const email = params.email;
  const cv_link = params.cv_link;

  let updateQuery = `UPDATE users
  SET
    name = %L,
    password = %L,
    email = %L,
    cv_link = %L
  WHERE registration_number = %L
  `;

  return format(
    updateQuery,
    name,
    password,
    email,
    cv_link,
    registration_number
  );
};

const SELECT_USERS = (params) => {
  let selectQuery = `SELECT u.*,i.area_name FROM users u 
  LEFT JOIN user_interests i ON u.registration_number = i.registration_number
  `;

  return selectQuery;
};

const SELECT_USER_PASSWORD = (params) => {
  const user_number = params.user_number;

  let selectQuery = `SELECT *
  FROM users u
    WHERE registration_number = %L
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
