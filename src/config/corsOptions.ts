import { CorsOptions } from "cors";

const allowedOrigins = [
	"http://192.168.99.99:5173",
	"http://localhost:3000",
	"http://localhost:5173",
	"https://twitter-app-client.vercel.app",
	"https://twitter-app-client-2uefc5516-shin-thant.vercel.app",
	"https://twitter-yofn.onrender.com",
];

const corsOptions: CorsOptions = {
	origin(origin, cb) {
		// console.log({ origin });

		if (!origin || allowedOrigins.indexOf(origin) !== -1) {
			return cb(null, true);
		}
		cb(new Error("Not allowed by CORS!"));
	},
	credentials: true,
	optionsSuccessStatus: 200,
};

export default corsOptions;
