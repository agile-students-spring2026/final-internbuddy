const express = require("express");
const router = express.Router();
const {
  searchUsersHandler,
  getUserProfileHandler,
} = require("../controllers/userController");
 
router.get("/search", searchUsersHandler);
 
router.get("/:id", getUserProfileHandler);
 
module.exports = router;