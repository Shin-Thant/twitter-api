import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
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
			ref: function (this: { type: NotiType }) {
				const ref = getRefFrom(this.type);
				console.log(ref);
				return ref;
			},
		},
	},
	{
		timestamps: true,
	}
);

export type NotiType = "like:tweet" | "like:comment" | "comment" | "reply";
const NOTI_TYPES: Record<NotiType, NotiType> = {
	"like:tweet": "like:tweet",
	"like:comment": "like:comment",
	comment: "comment",
	reply: "reply",
} as const;
function getRefFrom(type: NotiType): NotiType {
	return NOTI_TYPES[type];
}

export default model("Notification", notificationSchema);
