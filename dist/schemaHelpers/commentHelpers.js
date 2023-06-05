"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllNestedComments = exports.populateCommentRelations = exports.populateCommentAfterCreation = void 0;
const Comment_1 = __importDefault(require("../models/Comment"));
async function populateCommentAfterCreation() {
    await this.populate({ path: "creator", select: "-email" });
}
exports.populateCommentAfterCreation = populateCommentAfterCreation;
const populateCommentRelations = function (options) {
    const result = this.populate({
        path: "creator",
        select: "-email",
    });
    if (options?.populateComments) {
        result.populate({
            path: "comments",
            populate: { path: "creator", select: "-email" },
        });
    }
    return result;
};
exports.populateCommentRelations = populateCommentRelations;
async function deleteAllNestedComments(next) {
    const replies = await Comment_1.default.find({ parent: this._id }).exec();
    if (!replies.length) {
        next();
    }
    //* This implementation is not optimal. Try something later...
    // TODO: fix this in the future
    await Promise.all(replies.map(async (reply) => {
        return reply.deleteOne();
    }));
    next();
}
exports.deleteAllNestedComments = deleteAllNestedComments;
