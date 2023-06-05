"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commentController_1 = require("../controllers/commentController");
const tweetController_1 = require("../controllers/tweetController");
const verifyJWT_1 = __importDefault(require("../middlewares/verifyJWT"));
const verifyTweetOwner_1 = __importDefault(require("../middlewares/verifyTweetOwner"));
const router = (0, express_1.Router)();
router.route("/").get(tweetController_1.getTweets).post(verifyJWT_1.default, tweetController_1.createTweet);
router
    .route("/:tweetId")
    .get(tweetController_1.getTweetById)
    .patch(verifyJWT_1.default, verifyTweetOwner_1.default, tweetController_1.updateTweet)
    .delete(verifyJWT_1.default, verifyTweetOwner_1.default, tweetController_1.deleteTweet);
router.route("/:tweetId/like").patch(verifyJWT_1.default, tweetController_1.handleLikes);
router.route("/:tweetId/share").post(verifyJWT_1.default, tweetController_1.shareTweet);
router.route("/:tweetId/comments").get(commentController_1.getTweetComments);
exports.default = router;
