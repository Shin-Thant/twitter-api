import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export default function isObjectId(id: string): boolean {
	return ObjectId.isValid(id);
}
