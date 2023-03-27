import { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

interface IJsonWebToken {
	createToken: (
		payload: string,
		secretKey: string,
		signOptions?: SignOptions
	) => string;
}

class JsonWebTokenImpl implements IJsonWebToken {
	createToken(
		payload: string | object,
		secretKey: string,
		signOptions?: SignOptions | undefined
	): string {
		return jwt.sign(payload, secretKey, signOptions);
	}
}

export default new JsonWebTokenImpl();
