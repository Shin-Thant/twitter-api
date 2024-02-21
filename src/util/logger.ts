import { LoggerService } from "../services/loggerService";
import { LoggerProvider } from "./LoggerProvider";

export const logger = new LoggerService(LoggerProvider.getInstance("Server"));

export const socketLogger = new LoggerService(
	LoggerProvider.getInstance("Socket")
);

export const redisLogger = new LoggerService(
	LoggerProvider.getInstance("Redis")
);
