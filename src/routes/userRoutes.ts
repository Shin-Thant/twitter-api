import {Router} from "express";
import {
	deleteUser,
	getUserById,
	searchUsers,
	updateUserGeneralInfo,
} from "../controllers/userController";
import verifyJWT from "../middlewares/verifyJWT";

const router = Router();

router.get("/", searchUsers);
router
	.route("/:userId")
	.get(getUserById)
	.put(verifyJWT, updateUserGeneralInfo)
	.delete(verifyJWT, deleteUser);

export default router;
