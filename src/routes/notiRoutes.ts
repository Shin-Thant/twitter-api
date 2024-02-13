import { Router } from "express";
import verifyJWT from "../middlewares/verifyJWT";
import {
	getNotification,
	markAllNotiAsRead,
	markNotiAsRead,
} from "../controllers/notificationController";
import validateResource from "../middlewares/validateResource";
import { paginationSchema } from "../validationSchemas/paginationSchema";
import { updateNotiSchema } from "../validationSchemas/notificationSchema";

const router = Router();

router.use(verifyJWT);

router.get("/", [validateResource(paginationSchema)], getNotification);
router.route("/mark-all-read").put(markAllNotiAsRead);
router.patch(
	"/:notiId/mark-read/",
	[validateResource(updateNotiSchema)],
	markNotiAsRead
);

export default router;
