"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commentController_1 = require("../controllers/commentController");
const verifyJWT_1 = __importDefault(require("../middlewares/verifyJWT"));
const verifyCommentOwner_1 = __importDefault(require("../middlewares/verifyCommentOwner"));
const router = (0, express_1.Router)();
router.route("/").post(verifyJWT_1.default, commentController_1.addNewComment);
//* only for testing
router.route("/all").get(commentController_1.getAllComments);
router
    .route("/:commentId")
    .get(commentController_1.getCommentById)
    .put(verifyJWT_1.default, verifyCommentOwner_1.default, commentController_1.updateComment)
    .delete(verifyJWT_1.default, verifyCommentOwner_1.default, commentController_1.deleteComment);
exports.default = router;
