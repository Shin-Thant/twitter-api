process.on("uncaughtException", () => {
	console.log("Uncaught Exception!"); // production
	console.log("Shutting down...");
	process.exit(1);
});

import dotenv from "dotenv";
import "express-async-errors";
import mongoose from "mongoose";
import app from "./app/app";
import { connectDB } from "./config/database";

dotenv.config();

// connect to database
connectDB();

// start server
const PORT: number = 3500 || process.env.PORT;
const server = app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}!`);
});

mongoose.connection.once("open", () => {
	console.log("✨ Successfully connected to MongoDB!");
});

mongoose.connection.on("error", () => {
	console.log("db err!"); // production
	console.log("Shutting down...");
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
	console.log("Unhandled Rejection!"); // production
	console.log("Shutting down...");
	server.close(() => {
		process.exit(1);
	});
});
