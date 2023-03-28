import { JwtPayload, SignOptions } from "jsonwebtoken";
import jsonWebToken from "jsonwebtoken";

interface IJsonWebToken {
	createToken: (
		payload: string,
		secretKey: string,
		signOptions?: SignOptions
	) => string;

	verifyToken: (
		token: string,
		secretKey: string
	) => string | JwtPayload | object;
}

class JsonWebTokenImpl implements IJsonWebToken {
	createToken(
		payload: string | object,
		secretKey: string,
		signOptions?: SignOptions | undefined
	): string {
		return jsonWebToken.sign(payload, secretKey, signOptions);
	}

	verifyToken(token: string, secretKey: string) {
		return jsonWebToken.verify(token, secretKey);
	}
}
const jwt = new JsonWebTokenImpl();

export default jwt;
