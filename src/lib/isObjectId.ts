import { isValidObjectId } from "mongoose";

export default function isObjectId(id: string) {
	return isValidObjectId(id);
}
