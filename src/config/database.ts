import mongoose from "mongoose";

export async function connectDB() {
	// await connect(process.env.DATABASE_URI);
	await mongoose.connect("mongodb://127.0.0.1:27017/Twitter");
}

export async function disconnectDB() {
	await mongoose.disconnect();
	await mongoose.connection.close();
}
