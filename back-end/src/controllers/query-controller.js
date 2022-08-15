const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const APIUtils = require("../util/API-util");
const dbQueries = require("../util/db-queries");
const authPool = require("../db/auth-db");

const SELECT_PARAMS = {
  SELECT_SESSIONS: {
    selectQuery: dbQueries.SELECT_SESSIONS,
    printString: "Sessões Existentes",
  },
  SELECT_USER_PASSWORD: {
    selectQuery: dbQueries.SELECT_USER_PASSWORD,
    printString: "Usuário logado",
  },
  SELECT_USERS: {
    selectQuery: dbQueries.SELECT_USERS,
    printString: "Usuários",
  },
};

const INSERT_PARAMS = {
  UPSERT_SESSION: {
    insertQuery: dbQueries.UPSERT_SESSION,
    printString: "Sessão registrada com sucesso",
  },
  UPDATE_USER: {
    insertQuery: dbQueries.UPDATE_USER,
    printString: "Atualiza dados de um usuário existente",
  },
};

const DELETE_PARAMS = {};

// Functions redirecting to the exportData function by adding their respective dataTypes to body
function redirectSelectSessions(req, res, next) {
  req.body.dataType = "SELECT_SESSIONS";
  next();
}

function redirectSelectUserPassword(req, res, next) {
  req.body.dataType = "SELECT_USER_PASSWORD";
  next();
}

function redirectUpsertSession(req, res, next) {
  req.body.dataType = "UPSERT_SESSION";
  next();
}

function redirectUpdateUser(req, res, next) {
  req.body.dataType = "UPDATE_USER";
  next();
}

function redirectSelectUsers(req, res, next) {
  req.body.dataType = "SELECT_USERS";
  next();
}

/**
 * The main data export function
 * @param {*} req
 * @param {*} res
 */
async function exportData(req, res) {
  const exportParams = SELECT_PARAMS[req.body.dataType];

  try {
    let query = exportParams.selectQuery(req.body.parameters);

    let queryResult = await authPool.query(query);

    if (queryResult.rowCount == 0) {
      res.status(204).json(APIUtils.msgJson(204));
      return;
    }

    res.status(201).json({ result: queryResult.rows });
  } catch (queryError) {
    console.log("Error while executing query in dataBase.");
    console.error(queryError);
    res.status(500).json(APIUtils.msgJson(500));
  }
}

/**
 * The customized export sessions function
 * @param {*} req
 * @param {*} res
 */
async function exportSessions(req, res) {
  const exportParams = SELECT_PARAMS[req.body.dataType];

  try {
    let query = exportParams.selectQuery(req.body.parameters);

    let queryResult = await authPool.query(query);

    if (queryResult.rowCount == 0) {
      res.status(204).json(APIUtils.msgJson(204));
      return;
    }

    const rows = queryResult.rows;
    const vacanciesMap = new Map();
    rows.forEach((row) => {
      if (vacanciesMap.has(row.vacancy_id)) {
        if (row.area_name)
          vacanciesMap.get(row.vacancy_id).areas.push(row.area_name);
      } else {
        vacanciesMap.set(row.vacancy_id, {
          vacancy_id: row.vacancy_id,
          owner_registration_number: row.owner_registration_number,
          occupant_registration_number: row.occupant_registration_number,
          name: row.name,
          description: row.description,
          type: row.type,
          areas: row.area_name ? [row.area_name] : [],
          total_payment: row.total_payment,
        });
      }
    });

    res.status(201).json({ result: Array.from(vacanciesMap.values()) });
  } catch (queryError) {
    console.log("Error while executing query in dataBase.");
    console.error(queryError);
    res.status(500).json(APIUtils.msgJson(500));
  }
}

/**
 * The customized export users function
 * @param {*} req
 * @param {*} res
 */
async function exportsUsers(req, res) {
  const exportParams = SELECT_PARAMS[req.body.dataType];

  try {
    let query = exportParams.selectQuery(req.body.parameters);

    let queryResult = await authPool.query(query);

    if (queryResult.rowCount == 0) {
      res.status(204).json(APIUtils.msgJson(204));
      return;
    }

    const rows = queryResult.rows;
    const usersMap = new Map();
    rows.forEach((row) => {
      if (usersMap.has(row.registration_number)) {
        usersMap
          .get(row.registration_number)
          .area_interests.push(row.area_name);
      } else {
        usersMap.set(row.registration_number, {
          registration_number: row.registration_number,
          email: row.email,
          password: row.password,
          name: row.name,
          cv_link: row.cv_link,
          is_teacher: row.is_teacher,
          area_interests: [row.area_name],
        });
      }
    });

    res.status(201).json({ result: Array.from(usersMap.values()) });
  } catch (queryError) {
    console.log("Error while executing query in dataBase.");
    console.error(queryError);
    res.status(500).json(APIUtils.msgJson(500));
  }
}

/**
 * The main data insert function
 * @param {*} req
 * @param {*} res
 */
async function insertData(req, res) {
  let insertParams = INSERT_PARAMS[req.body.dataType];

  try {
    let query = insertParams.insertQuery(req.body.parameters);

    let queryResult = await authPool.query(query);

    if (req.body.dataType === "INSERT_VACANCY") {
      insertParams = INSERT_PARAMS["INSERT_VACANCY_AREAS"];
      req.body.parameters.vacancy_id = queryResult.rows[0].vacancy_id;
      query = insertParams.insertQuery(req.body.parameters);
      if (req.body.areas.length > 0) {
        queryResult = await authPool.query(query);
      }
    }

    res.status(201).json({ result: insertParams.printString });
  } catch (queryError) {
    console.log("Error while executing query in dataBase.");
    console.error(queryError);
    res.status(500).json(APIUtils.msgJson(500));
  }
}

/**
 * function to delete data in the database
 * @param {*} req
 * @param {*} res
 */
async function deleteData(req, res) {
  let deleteParams = DELETE_PARAMS[req.body.dataType];

  try {
    let query = deleteParams.deleteQuery(req.body.parameters);

    let queryResult = await authPool.query(query);

    let statusCode, message;
    if (queryResult.rowCount) {
      statusCode = 204;
      message = deleteParams.printString.success;
    } else {
      statusCode = 404;
      message = deleteParams.printString.notFound;
    }
    res.status(statusCode).json({ result: message });
  } catch (queryError) {
    console.log("Error while executing query in dataBase.");
    console.error(queryError);
    res.status(400).json(APIUtils.msgJson(400));
  }
}

module.exports = {
  redirectSelectSessions,
  redirectSelectUserPassword,
  redirectUpsertSession,
  redirectUpdateUser,
  redirectSelectUsers,
  exportData,
  exportSessions,
  exportsUsers,
  insertData,
  deleteData,
};
