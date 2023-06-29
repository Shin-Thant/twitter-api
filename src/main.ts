process.on("uncaughtException", () => {
	console.log("Uncaught Exception!"); // production
	console.log("Shutting down...");
	process.exit(1);
});

import mongoose from "mongoose";
import app from "./app/app";
import { connectDB } from "./config/database";
import logger from "./util/logger";

const PORT: number = 3500 || process.env.PORT;

// start server
const server = app.listen(PORT, async () => {
	logger.info(`Server listening on port ${PORT}!`);
	await connectDB();
});

mongoose.connection.once("open", () => {
	logger.info("Successfully connected to DB!");
});

mongoose.connection.on("error", () => {
	logger.error("db err!"); // production
	logger.error("Shutting down...");
	server.close(() => {
		process.exit(1);
	});
});
mongoose.connection.on("disconnected", () => {
	console.log("disconnected!");
	console.log("Shutting down...");
	server.close(() => {
		process.exit(1);
	});
});

process.on("unhandledRejection", () => {
	logger.error("Unhandled Rejection!"); // production
	logger.error("Shutting down...");
	server.close(() => {
		process.exit(1);
	});
});
