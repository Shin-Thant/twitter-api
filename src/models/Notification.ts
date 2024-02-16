import { Schema, Types, model } from "mongoose";

export type NotiType = "like:tweet" | "like:comment" | "comment" | "reply";

export type NotificationSchema = {
	recipient: Types.ObjectId;
	triggerBy: Types.ObjectId;
	isRead: boolean;
	type: NotiType;
	doc: Types.ObjectId;
	message: string;
};

const notificationSchema = new Schema<NotificationSchema>(
	{
		recipient: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		triggerBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		isRead: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			required: true,
			enum: ["like:tweet", "like:comment", "comment", "reply"],
		},
		doc: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "Tweet",
		},
		message: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Notification = model("Notification", notificationSchema);
export default Notification;
