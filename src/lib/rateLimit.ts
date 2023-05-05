import rateLimit, { RateLimitExceededEventHandler } from "express-rate-limit";
import AppError from "../config/AppError";

const rateLimitExceedHandler: RateLimitExceededEventHandler = (
	req,
	res,
	next,
	options
) => {
	const exceedLimitErr = new AppError(options.message, options.statusCode);
	res.status(options.statusCode).json(
		exceedLimitErr.createAppErrorResponseBody()
	);
};

const rateLimiter = (maxCount: number, rememberTimeInMs: number) => {
	return rateLimit({
		max: maxCount,
		windowMs: rememberTimeInMs,
		handler: rateLimitExceedHandler,
	});
};

export default rateLimiter;
