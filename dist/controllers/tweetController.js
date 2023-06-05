"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTweet = exports.handleLikes = exports.updateTweet = exports.shareTweet = exports.createTweet = exports.getTweetById = exports.getTweets = void 0;
const AppError_1 = __importDefault(require("../config/AppError"));
const pagination_1 = __importDefault(require("../lib/pagination"));
const validateTweetCreation_1 = __importDefault(require("../lib/validateTweetCreation"));
const Comment_1 = __importDefault(require("../models/Comment"));
const Tweet_1 = __importDefault(require("../models/Tweet"));
const isValuesNotNumber_1 = require("../util/isValuesNotNumber");
const paginationHelper_1 = __importDefault(require("../util/paginationHelper"));
const getTweets = async (req, res) => {
    const { currentPage, itemsPerPage } = req.query;
    if (!currentPage || !itemsPerPage) {
        throw new AppError_1.default("All fields are requried!", 400);
    }
    if ((0, isValuesNotNumber_1.isValuesNotNumber)(itemsPerPage, currentPage)) {
        throw new AppError_1.default("Enter valid values!", 400);
    }
    const totalTweets = await Tweet_1.default.countDocuments({});
    const pagination = new pagination_1.default({
        itemsPerPage: parseInt(itemsPerPage),
        currentPage: parseInt(currentPage),
        totalDocs: totalTweets,
        helper: new paginationHelper_1.default(),
    });
    const tweets = await Tweet_1.default.find()
        .populateRelations({ populateComments: true })
        .limit(pagination.itemsPerPage * pagination.currentPage)
        .sort("-createdAt")
        .exec();
    res.json(pagination.createPaginationResult(tweets));
};
exports.getTweets = getTweets;
const getTweetById = async (req, res) => {
    const { tweetId } = req.params;
    if (!tweetId) {
        throw new AppError_1.default("All fields are requried!", 400);
    }
    const tweet = await Tweet_1.default.findById(tweetId)
        .populateRelations({ populateComments: true })
        .exec();
    if (!tweet) {
        throw new AppError_1.default("Invalid ID!", 400);
    }
    res.json(tweet);
};
exports.getTweetById = getTweetById;
const createTweet = async (req, res) => {
    const { body } = req.body;
    const { user: owner } = req;
    if (!body || !owner) {
        throw new AppError_1.default("All fields are required!", 400);
    }
    const tweetData = {
        type: "post",
        body,
        owner: owner._id.toString(),
    };
    const { value, error } = (0, validateTweetCreation_1.default)(tweetData);
    if (error) {
        throw error;
    }
    const newTweet = await Tweet_1.default.create(value);
    if (!newTweet) {
        throw new AppError_1.default("Something went wrong!", 500);
    }
    res.json(newTweet);
};
exports.createTweet = createTweet;
const shareTweet = async (req, res) => {
    const { user: owner } = req;
    const { tweetId } = req.params;
    const { body } = req.body;
    if (!tweetId || !owner) {
        throw new AppError_1.default("All fields are required!", 400);
    }
    const originTweet = await Tweet_1.default.findById(tweetId).exec();
    if (!originTweet) {
        throw new AppError_1.default("Invalid tweet ID!", 400);
    }
    const tweetData = {
        type: "share",
        origin: tweetId,
        owner: owner._id.toString(),
    };
    if (body) {
        tweetData.body = body;
    }
    const { value, error } = (0, validateTweetCreation_1.default)(tweetData);
    if (error) {
        throw error;
    }
    const newSharedTweet = await Tweet_1.default.create(value);
    if (!newSharedTweet) {
        throw new AppError_1.default("Some went wrong", 500);
    }
    originTweet.shares.push(owner._id);
    await originTweet.save();
    res.json(newSharedTweet);
};
exports.shareTweet = shareTweet;
const updateTweet = async (req, res) => {
    const { tweet } = req;
    const { body } = req.body;
    if (!body) {
        throw new AppError_1.default("Tweet body is required!", 400);
    }
    if (!tweet) {
        throw new AppError_1.default("Invalid Tweet ID!", 400);
    }
    tweet.body = body;
    await tweet.save();
    res.json(tweet);
};
exports.updateTweet = updateTweet;
const handleLikes = async (req, res) => {
    const { user } = req;
    const { tweetId } = req.params;
    if (!user) {
        throw new AppError_1.default("Unauthorized!", 400);
    }
    if (!tweetId) {
        throw new AppError_1.default("Tweet ID required!", 400);
    }
    const tweet = await Tweet_1.default.findById(tweetId).exec();
    if (!tweet) {
        throw new AppError_1.default("Invalid tweet ID!", 400);
    }
    const isLiked = tweet.likes.includes(user._id);
    if (!isLiked) {
        // add like
        tweet.likes.push(user._id);
    }
    else {
        // remove like
        tweet.likes = tweet.likes.filter((userId) => userId.toString() !== user._id.toString());
    }
    await tweet.save();
    res.json(tweet);
};
exports.handleLikes = handleLikes;
const deleteTweet = async (req, res) => {
    const { tweet } = req;
    if (!tweet) {
        throw new AppError_1.default("Invalid Tweet ID!", 400);
    }
    await Comment_1.default.deleteMany({ tweet: tweet._id });
    await tweet.deleteOne();
    res.json({ status: "success", message: "Tweet deleted successfully!" });
};
exports.deleteTweet = deleteTweet;
