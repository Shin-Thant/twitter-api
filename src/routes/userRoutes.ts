import { Router } from "express";
import {
	deleteUser,
	followUser,
	getMe,
	getUserById,
	getUserFollowers,
	getUserFollowing,
	searchUsers,
	unfollowUser,
	updateUserGeneralInfo,
} from "../controllers/userController";
import verifyJWT from "../middlewares/verifyJWT";

const router = Router();

router.get("/", searchUsers);
router.get("/me", verifyJWT, getMe);

router.patch("/follow/:userId", verifyJWT, followUser);
router.patch("/unfollow/:userId", verifyJWT, unfollowUser);

router.route("/:userId").get(getUserById).put(verifyJWT, updateUserGeneralInfo);
// .delete(verifyJWT, deleteUser);

router.get("/:userId/following", getUserFollowing);
router.get("/:userId/followers", getUserFollowers);

export default router;
