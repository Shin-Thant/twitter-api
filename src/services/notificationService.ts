import Notification, {
	NotiType,
	NotificationSchema,
} from "../models/Notification";
import { FindMany, GetCount } from "./types";

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
}

export async function createNotification(input: INotificationInput) {
	return await Notification.create({
		recipient: input.recipientID,
		triggerBy: input.triggerUserID,
		type: input.type,
		doc: input.docID,
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
