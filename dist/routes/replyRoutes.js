"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const replyController_1 = require("../controllers/replyController");
const verifyJWT_1 = __importDefault(require("../middlewares/verifyJWT"));
const router = (0, express_1.Router)();
// /comments/some-id/reply
router.route("/:commentId").post(verifyJWT_1.default, replyController_1.replyComment);
exports.default = router;
