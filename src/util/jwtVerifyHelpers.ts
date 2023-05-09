import { JwtPayload } from "jsonwebtoken";

export interface ValidPayload {
	userInfo: {
		id: string;
	};
}
export function isJWTPayloadValid(
	payload: string | JwtPayload | undefined
): payload is ValidPayload {
	return (
		!!payload &&
		typeof payload === "object" &&
		"userInfo" in payload &&
		typeof payload.userInfo === "object" &&
		"id" in payload.userInfo
	);
}
