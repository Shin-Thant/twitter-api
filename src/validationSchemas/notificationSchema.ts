import Joi from "joi";
import { objectIdValidator } from "../util/validationHelpers";
import { Dto } from "./types";

interface NotiIdParam {
	notiId: string;
}
const notiIdParamSchema = Joi.object<NotiIdParam, true>({
	notiId: Joi.string().trim().required().custom(objectIdValidator).messages({
		"string.base": "Notification ID must be string!",
		"any.required": "Notification ID is required!",
		"any.custom": "Invalid notification ID!",
	}),
});

export interface UpdateNotiDto extends Dto {
	params: { notiId: string };
}
export const updateNotiSchema = Joi.object<UpdateNotiDto, true>({
	body: Joi.object({}),
	params: notiIdParamSchema,
	query: Joi.object({}),
});
