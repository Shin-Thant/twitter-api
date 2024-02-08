import { Request, Response } from "express";
import AppError from "../config/AppError";
import PaginationImpl from "../lib/pagination";
import { FilesInRequest } from "../middlewares/tweetBodyOrImage";
import { TweetDoc } from "../models/types/tweetTypes";
import { UserDoc } from "../models/types/userTypes";
import { deleteManyComments } from "../services/commentServices";
import {
	deleteManyImages,
	generateManyImageNames,
	getNewImageNames,
	getNewImages,
	getRemovedImageNames,
	getUpdatedImageNames,
	saveManyImages,
} from "../services/imageServices";
import {
	createTweet,
	deleteTweet,
	findManyTweets,
	findTweet,
	getTweetCount,
	handleTweetLikes,
	updateTweet,
} from "../services/tweetServices";
import { TypedRequestBody } from "../types/requestTypes";
import PaginationHelperImpl from "../util/paginationHelper";
import {
	CreateTweetInput,
	EditTweetInput,
	GetTweetByIdInput,
	GetTweetsInput,
	LikeTweetInput,
	ShareTweetInput,
} from "../validationSchemas/tweetSchema";
import { io } from "../main";
import { Noti, createNotification } from "../services/notificationService";
import { NotiMessage } from "../util/notiMessage";
import { findUser } from "../services/userServices";

const paginationHelper = new PaginationHelperImpl();

export type TweetParams = { tweetId?: string };

export const getTweets = async (
	req: Request<object, object, object, GetTweetsInput["query"]>,
	res: Response
) => {
	const { currentPage, itemsPerPage } = req.query;

	const totalTweets = await getTweetCount({ filter: {} });

	const pagination = new PaginationImpl({
		itemsPerPage: itemsPerPage,
		currentPage: currentPage,
		totalDocs: totalTweets,
		helper: paginationHelper,
	});

	if (pagination.isCurrentPageExceeded()) {
		return res.json(pagination.createPaginationResult([]));
	}

	const tweets = await findManyTweets({
		filter: {},
		options: {
			populate: [
				{
					path: "origin",
					populate: { path: "owner", select: "-email" },
				},
				{ path: "owner", select: "-email" },
				{
					path: "shares",
					select: ["_id", "origin", "body", "owner", "type"],
				},
				{
					path: "comments",
					populate: {
						path: "owner",
						select: "-email",
					},
					match: {
						origin: { $exists: false },
					},
				},
			],
			limit: pagination.itemsPerPage * pagination.currentPage,
			sort: "-createdAt",
		},
	});

	res.json(pagination.createPaginationResult<typeof tweets>(tweets));
};

export const getTweetById = async (
	req: Request<GetTweetByIdInput["params"]>,
	res: Response
) => {
	const { tweetId } = req.params;

	const tweet = await findTweet({
		filter: { _id: tweetId },
		options: {
			populate: [
				{ path: "owner", select: "-email" },
				{
					path: "comments",
					populate: { path: "owner", select: "-email" },
					match: {
						origin: { $exists: false },
					},
				},
				{
					path: "origin",
					populate: { path: "owner", select: "-email" },
				},
				{
					path: "shares",
					select: ["_id", "origin", "body", "type", "owner"],
				},
			],
		},
	});

	if (!tweet) {
		throw new AppError("Invalid ID!", 400);
	}
	res.json(tweet);
};

export const createTweetHandler = async (
	req: TypedRequestBody<CreateTweetInput["body"]>,
	res: Response
) => {
	const { body } = req.body;
	const owner = req.user as UserDoc;
	const files = req.files as FilesInRequest;
	const imageNames: string[] = generateManyImageNames({
		images: files ?? [],
	});

	const newTweet = await createTweet({
		type: "post",
		body: body,
		owner: owner._id.toString(),
		images: imageNames,
	});
	if (!newTweet) {
		throw new AppError("Internal Server Error", 500);
	}

	// save images
	if (files?.length) {
		await saveManyImages({ images: files, names: imageNames });
	}

	res.json(newTweet);
};

