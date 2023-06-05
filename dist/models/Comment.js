"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentHelpers_1 = require("../schemaHelpers/commentHelpers");
const commentSchema = new mongoose_1.Schema({
    body: {
        type: String,
        required: [true, "Comment body is required!"],
    },
    creator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Creator ID is required!"],
    },
    tweet: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Tweet",
    },
    parent: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Comment",
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
commentSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "parent",
});
// middlewares
commentSchema.pre("deleteOne", { document: true, query: false }, commentHelpers_1.deleteAllNestedComments);
commentSchema.post("save", commentHelpers_1.populateCommentAfterCreation);
// query helpers
commentSchema.query.populateRelations = commentHelpers_1.populateCommentRelations;
const Comment = (0, mongoose_1.model)("Comment", commentSchema);
exports.default = Comment;
