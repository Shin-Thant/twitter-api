import Joi from "joi";
import { Dto } from "./types";

export interface PaginationDto extends Dto {
	query: { currentPage: number; itemsPerPage: number };
}
export const paginationSchema = Joi.object<PaginationDto, true>({
	body: Joi.object({}),
	params: Joi.object({}),
	query: Joi.object({
		currentPage: Joi.number().required().messages({
			"number.base": "Current page must be number!",
			"any.required": "Current page is required!",
		}),
		itemsPerPage: Joi.number().required().messages({
			"number.base": "Items per page must be number!",
			"any.required": "Items per page is required!",
		}),
	}),
});
