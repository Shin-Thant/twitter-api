export function getClientURL(): string {
	if (process.env.NODE_ENV === "development") {
		return "http://localhost:5173";
	}
	return "https://twitter-app-client.vercel.com";
}
