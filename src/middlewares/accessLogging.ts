import { NextFunction, Request, Response } from "express";
import logger from "../util/logger";

export default function accessLogging(
	req: Request,
	_res: Response,
	next: NextFunction
) {
	logger.info(`method: "${req.method}"    url: "${req.url}"`);
	next();
}
