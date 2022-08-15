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
  "/upsert_session",
  queryController.redirectUpsertSession,
  queryController.insertData
);

router.post(
  "/update_user",
  queryController.redirectUpdateUser,
  queryController.insertData
);

module.exports = router;
