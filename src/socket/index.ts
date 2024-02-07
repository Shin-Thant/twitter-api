import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { allowedOrigins } from "../config/corsOptions";

type ListenEvents = object;
type EmitEvents = {
	notify(arg: object): void;
};
type ServerSideEvents = object;
type SocketData = {
	userID: string;
};

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
