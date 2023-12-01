const express = require("express");
const router = express.Router();
const { likeAfact , getAUser } = require("../controllers/like.controller")

router.post("/", likeAfact)
router.get("/:userId", getAUser)

module.exports = router;