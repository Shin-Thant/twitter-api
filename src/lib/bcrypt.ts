import bcrypt from "bcrypt";

interface IBcrypt {
	hash: (data: string | Buffer, saltOrRounds: number) => Promise<string>;
	compare: (plainData: string, encryptedData: string) => Promise<boolean>;
}

class BcryptImpl implements IBcrypt {
	hash(data: string | Buffer, saltOrRounds: number): Promise<string> {
		return bcrypt.hash(data, saltOrRounds);
	}

	compare(plainData: string, encryptedData: string): Promise<boolean> {
		return bcrypt.compare(plainData, encryptedData);
	}
}

export default new BcryptImpl();
