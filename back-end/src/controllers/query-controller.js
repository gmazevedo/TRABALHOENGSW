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
  SELECT_USERS_ID: {
    selectQuery: dbQueries.SELECT_USERS,
    printString: "Usuários",
  },
};

const INSERT_PARAMS = {
  INSERT_SESSION: {
    insertQuery: dbQueries.INSERT_SESSION,
    printString: "Sessão registrada com sucesso",
  },
  UPDATE_USER: {
    insertQuery: dbQueries.UPDATE_USER,
    printString: "Atualiza dados de um usuário existente",
  },
  INSERT_USER: {
    insertQuery: dbQueries.INSERT_USER,
    printString: "Usuário registrado com sucesso",
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

function redirectInsertSession(req, res, next) {
  req.body.dataType = "INSERT_SESSION";
  next();
}

function redirectUpdateUser(req, res, next) {
  req.body.dataType = "UPDATE_USER";
  next();
}

function redirectInsertUser(req, res, next) {
  req.body.dataType = "INSERT_USER";
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
    const sessionsMap = new Map();
    rows.forEach((row) => {
      sessionsMap.set(row.session_id, {
        session_id: row.session_id,
        name: row.name,
        leader: row.leader_name,
        members: row.members,
      });
    });

    res.status(201).json({ result: Array.from(sessionsMap.values()) });
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
      usersMap.set(row.user_id, {
        user_id: row.user_id,
        email: row.email,
        password: row.password,
        name: row.name,
      });
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
  redirectInsertSession,
  redirectUpdateUser,
  redirectSelectUsers,
  redirectInsertUser,
  exportData,
  exportSessions,
  exportsUsers,
  insertData,
  deleteData,
};
