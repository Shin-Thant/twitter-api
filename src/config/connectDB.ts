import { connect } from "mongoose";

export default async function connectDB() {
	// await connect(process.env.DATABASE_URI);
	await connect("mongodb://127.0.0.1:27017/Twitter");
}
