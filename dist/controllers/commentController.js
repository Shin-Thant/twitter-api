"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.getCommentById = exports.addNewComment = exports.getTweetComments = exports.getAllComments = void 0;
const AppError_1 = __importDefault(require("../config/AppError"));
const validateCommentCreation_1 = __importDefault(require("../lib/validateCommentCreation"));
const Comment_1 = __importDefault(require("../models/Comment"));
const Tweet_1 = __importDefault(require("../models/Tweet"));
const isObjectId_1 = __importDefault(require("../lib/isObjectId"));
//* test route
const getAllComments = async (req, res) => {
    const comments = await Comment_1.default.find()
        .populateRelations({ populateComments: true })
        .lean();
    res.json(comments);
};
exports.getAllComments = getAllComments;
const getTweetComments = async (req, res) => {
    const { tweetId } = req.params;
    if (!tweetId) {
        throw new AppError_1.default("Tweet ID is requried!", 400);
    }
    const comments = await Comment_1.default.find({
        tweet: tweetId,
        parent: { $exists: false },
    })
        .populateRelations({ populateComments: true })
        .sort("-createdAt")
        .lean();
    res.json(comments);
};
exports.getTweetComments = getTweetComments;
const addNewComment = async (req, res) => {
    const { user: creator } = req;
    const { body, tweetId } = req.body;
    if (!body || !creator || !tweetId) {
        throw new AppError_1.default("All fields are required!", 400);
    }
    if (!(0, isObjectId_1.default)(tweetId)) {
        throw new AppError_1.default("Invalid Tweet ID!", 400);
    }
    const foundTweet = await Tweet_1.default.findById(tweetId).lean().exec();
    if (!foundTweet) {
        throw new AppError_1.default("Invalid Tweet ID!", 400);
    }
    const commentData = {
        body,
        creator: creator._id.toString(),
        tweet: tweetId,
    };
    const { value: data, error: inputErr } = (0, validateCommentCreation_1.default)(commentData);
    if (inputErr) {
        throw inputErr;
    }
    const newComment = await Comment_1.default.create(data);
    if (!newComment) {
        throw new AppError_1.default("Something went wrong!", 500);
    }
    res.json(newComment);
};
exports.addNewComment = addNewComment;
const getCommentById = async (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
        throw new AppError_1.default("Comment ID is required!", 400);
    }
    const foundComment = await Comment_1.default.findById(commentId)
        .populateRelations({ populateComments: true })
        .exec();
    if (!foundComment) {
        throw new AppError_1.default("Invalid ID!", 400);
    }
    res.json(foundComment);
};
exports.getCommentById = getCommentById;
const updateComment = async (req, res) => {
    const { comment } = req;
    const { body } = req.body;
    if (!comment) {
        throw new AppError_1.default("Unauthorized!", 401);
    }
    if (!body) {
        throw new AppError_1.default("Comment body is required!", 400);
    }
    comment.body = body;
    await comment.save();
    res.json(comment);
};
exports.updateComment = updateComment;
const deleteComment = async (req, res) => {
    const { comment } = req;
    if (!comment) {
        throw new AppError_1.default("Unauthorized!", 401);
    }
    await comment.deleteOne();
    res.json({ message: "Comment deleted successfully!" });
};
exports.deleteComment = deleteComment;
