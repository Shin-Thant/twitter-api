// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

import sgMail, { MailDataRequired } from "@sendgrid/mail";

export async function sendEmail({
	to,
	subject,
	text,
}: {
	to: string;
	subject: string;
	text: string;
}) {
	const data: MailDataRequired = {
		to,
		from: "shinpolymer141123@gmail.com",
		subject,
		text,
	};
	return await sgMail.send(data);
}

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const msg = {
// 	to: "test@example.com", // Change to your recipient
// 	from: "test@example.com", // Change to your verified sender
// 	subject: "Sending with SendGrid is Fun",
// 	text: "and easy to do anywhere, even with Node.js",
// 	html: "<strong>and easy to do anywhere, even with Node.js</strong>",
// };
// sgMail
// 	.send(msg)
// 	.then(() => {
// 		console.log("Email sent");
// 	})
// 	.catch((error) => {
// 		console.error(error);
// 	});
