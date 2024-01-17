import { Request, Response } from 'express';
import { TicketService } from '../services/ticket.service';

export class TicketController {
	//DI - WssService
	constructor(private readonly ticketsService = new TicketService()) {}

	//Getters
	public getTickets = async (req: Request, res: Response) => {
		res.json(this.ticketsService.tickets);
	};
	public getLastTicketNumber = async (req: Request, res: Response) => {
		res.json(this.ticketsService.lastTicketNumber);
	};
	public getPendingTickets = async (req: Request, res: Response) => {
		res.json(this.ticketsService.pendingTickets);
	};
	public getWorkingOn = async (req: Request, res: Response) => {
		res.json(this.ticketsService.lastTicketsWorkingOn);
	};

	//Setters
	public createTicket = async (req: Request, res: Response) => {
		res.status(201).json(this.ticketsService.createTicket());
	};
	public assignTicketToDesk = async (req: Request, res: Response) => {
		const { desk } = req.params;

		//TODO: chequear que me manden por parametro el desk, que sea valido, que exista para asignarselo a un ticket
		res.json(this.ticketsService.assignTicketToDesk(desk));
	};
	public doneTicket = async (req: Request, res: Response) => {
		const { ticketId } = req.params;

		//TODO: chequear que me manden por parametro el id, que sea valido
		res.json(this.ticketsService.doneTicket(ticketId));
	};
}
