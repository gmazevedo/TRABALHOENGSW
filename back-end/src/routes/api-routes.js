const express = require("express");
const router = express();
const queryController = require("../controllers/query-controller");

router.post(
  "/select_user_password",
  queryController.redirectSelectUserPassword,
  queryController.exportData
);
router.post(
  "/select_sessions",
  queryController.redirectSelectSessions,
  queryController.exportSessions
);
router.post(
  "/select_users",
  queryController.redirectSelectUsers,
  queryController.exportsUsers
);
router.post(
  "/insert_session",
  queryController.redirectInsertSession,
  queryController.insertData
);

router.post(
  "/update_user",
  queryController.redirectUpdateUser,
  queryController.insertData
);

router.post(
  "/insert_user",
  queryController.redirectInsertUser,
  queryController.insertData
);

router.post(
  "/update_session_members",
  queryController.redirectUpdateSessionMembers,
  queryController.insertData
);
module.exports = router;
