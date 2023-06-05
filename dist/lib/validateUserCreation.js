"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const userSchema = joi_1.default.object({
    username: joi_1.default
        .string()
        .max(15)
        .trim()
        .required()
        .error(new Error("Enter valid username!")),
    name: joi_1.default
        .string()
        .trim()
        .max(25)
        .required()
        .error(new Error("Enter valid name!")),
    email: joi_1.default
        .string()
        .trim()
        .email()
        .required()
        .error(new Error("Enter valid email!")),
    password: joi_1.default
        .string()
        .trim()
        .min(7)
        .required()
        .error(new Error("Enter valid password!")),
    avatar: joi_1.default.string().trim().error(new Error("Enter valid avatar!")),
});
const santitizeUserData = (user) => {
    return userSchema.validate(user);
};
exports.default = santitizeUserData;
