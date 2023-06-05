"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../config/AppError"));
const createToken_1 = require("../lib/createToken");
const User_1 = __importDefault(require("../models/User"));
const verifyToken_1 = __importDefault(require("../lib/verifyToken"));
async function verifyJWT(req, _res, next) {
    try {
        verifyAuthorizationHeader(req);
        const accessToken = getTokenFromRequest(req);
        const secretKey = (0, createToken_1.getSecretKey)("access");
        const payload = (0, verifyToken_1.default)(accessToken, secretKey);
        const userId = payload.userInfo.id;
        const foundUser = await findUserByID(userId);
        if (!foundUser) {
            throw new AppError_1.default("Forbidden!", 403);
        }
        req.user = foundUser;
        next();
    }
    catch (err) {
        next(err);
    }
}
exports.default = verifyJWT;
function verifyAuthorizationHeader(req) {
    if (!req.headers) {
        throw new AppError_1.default("Missing request headers!", 403);
    }
    if (!("authorization" in req.headers) &&
        !("Authorization" in req.headers)) {
        throw new AppError_1.default("Missing authorization header!", 403);
    }
}
function getTokenFromRequest(req) {
    const bearerToken = getBearerTokenFromReqHeader(req);
    if (!isValidBearerToken(bearerToken)) {
        throw new AppError_1.default("Missing token in authorization header!", 403);
    }
    const token = bearerToken.split(" ")[1];
    if (!token) {
        throw new AppError_1.default("Access token required!", 401);
    }
    return token;
}
function getBearerTokenFromReqHeader(req) {
    return req.headers.authorization || req.headers.Authorization;
}
function isValidBearerToken(bearerToken) {
    return (!!bearerToken &&
        !Array.isArray(bearerToken) &&
        bearerToken.startsWith("Bearer "));
}
async function findUserByID(id) {
    const user = await User_1.default.findById(id);
    return user;
}
