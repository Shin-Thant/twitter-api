"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tweetHelpers_1 = require("../schemaHelpers/tweetHelpers");
// TODO: update model to add shares count
const tweetSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: [true, "Tweet type is requried!"],
    },
    body: String,
    origin: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Tweet",
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    likes: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    shares: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// virtuals
tweetSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "tweet",
});
// middlewares
// TODO: change this middleware into method
tweetSchema.post("save", tweetHelpers_1.populateTweetAfterCreation);
// query helpers
tweetSchema.query.populateRelations = tweetHelpers_1.populateTweetRelations;
const Tweet = (0, mongoose_1.model)("Tweet", tweetSchema);
exports.default = Tweet;
