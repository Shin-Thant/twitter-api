import "express-async-errors";
import express from "express";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import cors from "cors";
import errorHandler from "../middlewares/errorHandler";
import authRoutes from "../routes/authRoutes";
import tweetRoutes from "../routes/tweetRoutes";
import userRoutes from "../routes/userRoutes";
import replyRoutes from "../routes/replyRoutes";
import commentRoutes from "../routes/commentRoutes";
import corsOptions from "../config/corsOptions";

const app = express();

// middlewares
app.use(hpp());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tweets", tweetRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/reply", replyRoutes);

// error handler middleware
app.use(errorHandler);

export default app;
