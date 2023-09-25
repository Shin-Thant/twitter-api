import sgMail, { MailDataRequired } from "@sendgrid/mail";
import { getWelcomeTemplate } from "./templates";

type EmailType = "email_verify" | "welcome";

const EMAIL_SUBJECTS: Record<EmailType, string> = {
	welcome: "Welcome from Twitter!",
	email_verify: "Verify your email!",
};

export async function sendWelcomeEmail({
	to,
	name,
}: {
	to: string;
	name: string;
}) {
	return sendEmail({
		to,
		subject: getSubjectFor("welcome"),
		template: getWelcomeTemplate({ name }),
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
