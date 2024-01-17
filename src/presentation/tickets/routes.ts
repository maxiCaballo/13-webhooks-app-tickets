import { Router } from 'express';
import { TicketController } from './controller';
import { TicketService } from '../services/ticket.service';

export class TicketsRoutes {
	static get routes() {
		const router = Router();

		const ticketsService = new TicketService();
		const ticketController = new TicketController(ticketsService);

		router.get('/', ticketController.getTickets);
		router.get('/last', ticketController.getLastTicketNumber);
		router.get('/pending', ticketController.getPendingTickets);
		router.get('/working-on', ticketController.getWorkingOn); //Mostrar tickets que estan siendo atendidos
		router.get('/assign/:desk', ticketController.assignTicketToDesk); //Asignar ticket a escritorio

		router.post('/', ticketController.createTicket);

		router.put('/done/:ticketId', ticketController.doneTicket); //Finalizar ticket

		return router;
	}
}
