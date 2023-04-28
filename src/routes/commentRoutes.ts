import { Router } from "express";
import {
	addNewComment,
	deleteComment,
	getCommentById,
	updateComment,
	getAllComments,
} from "../controllers/commentController";
import verifyJWT from "../middlewares/verifyJWT";
import verifyCommentOwner from "../middlewares/verifyCommentOwner";

const router = Router();

router.route("/").post(verifyJWT, addNewComment);

//* only for testing
router.route("/all").get(getAllComments);

router
	.route("/:commentId")
	.get(getCommentById)
	.put(verifyJWT, verifyCommentOwner, updateComment)
	.delete(verifyJWT, verifyCommentOwner, deleteComment);

export default router;
