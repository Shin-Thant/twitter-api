import express from "express";
import {
	getUserById,
	searchUsers,
	updateUserGeneralInfo,
} from "../controllers/userController";
import verifyJWT from "../middlewares/verifyJWT";

const router = express.Router();

router.get("/", searchUsers);
router.route("/:userId").get(getUserById).put(verifyJWT, updateUserGeneralInfo);

export default router;
