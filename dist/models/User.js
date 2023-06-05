"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: [true, "Username is required!"],
        unique: true,
    },
    following: [
        {
            ref: "User",
            type: mongoose_1.Schema.Types.ObjectId,
        },
    ],
    name: {
        type: String,
        maxlength: [20, "Name is too long!"],
        required: [true, "Name is required!"],
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        select: false,
        minlength: [7, "Password must has at least 7 letters!"],
    },
    avatar: {
        type: String,
    },
    counts: {
        followers: {
            type: Number,
            default: 0,
        },
        following: {
            type: Number,
            default: 0,
        },
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
userSchema.virtual("followers", {
    ref: "User",
    localField: "_id",
    foreignField: "following",
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
