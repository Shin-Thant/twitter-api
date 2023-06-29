import mongoose from "mongoose";

export async function connectDB() {
	await mongoose.connect(process.env.DATABASE_URI);
	// await mongoose.connect(process.env.LOCAL_DATABASE_URI);
}

export async function disconnectDB() {
	await mongoose.disconnect();
	await mongoose.connection.close();
}
