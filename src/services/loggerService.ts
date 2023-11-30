import { Logger } from "winston";

export class LoggerService {
	constructor(private readonly provider: Logger) {}

	info(message: object | string) {
		this.provider.info(message);
	}
	warn(message: object | string) {
		this.provider.warn(message);
	}
	error(message: object | string) {
		this.provider.error(message);
	}
	debug(message: object | string) {
		this.provider.debug(message);
	}
}
