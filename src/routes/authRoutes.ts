import express from "express";
import {
	handleLogin,
	handleLogout,
	handleRegister,
} from "../controllers/authController";
import limiter from "../lib/rateLimit";

const router = express.Router();

// *limit auth requests
const REMEMBER_TIME_IN_MILLISECONDS = 15 * 60 * 1000;
router.use(limiter(3, REMEMBER_TIME_IN_MILLISECONDS));

router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);

export default router;
