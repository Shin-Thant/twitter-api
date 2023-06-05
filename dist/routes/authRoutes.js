"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const rateLimit_1 = __importDefault(require("../lib/rateLimit"));
const verifyJWT_1 = __importDefault(require("../middlewares/verifyJWT"));
const router = (0, express_1.Router)();
// *limit auth requests
const AUTH_REMEMBER_TIME_IN_MILLISECONDS = 15 * 60 * 1000;
const authRateLimiter = () => (0, rateLimit_1.default)(3, AUTH_REMEMBER_TIME_IN_MILLISECONDS);
router.post("/register", authRateLimiter(), authController_1.handleRegister);
router.post("/login", authRateLimiter(), authController_1.handleLogin);
router.post("/logout", authRateLimiter(), verifyJWT_1.default, authController_1.handleLogout);
const REFRESH_REMEMBER_TIME_IN_MILLISECONDS = 60 * 1000;
router.get("/refresh", (0, rateLimit_1.default)(10, REFRESH_REMEMBER_TIME_IN_MILLISECONDS), authController_1.handleRefreshToken);
exports.default = router;
