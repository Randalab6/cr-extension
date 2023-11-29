const express = require("express");
const router = express.Router();

// import like controller
const { likeAFact } = require("../controllers/like.controller")

router.post("/", likeAFact)
router.get("/:userId", getAUser)

module.exports = router;