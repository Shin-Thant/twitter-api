"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserGeneralInfo = exports.unfollowUser = exports.followUser = exports.getUserFollowers = exports.getUserFollowing = exports.getUserById = exports.searchUsers = exports.getMe = void 0;
const AppError_1 = __importDefault(require("../config/AppError"));
const isObjectId_1 = __importDefault(require("../lib/isObjectId"));
const pagination_1 = __importDefault(require("../lib/pagination"));
const User_1 = __importDefault(require("../models/User"));
const isValuesNotNumber_1 = require("../util/isValuesNotNumber");
const paginationHelper_1 = __importDefault(require("../util/paginationHelper"));
const validateUserUpdateInput_1 = require("../util/validateUserUpdateInput");
const getMe = async (req, res) => {
    const { user } = req;
    if (!user) {
        throw new AppError_1.default("No user!", 400);
    }
    await user.populate({ path: "following", select: "-following" });
    await user.populate({ path: "followers", select: "-following" });
    res.json(user);
};
exports.getMe = getMe;
const searchUsers = async (req, res) => {
    const { name, currentPage, itemsPerPage } = req.query;
    if (!name || !currentPage || !itemsPerPage) {
        throw new AppError_1.default("All fields is required!", 400);
    }
    if ((0, isValuesNotNumber_1.isValuesNotNumber)(itemsPerPage, currentPage)) {
        throw new AppError_1.default("Enter valid values", 400);
    }
    // \\b\\w*${name}\\w*\\b
    const REGEX_OPTION = { $regex: `.*${name}.*`, $options: "i" };
    const QUERY_FILTER = {
        $or: [{ name: REGEX_OPTION }, { username: REGEX_OPTION }],
    };
    const totalUsers = await User_1.default.countDocuments(QUERY_FILTER);
    const userPagination = new pagination_1.default({
        itemsPerPage: parseInt(itemsPerPage),
        currentPage: parseInt(currentPage),
        totalDocs: totalUsers,
        helper: new paginationHelper_1.default(),
    });
    const users = await User_1.default.find(QUERY_FILTER)
        .select("-following")
        .limit(userPagination.itemsPerPage)
        .skip(userPagination.skip)
        .sort("name")
        .lean()
        .exec();
    res.json(userPagination.createPaginationResult(users));
};
exports.searchUsers = searchUsers;
const getUserById = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return;
    }
    const foundUser = await User_1.default.findOne({ _id: userId })
        .select("-following")
        .lean()
        .exec();
    if (!foundUser) {
        throw new AppError_1.default("User not found!", 400);
    }
    res.json(foundUser);
};
exports.getUserById = getUserById;
const getUserFollowing = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        throw new AppError_1.default("User ID is required!", 400);
    }
    const foundUser = await User_1.default.findById(userId)
        .populate({
        path: "following",
        select: "-following",
    })
        .exec();
    if (!foundUser) {
        throw new AppError_1.default("Invalid ID!", 400);
    }
    res.json(foundUser.following);
};
exports.getUserFollowing = getUserFollowing;
const getUserFollowers = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        throw new AppError_1.default("User ID is required!", 400);
    }
    const foundUser = await User_1.default.findById(userId)
        .populate("followers")
        .exec();
    if (!foundUser) {
        throw new AppError_1.default("Invalid ID!", 400);
    }
    res.json(foundUser.followers);
};
exports.getUserFollowers = getUserFollowers;
const followUser = async (req, res) => {
    const { user: currentUser } = req;
    const { userId } = req.params;
    if (!currentUser || !userId) {
        throw new AppError_1.default("All fields are required!", 400);
    }
    const foundUser = await validateFollowId(currentUser._id.toString(), userId);
    if (currentUser.following.indexOf(userId) !== -1) {
        throw new AppError_1.default("Already followed!", 400);
    }
    // updates
    currentUser.following.push(userId);
    currentUser.counts.following += 1;
    await currentUser.save();
    foundUser.counts.followers += 1;
    await foundUser.save();
    res.json({ message: `Followed ${foundUser.username}!` });
};
exports.followUser = followUser;
const unfollowUser = async (req, res) => {
    const { user } = req;
    const { userId } = req.params;
    if (!user || !userId) {
        throw new AppError_1.default("All fields are required!", 400);
    }
    const foundUser = await validateFollowId(user._id.toString(), userId);
    const index = user.following.indexOf(userId);
    if (index === -1) {
        throw new AppError_1.default("Invalid user!", 400);
    }
    user.following.splice(index, index + 1);
    await user.save();
    res.json({ message: `Unfollowed ${foundUser.username}!` });
};
exports.unfollowUser = unfollowUser;
async function validateFollowId(loginedUserId, userId) {
    if (!(0, isObjectId_1.default)(userId)) {
        throw new AppError_1.default("Invalid user!", 400);
    }
    if (loginedUserId === userId) {
        throw new AppError_1.default("Bad request!", 400);
    }
    const foundUser = await User_1.default.findById(userId).exec();
    if (!foundUser) {
        throw new AppError_1.default("Invalid user!", 400);
    }
    return foundUser;
}
const updateUserGeneralInfo = async (req, res) => {
    const { name, avatar } = req.body;
    const { userId } = req.params;
    if (!userId || !name) {
        throw new AppError_1.default("All fields are required!", 400);
    }
    const user = await User_1.default.findById(userId).exec();
    if (!user) {
        throw new AppError_1.default("Invalid user id!", 400);
    }
    const inputs = { name, avatar: avatar || "" };
    const { value, error } = (0, validateUserUpdateInput_1.validateUserUpdateInput)(inputs);
    if (error) {
        throw error;
    }
    const duplicateUser = await User_1.default.findOne({ name })
        .collation({
        locale: "en",
        strength: 2,
    })
        .lean()
        .exec();
    if (duplicateUser && duplicateUser._id.toString() !== userId) {
        throw new AppError_1.default("User name already existed!", 400);
    }
    // update user
    user.name = value.name;
    user.avatar = value.avatar;
    await user.save();
    res.json(user);
};
exports.updateUserGeneralInfo = updateUserGeneralInfo;
const deleteUser = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        throw new AppError_1.default("User ID is required!", 400);
    }
    const user = await User_1.default.findById(userId).exec();
    if (!user) {
        throw new AppError_1.default("User not found!", 400);
    }
    await user.deleteOne();
    // TODO: test this work
    const result = await User_1.default.updateMany({ _id: { $in: user.following } }, { $inc: { "counts.followers": -1 } }).exec();
    console.log(result);
    res.json({ message: "User deleted successfully!" });
};
exports.deleteUser = deleteUser;
