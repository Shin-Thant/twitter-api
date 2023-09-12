import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import hpp from "hpp";
import path from "path";
import corsOptions from "../config/corsOptions";
import errorHandler from "../middlewares/errorHandler";
import authRoutes from "../routes/authRoutes";
import commentRoutes from "../routes/commentRoutes";
import replyRoutes from "../routes/replyRoutes";
import tweetRoutes from "../routes/tweetRoutes";
import userRoutes from "../routes/userRoutes";

dotenv.config();
const app = express();

// middlewares
app.use(hpp());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(
	"/api/v1/photos/",
	express.static(path.join(__dirname, "..", "..", "public", "uploads"))
);

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tweets", tweetRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/reply", replyRoutes);

// error handler middleware
app.use(errorHandler);

export default app;
