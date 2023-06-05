"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyComment = void 0;
const AppError_1 = __importDefault(require("../config/AppError"));
const Comment_1 = __importDefault(require("../models/Comment"));
const validateCommentCreation_1 = __importDefault(require("../lib/validateCommentCreation"));
const replyComment = async (req, res) => {
    const { user: creator } = req;
    const { body } = req.body;
    const { commentId: parentId } = req.params;
    if (!creator) {
        throw new AppError_1.default("Unauthorized!", 400);
    }
    if (!parentId || !body) {
        throw new AppError_1.default("All fields are required!", 400);
    }
    const foundParent = await Comment_1.default.findById(parentId).exec();
    if (!foundParent) {
        throw new AppError_1.default("Parent comment not found!", 400);
    }
    const replyData = {
        body,
        tweet: foundParent._id.toString(),
        parent: parentId,
        creator: creator._id.toString(),
    };
    const { value: data, error: inputErr } = (0, validateCommentCreation_1.default)(replyData);
    if (inputErr) {
        throw inputErr;
    }
    const newReply = await Comment_1.default.create(data);
    if (!newReply) {
        throw new AppError_1.default("Something went wrong!", 500);
    }
    res.json(newReply);
};
exports.replyComment = replyComment;
