import { CustomValidator } from "joi";
import isObjectId from "../lib/isObjectId";

export const objectIdValidator: CustomValidator = (value: string) => {
	if (!isObjectId(value)) {
		throw new Error("Invalid ID!");
	}
	return value;
};
