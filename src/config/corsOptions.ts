import { CorsOptions } from "cors";

export const allowedOrigins = [
	"http://localhost:5173",
	"https://twitter-app-client.vercel.app",
];

const corsOptions: CorsOptions = {
	origin(origin, cb) {
		if (!origin || allowedOrigins.indexOf(origin) !== -1) {
			return cb(null, true);
		}
		cb(new Error("Not allowed by CORS!"));
	},
	credentials: true,
	optionsSuccessStatus: 200,
};

export default corsOptions;
