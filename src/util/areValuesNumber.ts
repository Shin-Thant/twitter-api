import Joi from "joi";

const numberSchema = Joi.number().required();

export const areValuesNumber = (...values: unknown[]): boolean => {
	return values.every((item) => {
		return !numberSchema.validate(item).error;
	});
};
