"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const verifyJWT_1 = __importDefault(require("../middlewares/verifyJWT"));
const router = (0, express_1.Router)();
router.get("/", userController_1.searchUsers);
router.get("/me", verifyJWT_1.default, userController_1.getMe);
router.patch("/follow/:userId", verifyJWT_1.default, userController_1.followUser);
router.patch("/unfollow/:userId", verifyJWT_1.default, userController_1.unfollowUser);
router
    .route("/:userId")
    .get(userController_1.getUserById)
    .put(verifyJWT_1.default, userController_1.updateUserGeneralInfo)
    .delete(verifyJWT_1.default, userController_1.deleteUser);
router.get("/:userId/following", userController_1.getUserFollowing);
router.get("/:userId/followers", userController_1.getUserFollowers);
exports.default = router;
