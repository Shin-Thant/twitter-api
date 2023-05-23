export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: "development" | "production";
			PORT: number;
			ACCESS_TOKEN_SECRET_KEY: string;
			REFRESH_TOKEN_SECRET_KEY: string;
			DATABASE_URI: string;
			LOCAL_DATABASE_URI: string;
		}
	}
}
