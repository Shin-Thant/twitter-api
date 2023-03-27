import { connect } from "mongoose";

export default async function connectDB() {
	await connect(process.env.DATABASE_URI);
}
