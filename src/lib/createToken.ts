import { SignOptions } from "jsonwebtoken";
import jwt from "./jwt";
type TokenType = "access" | "refresh";

const getSecreTkey = (tokenType: TokenType): string => {
	if (tokenType === "access") {
		return process.env.ACCESS_TOKEN_SECRET_KEY;
	}
	return process.env.REFRESH_TOKEN_SECRET_KEY;
};

const createToken = (
	payload: object,
	tokenType: TokenType,
	expiresIn: string
): string => {
	const secretKey = getSecreTkey(tokenType);

	const jwtSignOptions: SignOptions = {
		expiresIn,
	};

	return jwt.createToken(payload, secretKey, jwtSignOptions);
};

export default createToken;
