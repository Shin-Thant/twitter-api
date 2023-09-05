import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const validateResource =
	(schema: Joi.AnySchema) =>
	(req: Request, _res: Response, next: NextFunction) => {
		const { value, error } = schema.validate(
			{
				body: req.body,
				query: req.query,
				params: req.params,
			},
			{ abortEarly: false }
		);
		if (error) {
			return next(error);
		}
		req.body = value.body;
		req.query = value.query;
		req.params = value.params;
		next();
	};
export default validateResource;
