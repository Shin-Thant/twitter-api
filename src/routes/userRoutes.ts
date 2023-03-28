import express from "express";
import { getUserById } from "../controllers/userController";
import verifyJWT from "../middlewares/verifyJWT";

const router = express.Router();

router.get("/:id", verifyJWT, getUserById);

export default router;
