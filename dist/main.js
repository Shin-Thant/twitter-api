"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.on("uncaughtException", () => {
    console.log("Uncaught Exception!"); // production
    console.log("Shutting down...");
    process.exit(1);
});
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app/app"));
const database_1 = require("./config/database");
// connect to database
(0, database_1.connectDB)();
// start server
const PORT = 3500 || process.env.PORT;
const server = app_1.default.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}!`);
});
mongoose_1.default.connection.once("open", () => {
    console.log("✨ Successfully connected to MongoDB!");
});
mongoose_1.default.connection.on("error", () => {
    console.log("db err!"); // production
    console.log("Shutting down...");
    server.close(() => {
        process.exit(1);
    });
});
mongoose_1.default.connection.on("disconnected", () => {
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
