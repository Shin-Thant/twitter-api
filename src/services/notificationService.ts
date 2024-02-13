import Notification, {
	NotiType,
	NotificationSchema,
} from "../models/Notification";
import { FindMany, FindOne, GetCount, UpdateOne } from "./types";

type NotiTypeKey = "LIKE_TWEET" | "LIKE_COMMENT" | "COMMENT" | "REPLY";
export const Noti: Record<NotiTypeKey, NotiType> = {
	LIKE_TWEET: "like:tweet",
	LIKE_COMMENT: "like:comment",
	COMMENT: "comment",
	REPLY: "reply",
} as const;

interface INotificationInput {
	recipientID: string;
	triggerUserID: string;
	type: NotiType;
	docID: string;
	message: string;
}

export async function createNotification(input: INotificationInput) {
	return await Notification.create({
		recipient: input.recipientID,
		triggerBy: input.triggerUserID,
		type: input.type,
		doc: input.docID,
		message: input.message,
	});
}

export async function findManyNotifications(
	args: FindMany<NotificationSchema>
) {
	return await Notification.find(args.filter, args.projection, args.options);
}

export async function getNotiCount(args: GetCount<NotificationSchema>) {
	return await Notification.countDocuments(args.filter, args.options);
}

export async function updateManyNotis(args: UpdateOne<NotificationSchema>) {
	return await Notification.updateMany(
		args.filter,
		args.update,
		args.options
	);
}

export async function findNoti(args: FindOne<NotificationSchema>) {
  return await Notification.findOne(args.filter, args.projection, args.options)
}
