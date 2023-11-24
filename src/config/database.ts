import mongoose from "mongoose";

export async function connectDB() {
	const DATABASE_URI: string =
		process.env.NODE_ENV !== "production"
			? "mongodb://localhost:27017/Twitter"
			: process.env.DATABASE_URI;

	await mongoose.connect(DATABASE_URI);
}

export async function disconnectDB() {
	await mongoose.disconnect();
	await mongoose.connection.close();
}
