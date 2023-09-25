import { CookieOptions, Response } from "express";
import AppError from "../config/AppError";

const TOKEN_COOKIE_NAME = "token" as const;
const COOKIE_MAX_AGE_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function setTokenCookie(res: Response, token: string) {
	if (!token) {
		throw new AppError("Internal Server Error!", 500);
	}

	const cookieOptions: CookieOptions = {
		httpOnly: true,
		maxAge: COOKIE_MAX_AGE_IN_MILLISECONDS,
		sameSite: "none",
		secure: true,
	};
	res.cookie(TOKEN_COOKIE_NAME, token, cookieOptions);
}

export function clearTokenCookie(res: Response) {
	const cookieOptions: CookieOptions = {
		httpOnly: true,
		sameSite: "none",
		secure: true,
	};
	res.clearCookie(TOKEN_COOKIE_NAME, cookieOptions);
}

type ValidCookie = { token: string };
export function isValidCookie(cookies: unknown): cookies is ValidCookie {
	return (
		typeof cookies === "object" &&
		!!cookies &&
		"token" in cookies &&
		typeof cookies.token === "string" &&
		!!cookies.token
	);
}
