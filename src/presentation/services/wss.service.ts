import { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

//WebSocketServer -> objeto que contiene todo lo relacionado al servidor web socket
//WebSocket       -> objeto que contiene todo lo relacionado al cliente web socket

interface Options {
	server: Server;
	path?: string; //ws
}
type wsActions = {
	onTicketCountChanged: 'on-ticket-count-changed';
	onWorkingOnChanged: 'on-working-on-changed';
};
export const wsActions: wsActions = {
	onTicketCountChanged: 'on-ticket-count-changed',
	onWorkingOnChanged: 'on-working-on-changed',
};

//Singleton
export class WssService {
	private static _instance: WssService;
	private wss: WebSocketServer;

	private constructor(options: Options) {
		const { server, path = '/ws' } = options; // localhost:3000/ws

		this.wss = new WebSocketServer({ server, path });
		this.start();
	}

	static initWss(options: Options) {
		WssService._instance = new WssService(options);
	}

	static get instance(): WssService {
		if (!WssService._instance) throw 'WssService is not initialized';

		return WssService._instance;
	}

	public start() {
		//Cuando tenga una conexion
		this.wss.on('connection', (wsClient: WebSocket) => {
			console.log('Client connected');

			wsClient.on('close', () => console.log('Client disconnected'));
		});
	}

	public sendMessage(type: string, payload: Object) {
		this.wss.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify({ type, payload }));
			}
		});
	}
}
