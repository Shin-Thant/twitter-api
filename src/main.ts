process.on("uncaughtException", (e) => {
	console.log("Uncaught Exception!", e);
	console.log("Shutting down...");
	process.exit(1);
});

import { createServer } from "http";
import mongoose from "mongoose";
import app from "./app/app";
import { connectDB } from "./config/database";
import { connectRedis, setUserPrivateRoom } from "./redis";
import { CreateSocketServer } from "./socket";
import { joinFollowedUsersRooms } from "./socket/socketServices";
import { logger, socketLogger } from "./util/logger";

const PORT: number = 3500 || process.env.PORT;

const httpServer = createServer(app);
export const io = CreateSocketServer(httpServer);

connectRedis();

io.use((socket, next) => {
	const userID = socket.handshake.auth?.userID;
	if (!userID || typeof userID !== "string") {
		return next(new Error("No user id!"));
	}
	socket.data.userID = userID;
	next();
});

io.on("connection", (socket) => {
	const userID = socket.data.userID;

	const reactRoom = `${userID}-${socket.id}`;
	socket.join(reactRoom);
	socketLogger.info(`User ${userID} joined ${reactRoom} room.`);

	// set user private room
	setUserPrivateRoom(userID, reactRoom).catch((e) => {
		socketLogger.error({
			RedisError: {
				SetDataError: e,
			},
		});
	});

	socket.on("disconnect", () => {
		socketLogger.info(`User disconnected: ${socket.id}`);
	});

	joinFollowedUsersRooms(userID, socket).catch((e: unknown) => {
		socketLogger.error({
			JoinFollowedUsersRoomsError: e,
		});
	});
});

// start server
const server = httpServer.listen(PORT, async () => {
	logger.info(`Server listening on port ${PORT}!`);
	await connectDB();

	if (process.env.NODE_ENV === "production") {
		process.on("SIGTERM", () => {
			logger.debug("Graceful shutdown...");
			server.close(() => {
				logger.info("Server closed!");
			});
		});
	}
});

mongoose.connection.once("open", () => {
	logger.info("Successfully connected to DB!");
});

mongoose.connection.on("error", (err) => {
	logger.error({ DatabaseError: err });
	logger.info("Shutting down...");
	server.close(() => {
		logger.info("Server closed!");
		return process.exit(1);
	});
});
mongoose.connection.on("disconnected", () => {
	logger.error("Database disconnected!");
	logger.info("Shutting down...");
	server.close(() => {
		logger.info("Server closed!");
		return process.exit(1);
	});
});

process.on("unhandledRejection", (err) => {
	logger.error({
		UnhandledRejection: err,
	});
	logger.info("Shutting down...");
	server.close(() => {
		logger.info("Server closed!");
		process.exit(1);
	});
});
