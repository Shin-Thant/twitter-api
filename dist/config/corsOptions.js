"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allowedOrigins = [
    "http://192.168.99.99:5173",
    "http://localhost:3000",
    "http://localhost:5173",
    "https://twitter-app-client-nzb1q862c-shin-thant.vercel.app",
];
const corsOptions = {
    origin(origin, cb) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            return cb(null, true);
        }
        cb(new Error("Not allowed by CORS!"));
    },
    credentials: true,
    optionsSuccessStatus: 200,
};
exports.default = corsOptions;