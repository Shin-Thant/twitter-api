"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const findDuplicateWithUsernameAndEmail = async (username, email) => {
    const duplicateEmail = await User_1.default.findOne({ email }).lean().exec();
    const duplicateUsername = await User_1.default.findOne({ username }).lean().exec();
    return {
        duplicateUsername: duplicateUsername,
        duplicateEmail: duplicateEmail,
    };
};
exports.default = findDuplicateWithUsernameAndEmail;
