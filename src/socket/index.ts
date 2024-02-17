import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { allowedOrigins } from "../config/corsOptions";

type noti = {
	recipient: string;
	triggerBy: {
		_id: string;
		name: string;
		username: string;
		avatar?: string;
	};
	isRead: boolean;
	type: string;
	doc: string;
	message: string;
};

type ListenEvents = object;
type EmitEvents = {
	notify(arg: noti): void;
	"new-post": () => void;
};
type ServerSideEvents = object;
type SocketData = {
	userID: string;
};

export const Emit = {
	NOTIFY: "notify",
	POST: "new-post",
} as const;

export function CreateSocketServer(httpServer: HttpServer) {
	return new SocketServer<
		ListenEvents,
		EmitEvents,
		ServerSideEvents,
		SocketData
	>(httpServer, {
		cors: {
			origin: allowedOrigins,
		},
	});
}
