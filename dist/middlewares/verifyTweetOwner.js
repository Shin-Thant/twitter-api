"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../config/AppError"));
const Tweet_1 = __importDefault(require("../models/Tweet"));
const verifyTweetOwner = async (req, res, next) => {
    const { user: owner } = req;
    const { tweetId } = req.params;
    if (!owner) {
        console.log("User not found!");
        throw new AppError_1.default("Unauthorized!", 401);
    }
    if (!tweetId) {
        throw new AppError_1.default("Tweet ID is requried!", 400);
    }
    const foundTweet = await Tweet_1.default.findById(tweetId).exec();
    if (!foundTweet) {
        throw new AppError_1.default("Invalid ID!", 400);
    }
    if (foundTweet.owner._id.toString() !== owner._id.toString()) {
        console.log("Not your tweet!");
        throw new AppError_1.default("Unauthorized!", 401);
    }
    req.tweet = foundTweet;
    next();
};
exports.default = verifyTweetOwner;
