"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createObjectId = exports.createBearerToken = exports.getRandomTweet = exports.getRandomUser = exports.getRandomComment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const createToken_1 = __importDefault(require("../../lib/createToken"));
const Comment_1 = __importDefault(require("../../models/Comment"));
const Tweet_1 = __importDefault(require("../../models/Tweet"));
const User_1 = __importDefault(require("../../models/User"));
async function getRandomComment(query) {
    return await Comment_1.default.findOne(query);
}
exports.getRandomComment = getRandomComment;
async function getRandomUser(query) {
    return await User_1.default.findOne(query);
}
exports.getRandomUser = getRandomUser;
async function getRandomTweet() {
    return await Tweet_1.default.findOne();
}
exports.getRandomTweet = getRandomTweet;
function createBearerToken(userId) {
    const payload = {
        userInfo: { id: userId },
    };
    const token = (0, createToken_1.default)(payload, "access");
    const bearerToken = `Bearer ${token}`;
    return bearerToken;
}
exports.createBearerToken = createBearerToken;
function createObjectId() {
    return new mongoose_1.default.Types.ObjectId().toString();
}
exports.createObjectId = createObjectId;
