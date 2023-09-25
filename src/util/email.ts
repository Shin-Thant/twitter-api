import sgMail, { MailDataRequired } from "@sendgrid/mail";
import { getEmailVerifyTemplate, getWelcomeTemplate } from "./templates";

type EmailType = "email_verify" | "welcome";

const EMAIL_SUBJECTS: Record<EmailType, string> = {
	welcome: "Welcome from Twitter!",
	email_verify: "Verify email!",
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
