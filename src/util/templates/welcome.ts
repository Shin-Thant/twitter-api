export function getWelcomeTemplate({ name }: { name: string }) {
	return `<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Welcome!</title>
		</head>
		<body>
			<h1>Welcome!</h1>
			<h4>Hello ${name}!</h4>
			<p>
				Welcome to Twitter! We're thrilled to have you join our community of
				millions of users from around the world.
			</p>
		</body>
	</html>`;
}
