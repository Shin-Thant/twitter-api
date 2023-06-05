"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const hpp_1 = __importDefault(require("hpp"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = __importDefault(require("../middlewares/errorHandler"));
const authRoutes_1 = __importDefault(require("../routes/authRoutes"));
const tweetRoutes_1 = __importDefault(require("../routes/tweetRoutes"));
const userRoutes_1 = __importDefault(require("../routes/userRoutes"));
const replyRoutes_1 = __importDefault(require("../routes/replyRoutes"));
const commentRoutes_1 = __importDefault(require("../routes/commentRoutes"));
const corsOptions_1 = __importDefault(require("../config/corsOptions"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// middlewares
app.use((0, hpp_1.default)());
app.use((0, cors_1.default)(corsOptions_1.default));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// routes
app.use("/api/v1/auth", authRoutes_1.default);
app.use("/api/v1/users", userRoutes_1.default);
app.use("/api/v1/tweets", tweetRoutes_1.default);
app.use("/api/v1/comments", commentRoutes_1.default);
app.use("/api/v1/reply", replyRoutes_1.default);
// error handler middleware
app.use(errorHandler_1.default);
exports.default = app;
