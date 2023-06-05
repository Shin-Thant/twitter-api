"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.populateTweetRelations = exports.populateTweetAfterCreation = void 0;
async function populateTweetAfterCreation() {
    await this.populate({
        path: "origin",
        populate: { path: "owner", select: "-email" },
    });
    await this.populate({
        path: "owner",
        select: "-email",
    });
    await this.populate({
        path: "likes",
        select: "-email",
    });
}
exports.populateTweetAfterCreation = populateTweetAfterCreation;
const populateTweetRelations = function (options) {
    const result = this.populate({
        path: "origin",
        populate: { path: "owner", select: "-email" },
    }).populate({ path: "owner", select: "-email" });
    if (options?.populateUser) {
        result.populate({ path: "likes", select: "-email" });
    }
    if (options?.populateComments) {
        result.populate({
            path: "comments",
            populate: { path: "creator", select: "-email" },
        });
    }
    return result;
};
exports.populateTweetRelations = populateTweetRelations;
