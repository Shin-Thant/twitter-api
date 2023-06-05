"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../config/AppError"));
const Comment_1 = __importDefault(require("../models/Comment"));
const isObjectId_1 = __importDefault(require("../lib/isObjectId"));
const verifyCommentOwner = async (req, res, next) => {
    const { user: owner } = req;
    const { commentId } = req.params;
    if (!owner) {
        console.log("User not found!");
        throw new AppError_1.default("Unauthorized!", 401);
    }
    if (!commentId) {
        throw new AppError_1.default("Comment ID is requried!", 400);
    }
    if (!(0, isObjectId_1.default)(commentId)) {
        throw new AppError_1.default("Invalid ID!", 400);
    }
    const foundComment = await Comment_1.default.findById(commentId).exec();
    if (!foundComment) {
        throw new AppError_1.default("Invalid ID!", 400);
    }
    if (foundComment.creator._id.toString() !== owner._id.toString()) {
        console.log("Not your comment!");
        throw new AppError_1.default("Unauthorized!", 401);
    }
    req.comment = foundComment;
    next();
};
exports.default = verifyCommentOwner;
