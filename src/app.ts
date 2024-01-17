import { createServer } from 'http';
import { envs } from './config/envs';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import { WssService } from './presentation/services/wss.service';

(async () => {
	main();
})();

function main() {
	//Servidor express
	const server = new Server({
		port: envs.PORT,
	});

	//Creo el servidor
	const httpServer = createServer(server.app);
	//
	WssService.initWss({ server: httpServer });

	server.setRoutes(AppRoutes.routes);

	httpServer.listen(envs.PORT, () => {
		console.log(`Server running on port: ${envs.PORT} `);
	});

	//No inicializo el server de express
	//server.start();
}

/*
La clase WssService necesita como parametro un servidor http de node para poder inicializarse
por ende no le puedo mandar el "server" porque se crea con express, mas allá de que un servidor http
creado en node y uno en express son totalmente compatibles. Por lo tanto me creo un servidor utilizando
el metodo de node "createServer" importado del modulo "http" y ese es el server que le voy a pasar a mi 
clase WssService para poder instanciarse.


*/
