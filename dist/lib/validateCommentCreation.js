"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const commentSchema = joi_1.default.object({
    body: joi_1.default.string()
        .max(200)
        .trim()
        .required()
        .error(new Error("Valid Comment Body!")),
    tweet: joi_1.default.string()
        .trim()
        .required()
        .error(new Error("Tweet ID must be string!")),
    creator: joi_1.default.string()
        .trim()
        .required()
        .error(new Error("Creator ID must be string!")),
    parent: joi_1.default.string().trim().error(new Error("Parent ID must be string!")),
});
// use this in controller
const santitizeCommentData = (data) => {
    return commentSchema.validate(data);
};
exports.default = santitizeCommentData;
