import dotenv from "dotenv";
import "express-async-errors";
import mongoose, { MongooseError } from "mongoose";
import app from "./app/app";
import { connectDB } from "./config/database";

// TODO: use `hpp` package for http parameter pollution

dotenv.config();
// const app = express();

// connect to database
connectDB();

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
