import { Router } from "express";
import {
	handleEmailVerfication,
	handleLogin,
	handleLogout,
	handleRefreshToken,
	handleRegister,
	handleResendVerifyEmail,
} from "../controllers/authController";
import rateLimiter from "../lib/rateLimit";
import verifyJWT from "../middlewares/verifyJWT";
import validateResource from "../middlewares/validateResource";
import {
	emailVerifySchema,
	loginUserSchema,
	registerUserSchema,
} from "../schema/authSchema";

const router = Router();

// *limit auth requests
const AUTH_REMEMBER_TIME_IN_MILLISECONDS = 15 * 60 * 1000; // 15 mins
const authRateLimiter = () => {
	return rateLimiter(3, AUTH_REMEMBER_TIME_IN_MILLISECONDS);
};

router.post(
	"/register",
	[authRateLimiter(), validateResource(registerUserSchema)],
	handleRegister
);

router.post(
	"/login",
	[authRateLimiter(), validateResource(loginUserSchema)],
	handleLogin
);

router.post("/logout", authRateLimiter(), verifyJWT, handleLogout);

const EMAIL_VERIFY_REMEMBER_TIME_IN_MILLISECONDS = 15 * 60 * 1000; // 15 mins
router.get(
	"/verify-email/:token",
	[
		rateLimiter(8, EMAIL_VERIFY_REMEMBER_TIME_IN_MILLISECONDS),
		validateResource(emailVerifySchema),
	],
	handleEmailVerfication
);

const RESEND_EMAIL_REMEMBER_TIME_IN_MILLISECONDS = 15 * 60 * 1000; // 15 mins
router.post(
	"/send-verify-email",
	[verifyJWT, rateLimiter(5, RESEND_EMAIL_REMEMBER_TIME_IN_MILLISECONDS)],
	handleResendVerifyEmail
);

const REFRESH_REMEMBER_TIME_IN_MILLISECONDS = 60 * 1000; // 1 min
router.get(
	"/refresh",
	rateLimiter(10, REFRESH_REMEMBER_TIME_IN_MILLISECONDS),
	handleRefreshToken
);

export default router;
