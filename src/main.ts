import dotenv from "dotenv";
import "express-async-errors";
import cookieParser from "cookie-parser";
import express from "express";
import mongoose, { MongooseError } from "mongoose";
import errorHandler from "./middlewares/errorHandler";
import authRoutes from "./routes/authRoutes";
import tweetRoutes from "./routes/tweetRoutes";
import userRoutes from "./routes/userRoutes";
import connectDB from "./config/connectDB";

// TODO: use `hpp` package for http parameter pollution

dotenv.config();
const app = express();

// connect to database
connectDB();

// middlewares
app.use(cookieParser());
app.use(express.json());

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tweets", tweetRoutes);

// error handler middleware
app.use(errorHandler);

// start server
const PORT: number = 3500 || process.env.PORT;
mongoose.connection.once("open", () => {
	console.log("✨ Successfully connected to MongoDB!");

	app.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}!`);
	});
});

mongoose.connection.on("error", (err: MongooseError) => {
	console.log({ name: err.name, message: err.message });
});
mongoose.connection.on("disconnected", () => {
	console.log("disconnected!");
});
