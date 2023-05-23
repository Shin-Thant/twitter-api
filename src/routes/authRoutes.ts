import { Router } from "express";
import {
	handleLogin,
	handleLogout,
	handleRefreshToken,
	handleRegister,
} from "../controllers/authController";
import rateLimiter from "../lib/rateLimit";
import verifyJWT from "../middlewares/verifyJWT";

const router = Router();

// *limit auth requests
const AUTH_REMEMBER_TIME_IN_MILLISECONDS = 15 * 60 * 1000;
const authRateLimiter = () =>
	rateLimiter(3, AUTH_REMEMBER_TIME_IN_MILLISECONDS);

router.post("/register", authRateLimiter(), handleRegister);
router.post("/login", authRateLimiter(), handleLogin);
router.post("/logout", authRateLimiter(), verifyJWT, handleLogout);

const REFRESH_REMEMBER_TIME_IN_MILLISECONDS = 60 * 1000;
router.get(
	"/refresh",
	rateLimiter(10, REFRESH_REMEMBER_TIME_IN_MILLISECONDS),
	handleRefreshToken
);

export default router;
