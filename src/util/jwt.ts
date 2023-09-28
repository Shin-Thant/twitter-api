import jwt from "jsonwebtoken";

type TokenType = "access_token" | "refresh_token" | "email_token";

const SECRET_KEY_FOR_TEST_ENV: Record<TokenType, string> = {
	access_token: "unique-access-token-secret",
	refresh_token: "unique-refresh-token-secret",
	email_token: "unique-email-token-secret",
} as const;

// const SECRET_KEY: Record<TokenType, string> = {
// 	access_token: process.env.ACCESS_TOKEN_SECRET_KEY,
// 	refresh_token: process.env.REFRESH_TOKEN_SECRET_KEY,
// 	email_token: process.env.EMAIL_TOKEN_SECRET_KEY,
// } as const;

const EXPIRES_TIME: Record<TokenType, string> = {
	access_token: "15m",
	refresh_token: "7d",
	email_token: "15m",
};

export function createJwtToken({
	payload,
	secretKey,
	options,
}: {
	payload: object;
	secretKey: jwt.Secret;
	options?: jwt.SignOptions;
}) {
	return jwt.sign(payload, secretKey, options);
}

export function verifyJwtToken({
	token,
	secretKey,
}: {
	token: string;
	secretKey: string;
}) {
	return jwt.verify(token, secretKey);
}

export const getSecretKeyFor = (tokenType: TokenType): string => {
	if (process.env.NODE_ENV === "test") {
		return SECRET_KEY_FOR_TEST_ENV[tokenType];
	}

	const SECRET_KEY: Record<TokenType, string> = {
		access_token: process.env.ACCESS_TOKEN_SECRET_KEY,
		refresh_token: process.env.REFRESH_TOKEN_SECRET_KEY,
		email_token: process.env.EMAIL_TOKEN_SECRET_KEY,
	} as const;

	return SECRET_KEY[tokenType];
};

const START_INDEX = 0;
export const getTokenExpireTimeNumber = (tokenType: TokenType) => {
	const expireTimeWithUnit = getTokenExpireTime(tokenType);

	return parseInt(
		expireTimeWithUnit.slice(START_INDEX, expireTimeWithUnit.length)
	);
};

export const getTokenExpireTime = (tokenType: TokenType) => {
	return EXPIRES_TIME[tokenType];
};
