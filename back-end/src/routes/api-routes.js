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
  queryController.redirectSelectVacancies,
  queryController.exportVacancies
);
router.post(
  "/select_vacancies_interests",
  queryController.redirectSelectVacancyInterest,
  queryController.exportVacanciesInterest
);
router.post(
  "/select_areas",
  queryController.redirectSelectAreas,
  queryController.exportData
);
router.post(
  "/select_users",
  queryController.redirectSelectUsers,
  queryController.exportsUsers
);
router.post(
  "/upsert_session",
  queryController.redirectUpsertVacancy,
  queryController.insertData
);
router.post(
  "/insert_user_interests",
  queryController.redirectInsertUserInterest,
  queryController.insertData
);
router.post(
  "/insert_vacancy_interest",
  queryController.redirectInsertVacancyInterest,
  queryController.insertData
);
router.post(
  "/update_user",
  queryController.redirectUpdateUser,
  queryController.insertData
);

module.exports = router;
