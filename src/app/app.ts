import sgMail from "@sendgrid/mail";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import hpp from "hpp";
import path from "path";
import corsOptions from "../config/corsOptions";
import accessLogging from "../middlewares/accessLogging";
import errorHandler from "../middlewares/errorHandler";
import authRoutes from "../routes/authRoutes";
import commentRoutes from "../routes/commentRoutes";
import notiRoutes from "../routes/notiRoutes";
import tweetRoutes from "../routes/tweetRoutes";
import userRoutes from "../routes/userRoutes";

dotenv.config();
const app = express();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// middlewares
app.use(compression());
app.use(hpp());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(
	"/api/v1/photos/",
	express.static(path.join(__dirname, "..", "..", "public", "uploads"))
);
app.use(accessLogging);

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tweets", tweetRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/notis", notiRoutes);

// error handler middleware
app.use(errorHandler);

export default app;
