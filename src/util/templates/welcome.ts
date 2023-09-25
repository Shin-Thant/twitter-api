export function getWelcomeTemplate({ name }: { name: string }) {
	return `<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title></title>
			<style>
				* {
					margin: 0;
					padding: 0;
					box-sizing: border-box;
				}
				body {
					font-family: Arial, Helvetica, sans-serif;
					padding: 1.5rem;
					color: #444a5b;
				}
			</style>
		</head>
		<body>
			<div style="max-width: 500px; margin: auto">
				<h1 style="text-align: center; color: #0094f0; margin-bottom: 2rem">
					Welcome!
				</h1>
				<h4 style="margin-bottom: 1rem">Hello ${name},</h4>
				<p>
					Welcome to Twitter! We're thrilled to have you join our
					community of millions of users from around the world.
				</p>
				<br />
				<p>
					Thanks for choosing Twitter! We look forward to seeing you on
					the platform.
				</p>
				<br />
				<p>Best regards,</p>
				<p style="font-weight: bold">The Twitter Team</p>
			</div>
		</body>
	</html>
	`;
}
