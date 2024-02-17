process.on("uncaughtException", (e) => {
	console.log("Uncaught Exception!", e);
	console.log("Shutting down...");
	process.exit(1);
});

import { createServer } from "http";
import mongoose, { Types } from "mongoose";
import app from "./app/app";
import { connectDB } from "./config/database";
import User from "./models/User";
import { connectRedis, setUserPrivateRoom } from "./redis";
import { LoggerService } from "./services/loggerService";
import { CreateSocketServer } from "./socket";
import { LoggerProvider } from "./util/LoggerProvider";

const PORT: number = 3500 || process.env.PORT;
const logger = new LoggerService(LoggerProvider.getInstance("Server"));

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

io.on("connection", async (socket) => {
	const user = await User.findOne({ _id: socket.data.userID }).lean().exec();
	if (!user) return;

	const privateUserRoom = `${socket.data.userID}-${socket.id}`;
	await setUserPrivateRoom(socket.data.userID, privateUserRoom);

	socket.join(privateUserRoom);
	logger.info(`New user joined: ${socket.data.userID}`);

	socket.on("disconnect", () => {
		logger.info(`User disconnected: ${socket.id}`);
	});

	// connect to followed user room
	user.following.forEach((followedUser) => {
		logger.info(`User joined to ${followedUser} room.`);
		socket.join((followedUser as unknown as Types.ObjectId).toString());
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

mongoose.connection.on("error", () => {
	logger.error("Database err!");
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

process.on("unhandledRejection", () => {
	logger.error("Unhandled Rejection!"); // production
	logger.info("Shutting down...");
	server.close(() => {
		logger.info("Server closed!");
		process.exit(1);
	});
});
