import { Server as HttpServer } from "http";
import { Socket, Server as SocketServer } from "socket.io";
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
	react(arg: noti): void;
	"new-post": (user: {
		id: string;
		username: string;
		avatar?: string;
	}) => void;
};
type ServerSideEvents = object;
type SocketData = {
	userID: string;
};

export const Emit = {
	REACT: "react",
	NEW_POST: "new-post",
} as const;

export type AppSocket = Socket<
	ListenEvents,
	EmitEvents,
	ServerSideEvents,
	SocketData
>;

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
