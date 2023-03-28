import "express-async-errors";
import express from "express";
import mongoose, { MongooseError } from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler";
import connectDB from "./config/connectDB";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

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

// error handler middleware
app.use(errorHandler);

// start server
const PORT: number = 3500 || process.env.PORT;
mongoose.connection.once("open", () => {
	console.log("✨Successfully connected to MongoDB!");

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
