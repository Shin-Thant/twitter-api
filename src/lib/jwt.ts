import jwt from "jsonwebtoken";
import AppError from "../config/AppError";

type TokenType = "access_token" | "refresh_token";

// TODO: write test that check payload is a object containing `userInfo: {id: string}`

const createToken = (payload: object, tokenType: TokenType): string => {
	if (Object.keys(payload).length < 1) {
		throw new AppError("Invalid jwt payload!", 500);
	}

	const secretKey = getSecretKeyFor(tokenType);
	if (!secretKey || !secretKey.length) {
		throw new AppError("No secret key!", 500);
	}

	const expiresIn = getExpiresTimeFor(tokenType);

	return jwt.sign(payload, secretKey, {
		expiresIn,
	});
};

export const getSecretKeyFor = (tokenType: TokenType): string => {
	if (tokenType === "access_token") {
		return (
			process.env.ACCESS_TOKEN_SECRET_KEY || "unique-access-token-secret"
		);
	}
	return process.env.REFRESH_TOKEN_SECRET_KEY || "unique-access-token-secret";
};

export const getExpiresTimeFor = (tokenType: TokenType) => {
	return tokenType === "access_token" ? "15m" : "7d";
};

export default createToken;
