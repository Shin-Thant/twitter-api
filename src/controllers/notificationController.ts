import { Request, Response } from "express";
import {
	findManyNotifications,
	findNoti,
	getNotiCount,
	updateManyNotis,
} from "../services/notificationService";
import { UserDoc } from "../models/types/userTypes";
import { PaginationDto } from "../validationSchemas/paginationSchema";
import PaginationImpl from "../lib/pagination";
import PaginationHelperImpl from "../util/paginationHelper";
import AppError from "../config/AppError";
import { UpdateNotiDto } from "../validationSchemas/notificationSchema";

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
			sort: "-createdAt",
		},
	});
	res.json(pagination.createPaginationResult(notis));
};

export const markAllNotiAsRead = async (req: Request, res: Response) => {
	const loginUser = req.user as UserDoc;

	await updateManyNotis({
		filter: {
			recipient: loginUser._id,
			isRead: false,
		},
		update: { isRead: true },
	});
	res.json({ message: "Updated successfully." });
};

export const markNotiAsRead = async (
	req: Request<UpdateNotiDto["params"]>,
	res: Response
) => {
	const loginUser = req.user as UserDoc;

	const foundNoti = await findNoti({
		filter: {
			_id: req.params.notiId,
			isRead: false,
			recipient: loginUser._id,
		},
	});
	if (!foundNoti) {
		throw new AppError("Notification not found!", 400);
	}

	foundNoti.isRead = true;
	await foundNoti.save();
	res.json(foundNoti);
};
