"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserUpdateInput = void 0;
const joi_1 = __importDefault(require("joi"));
const userUpdateSchema = joi_1.default.object({
    name: joi_1.default.string()
        .trim()
        .max(25)
        .required()
        .error(new Error("Enter valid user name!")),
    avatar: joi_1.default.string().trim().error(new Error("Enter valid avatar")),
});
const validateUserUpdateInput = (updates) => {
    return userUpdateSchema.validate({ ...updates });
};
exports.validateUserUpdateInput = validateUserUpdateInput;
