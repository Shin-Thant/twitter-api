import { NextFunction, Request, Response } from "express";
import { LoggerService } from "../services/loggerService";
import { LoggerProvider } from "../util/LoggerProvider";

const loggerService = new LoggerService(
	LoggerProvider.getInstance("AccessLogging")
);

export default function accessLogging(
	req: Request,
	_res: Response,
	next: NextFunction
) {
	loggerService.info(`method: "${req.method}"    url: "${req.url}"`);
	next();
}
