import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import fs from "fs/promises";
import path from "path";
import AppError from "../config/AppError";
import logger from "./logger";

// TODO: remove logs in production

export function createTransport() {
	try {
		const transporter = nodemailer.createTransport({
			host: "sandbox.smtp.mailtrap.io",
			auth: {
				user: "e278729ecceb39",
				pass: "03528a2262422a",
			},
		});
		return transporter;
	} catch (err) {
		logger.error(err);
		throw new AppError("Something went wrong!", 500);
	}
}

interface MailInfo extends Mail.Options {
	to: string;
	subject: string;
}

export async function sendMail(
	transporter: nodemailer.Transporter,
	{ from, to, subject }: MailInfo
) {
	try {
		const template = await fs.readFile(
			path.join(__dirname, "..", "..", "emailTemplates", "verify.html"),
			"utf-8"
		);

		await transporter.sendMail({
			from: from ?? "Twitter Team",
			to,
			subject,
			html: template,
		});
	} catch (err) {
		logger.error(err);
		throw new AppError("Something went wrong!", 500);
	}
}

export function getEmailTemplate(template: "verify_email") {}
