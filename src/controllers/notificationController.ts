import { Request, Response } from "express";
import {
	findManyNotifications,
	getNotiCount,
} from "../services/notificationService";
import { UserDoc } from "../models/types/userTypes";
import { PaginationDto } from "../validationSchemas/paginationSchema";
import PaginationImpl from "../lib/pagination";
import PaginationHelperImpl from "../util/paginationHelper";

const paginationHelper = new PaginationHelperImpl();

export const getNotification = async (
	req: Request<object, object, object, PaginationDto["query"]>,
	res: Response
) => {
	const loginUser = req.user as UserDoc;
	const totalDocs = await getNotiCount({
		filter: {
			recipient: loginUser._id,
		},
	});

	const pagination = new PaginationImpl({
		itemsPerPage: req.query.itemsPerPage,
		currentPage: req.query.currentPage,
		totalDocs: totalDocs,
		helper: paginationHelper,
	});
	if (pagination.isCurrentPageExceeded()) {
		return res.json(pagination.createPaginationResult([]));
	}

	const notis = await findManyNotifications({
		filter: {
			recipient: loginUser._id,
		},
		options: {
			populate: [
				{
					path: "triggerBy",
					select: ["_id", "username", "name", "avatar"],
				},
			],
		},
	});
	res.json(pagination.createPaginationResult(notis));
};
