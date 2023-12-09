import express from "express";
import { likeAfact, getAUser } from "../controllers/like.controller";

const router = express.Router();

router.post("/", likeAfact);
router.get("/:userId", getAUser);

export default router;
