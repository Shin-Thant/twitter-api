import rateLimit, { RateLimitExceededEventHandler } from "express-rate-limit";

const rateLimitExceedHandler: RateLimitExceededEventHandler = (
	req,
	res,
	next,
	options
) => {
	res.status(options.statusCode).json({
		status: "fail",
		message: options.message,
	});
};

const limiter = (maxCount: number, rememberTimeInMs: number) => {
	return rateLimit({
		max: maxCount,
		windowMs: rememberTimeInMs,
		handler: rateLimitExceedHandler,
	});
};

export default limiter;
