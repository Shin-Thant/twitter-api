import "express-async-errors";
import express from "express";
import dotenv from "dotenv";
import errorHandler from "./middlewares/errorHandler";

dotenv.config();
const app = express();
const PORT = 3500 || process.env.PORT;

// routes

// error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
