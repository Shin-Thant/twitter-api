"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const tweetSchema = joi_1.default.object({
    type: joi_1.default.string()
        .trim()
        .required()
        .error(new Error("Enter valid tweet type!")),
    body: joi_1.default.string().trim().error(new Error("Enter valid body!")),
    origin: joi_1.default.string().trim().error(new Error("Enter valid tweet origin!")),
    owner: joi_1.default.string()
        .trim()
        .required()
        .error(new Error("Enter valid owner!")),
});
const santitizeTweetData = (tweet) => {
    return tweetSchema.validate(tweet);
};
exports.default = santitizeTweetData;
