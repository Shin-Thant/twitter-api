import { createLogger, format, transports } from "winston";

export class LoggerProvider {
	private constructor() {
		// can't create via `new` keyword
	}

	static getInstance(label: string) {
		return createLogger({
			level: "debug",
			format: this.getFormat(label),
			transports: [new transports.Console()],
		});
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
