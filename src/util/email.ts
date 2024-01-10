import sgMail, { MailDataRequired } from "@sendgrid/mail";
import { getEmailVerifyTemplate, getWelcomeTemplate } from "./templates";
import { Request } from "express";

type EmailType = "email_verify" | "welcome" | "reset_password";

const EMAIL_SUBJECTS: Record<EmailType, string> = {
	welcome: "Welcome from Twitter!",
	email_verify: "Verify email!",
	reset_password: "Reset Password!",
};

export async function sendWelcomeEmail({
	to,
	name,
}: {
	to: string;
	name: string;
}) {
	return await sendEmail({
		to,
		subject: getSubjectFor("welcome"),
		template: getWelcomeTemplate({ name }),
	});
}

export async function sendVerifyEmail({
	to,
	name,
	verifyLink,
	expireTimeInMins,
}: {
	to: string;
	name: string;
	expireTimeInMins: number;
	verifyLink: string;
}) {
	return await sendEmail({
		to,
		subject: getSubjectFor("email_verify"),
		template: getEmailVerifyTemplate({
			name,
			expireTimeInMins,
			verifyLink,
		}),
	});
}

export async function sendPasswordResetEmail({
	to,
	name,
	expireTimeInMins,
	passwordResetLink,
}: {
	to: string;
	name: string;
	expireTimeInMins: number;
	passwordResetLink: string;
}) {
	return await sendEmail({
		to,
		subject: getSubjectFor("reset_password"),
		template: `
			<h1>Hi ${name}</h1>
			<a href='${passwordResetLink}'>click this</a>
			<p>This link will be expired in ${expireTimeInMins} minutes!</p>
		`,
	});
}

async function sendEmail({
	to,
	subject,
	template,
}: {
	to: string;
	subject: string;
	template: string;
}) {
	const data: MailDataRequired = {
		to,
		from: "shinpolymer141123@gmail.com",
		subject,
		html: template,
	};
	return await sgMail.send(data);
}

function getSubjectFor(type: EmailType) {
	return EMAIL_SUBJECTS[type];
}

export function createEmailVerifyLink({
	req,
	token,
}: {
	req: Request;
	token: string;
}) {
	return `${req.protocol}://${req.get(
		"host"
	)}/api/v1/auth/verify-email/${token}`;
}

export function createPasswordResetLink({
	req,
	token,
}: {
	req: Request;
	token: string;
}) {
	return `${req.protocol}://${req.get(
		"host"
	)}/api/v1/auth/reset-password/${token}`;
}
