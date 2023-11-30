import { Logger, createLogger, format, transports } from "winston";

export class LoggerProvider {
	private static instance: Logger;
	private constructor() {
		// can't create via `new` keyword
	}

	static getInstance(label?: string) {
		if (!this.instance) {
			this.instance = createLogger({
				level: "debug",
				format: this.getFormat(label),
				transports: [new transports.Console()],
			});
		}
		return this.instance;
	}

	private static getFormat(label?: string) {
		return format.combine(
			format.colorize({ all: true }),
			format.label({ label: label ?? "LOGGER" }),
			format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSSS" }),
			format.printf(
				(info) =>
					`[${info.label}] [${info.timestamp}] [${info.level}] :  ${info.message}`
			)
		);
	}
}
