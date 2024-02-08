import { Router } from "express";
import verifyJWT from "../middlewares/verifyJWT";
import { getNotification } from "../controllers/notificationController";
import validateResource from "../middlewares/validateResource";
import { paginationSchema } from "../validationSchemas/paginationSchema";

const router = Router();

router.use(verifyJWT);

router.get("/", [validateResource(paginationSchema)], getNotification);

export default router;
