import { Server as HttpServer } from "http";
import { Socket, Server as SocketServer } from "socket.io";
import { allowedOrigins } from "../config/corsOptions";
import { socketLogger } from "../util/logger";

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

function createSocketServer(httpServer: HttpServer) {
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

export class SocketInstance {
	private static _instance: SocketServer<
		ListenEvents,
		EmitEvents,
		ServerSideEvents,
		SocketData
	>;
	private constructor() {
		throw new Error(
			"SocketInstance: not supported to create instance via constructor."
		);
	}

	static getInstance(httpServer?: HttpServer) {
		if (!this._instance) {
			if (process.env.NODE_ENV === "test") {
				this._instance = new MockSocketServer() as any;
				return this._instance;
			}
			if (!httpServer) {
				throw new Error("SocketInstance: httpServer is required.");
			}
			socketLogger.info("Socket server created.");
			this._instance = createSocketServer(httpServer);
		}
		return this._instance;
	}
}

class MockSocketServer {
	join(room: string) {
		socketLogger.info(`MockSocketServer: User joined to ${room} room.`);
	}
	emit(event: string, data: any) {
		socketLogger.info(
			`MockSocketServer: Event ${event} emitted${
				!data ? "" : " " + JSON.stringify(data)
			}.`
		);
	}
	on(event: string, _callback: (data: any) => void) {
		socketLogger.info(`MockSocketServer: Event ${event} registered.`);
	}
	use(_middleware: any) {
		socketLogger.info("MockSocketServer: Middleware registered.");
	}
}
