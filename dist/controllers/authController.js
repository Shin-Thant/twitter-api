"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLogout = exports.handleRefreshToken = exports.handleLogin = exports.handleRegister = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const AppError_1 = __importDefault(require("../config/AppError"));
const createToken_1 = __importStar(require("../lib/createToken"));
const handleTokenCookie_1 = require("../lib/handleTokenCookie");
const isObjectId_1 = __importDefault(require("../lib/isObjectId"));
const validateUserCreation_1 = __importDefault(require("../lib/validateUserCreation"));
const verifyToken_1 = __importDefault(require("../lib/verifyToken"));
const User_1 = __importDefault(require("../models/User"));
const findDuplicateUser_1 = __importDefault(require("../util/findDuplicateUser"));
const handleRegister = async (req, res) => {
    const { username, name, email, password } = req.body;
    if (!username || !name || !email || !password) {
        throw new AppError_1.default("All fields are required!", 400);
    }
    const duplicates = await (0, findDuplicateUser_1.default)(username, email);
    if (duplicates.duplicateEmail) {
        throw new AppError_1.default("Email already used!", 400);
    }
    if (duplicates.duplicateUsername) {
        throw new AppError_1.default("Username already taken!", 400);
    }
    // *validate user data
    const validatedResult = (0, validateUserCreation_1.default)({
        username,
        name,
        email,
        password,
    });
    if (validatedResult.error) {
        throw validatedResult.error;
    }
    const SALT_ROUNDS = 10;
    const encryptedPwd = await bcrypt_1.default.hash(password, SALT_ROUNDS);
    validatedResult.value.password = encryptedPwd;
    const newUser = await User_1.default.create({ ...validatedResult.value });
    if (!newUser) {
        throw new AppError_1.default("Something went wrong", 500);
    }
    const user = await User_1.default.findById(newUser._id)
        .select(["-following", "-followers"])
        .lean()
        .exec();
    res.status(201).json(user);
};
exports.handleRegister = handleRegister;
const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new AppError_1.default("All fields are required!", 400);
    }
    const foundUser = await User_1.default.findOne({ email })
        .select("password")
        .lean()
        .exec();
    if (!foundUser) {
        throw new AppError_1.default("Invalid email or password!", 400);
    }
    const isPasswordMatched = await bcrypt_1.default.compare(password, foundUser.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default("Invalid email or password!", 400);
    }
    const payload = {
        userInfo: { id: foundUser._id.toString() },
    };
    const accessToken = (0, createToken_1.default)(payload, "access");
    const refreshToken = (0, createToken_1.default)(payload, "refresh");
    (0, handleTokenCookie_1.setTokenCookie)(res, refreshToken);
    const user = await User_1.default.findById(foundUser._id)
        .populate("followers")
        .lean()
        .exec();
    res.json({ accessToken, user });
};
exports.handleLogin = handleLogin;
// TODO: test this
// TODO: refactor this
const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!(0, handleTokenCookie_1.isValidCookie)(cookies)) {
        console.log("cookie error");
        throw new AppError_1.default("Unauthorized!", 401);
    }
    const refreshToken = cookies.token;
    const secretKey = (0, createToken_1.getSecretKey)("refresh");
    const payload = (0, verifyToken_1.default)(refreshToken, secretKey);
    const userId = payload.userInfo.id;
    if (!(0, isObjectId_1.default)(userId)) {
        throw new AppError_1.default("Unauthorized!", 401);
    }
    const foundUser = await User_1.default.findById(userId).lean().exec();
    if (!foundUser) {
        console.log("refresh: user not found!");
        (0, handleTokenCookie_1.clearTokenCookie)(res);
        throw new AppError_1.default("Unauthorized!", 401);
    }
    // Caution: Don't use `payload` received from verification for new access token's payload. It will cause error.
    const accessToken = (0, createToken_1.default)({ userInfo: { id: foundUser._id.toString() } }, "access");
    res.json({ accessToken });
};
exports.handleRefreshToken = handleRefreshToken;
const handleLogout = (req, res) => {
    const cookies = req.cookies;
    if (cookies) {
        (0, handleTokenCookie_1.clearTokenCookie)(res);
    }
    res.json({ message: "Logout successfully!" });
};
exports.handleLogout = handleLogout;
