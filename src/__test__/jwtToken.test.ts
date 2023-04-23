import jwt from "jsonwebtoken";
import AppError from "../config/AppError";
import createToken, {
	getExpiresTimeString,
	getSecretKey,
} from "../lib/createToken";

describe("JWT token", () => {
	describe("given empty payload", () => {
		const mockJwtTokenSign = jest.spyOn(jwt, "sign");

		it("should throw AppError", () => {
			expect(() => createToken({}, "access")).toThrow(AppError);
			expect(() => createToken({}, "access")).toThrow(
				"Invalid jwt payload!"
			);
		});
		it("should not call jwt.sign", () => {
			expect(mockJwtTokenSign).not.toHaveBeenCalled();
		});
	});

	describe("given valid payload", () => {
		it("should return token string", () => {
			const mockJwtTokenSign = jest
				.spyOn(jwt, "sign")
				.mockImplementation(() => "mock jwt token");

			const secretKey = getSecretKey("access");
			const expiresIn = getExpiresTimeString("access");
			const token = createToken({ name: "john" }, "access");

			expect(mockJwtTokenSign).toHaveBeenCalled();
			expect(mockJwtTokenSign).toHaveBeenCalledWith(
				{ name: "john" },
				secretKey,
				{
					expiresIn: expiresIn,
				}
			);
			expect(token).toBe("mock jwt token");
		});
	});
});
