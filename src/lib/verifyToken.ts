import jwt from "jsonwebtoken";
import { isJWTPayloadValid } from "../util/jwtVerifyHelpers";
import AppError from "../config/AppError";

export default function verifyToken(token: string, secretKey: string) {
	const payload = jwt.verify(token, secretKey);

	if (!isJWTPayloadValid(payload)) {
		console.log("invalid payload!");
		throw new AppError("Unauthorized!", 401);
	}

	return payload;
}