export const shareTweet = async (
	req: Request<ShareTweetInput["params"], object, ShareTweetInput["body"]>,
	res: Response
) => {
	const owner = req.user as UserDoc;
	const { tweetId } = req.params;
	const { body } = req.body;
	const files = req.files as FilesInRequest;

	const originTweet = await findTweet({
		filter: { _id: tweetId },
		options: { lean: true },
	});
	if (!originTweet) {
		throw new AppError("Invalid tweet ID!", 400);
	}

	const imageNames = generateManyImageNames({ images: files ?? [] });

	// create share tweet
	const newSharedTweet = await createTweet({
		type: "share",
		body,
		origin: tweetId,
		owner: owner._id.toString(),
		images: imageNames,
	});
	if (!newSharedTweet) {
		throw new AppError("Some went wrong", 500);
	}

	// update original tweet
	await updateTweet({
		filter: { _id: tweetId },
		update: {
			$push: {
				shares: newSharedTweet._id,
			},
		},
	});

	// save images
	if (files?.length) {
		await saveManyImages({ images: files, names: imageNames });
	}

	res.json(newSharedTweet);
};

export const editTweetHandler = async (
	req: Request<EditTweetInput["params"], object, EditTweetInput["body"]>,
	res: Response
) => {
	const { body } = req.body;
	const tweet = req.tweet as TweetDoc;
	const files = req.files as FilesInRequest;

	const updatedImageNames = getUpdatedImageNames({
		oldImageNames: tweet.images,
		uploadedImages: !files?.length ? [] : files,
	});

	const updatedTweet = await updateTweet({
		filter: { _id: tweet._id },
		update: {
			body,
			images: updatedImageNames,
		},
		options: { new: true },
	});

	const newImages = getNewImages({
		uploadedImages: !files?.length ? [] : files,
		oldImageNames: tweet.images,
	});
	const newImageNames = getNewImageNames({
		oldImageNames: tweet.images,
		updatedImageNames,
	});
	if (newImages.length) {
		await saveManyImages({ images: newImages, names: newImageNames });
	}

	const removedImageNames = getRemovedImageNames({
		oldImageNames: tweet.images,
		updatedImageNames,
	});

	console.log({ newImageNames, removedImageNames, updatedImageNames });

	if (removedImageNames.length) {
		await deleteManyImages({ imageNames: removedImageNames });
	}

	res.json(updatedTweet);
};

export const handleLikes = async (
	req: Request<LikeTweetInput["params"]>,
	res: Response
) => {
	const user = req.user as UserDoc;
	const { tweetId } = req.params;

	const tweet = await findTweet({ filter: { _id: tweetId } });
	if (!tweet) {
		throw new AppError("Invalid tweet ID!", 400);
	}

	const isLiked = tweet.likes.includes(user._id);

	const updatedTweet = await handleTweetLikes({
		filter: { _id: tweetId },
		action: isLiked ? "unlike" : "like",
		item: user._id,
		options: { new: true },
	});

	if (!isLiked && user._id.toString() !== tweet.owner._id.toString()) {
		const recipient = await findUser({
			filter: { _id: tweet.owner._id },
			projection: { name: true },
		});
		if (recipient) {
			const noti = await createNotification({
				recipientID: tweet.owner._id.toString(),
				triggerUserID: user._id.toString(),
				docID: tweetId,
				type: Noti.LIKE_TWEET,
				message: NotiMessage.getLikeTweetMessage(`@${user.name}`),
			});
			io.to(tweet.owner._id.toString()).emit("notify", noti);
		}
	}

	res.json(updatedTweet);
};

export const deleteTweetHandler = async (
	req: Request<TweetParams>,
	res: Response
) => {
	const { tweet } = req;
	if (!tweet) {
		throw new AppError("Invalid Tweet ID!", 400);
	}

	await deleteTweet({ filter: { _id: tweet._id.toString() } });

	if (tweet.images?.length) {
		await deleteManyImages({ imageNames: tweet.images });
	}

	await deleteManyComments({ filter: { tweet: tweet._id } });
	if (tweet.type === "share" && tweet.origin) {
		// remove one item from original tweet shares
		await updateTweet({
			filter: { _id: tweet.origin.toString() },
			update: {
				$pull: {
					shares: tweet._id.toString(),
				},
			},
		});
	}
	res.json({ status: "success", message: "Tweet deleted successfully!" });
};
