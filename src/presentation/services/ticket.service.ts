import { UuidAdapter } from '../../config/uuid.adapter';
import { ITicket } from '../../domain/interfaces/ticket';
import { WssService, wsActions } from './wss.service';

export class TicketService {
	constructor(private readonly wssService = WssService.instance) {}

	//Properties
	public tickets: ITicket[] = [
		{ id: UuidAdapter.v4(), number: 1, createdAt: new Date(), done: false },
		{ id: UuidAdapter.v4(), number: 2, createdAt: new Date(), done: false },
		{ id: UuidAdapter.v4(), number: 3, createdAt: new Date(), done: false },
		{ id: UuidAdapter.v4(), number: 4, createdAt: new Date(), done: false },
		{ id: UuidAdapter.v4(), number: 5, createdAt: new Date(), done: false },
		{ id: UuidAdapter.v4(), number: 6, createdAt: new Date(), done: false },
	];

	private readonly ticketsWorkingOn: ITicket[] = [];

	//Getters
	public get pendingTickets(): ITicket[] {
		return this.tickets.filter((ticket) => !ticket.handleAtDesk);
	}
	//4 ultimos tickets que se estan trabajando
	public get lastTicketsWorkingOn(): ITicket[] {
		return this.ticketsWorkingOn.slice(0, 4);
	}
	public get lastTicketNumber(): number {
		return this.tickets.length > 0 ? this.tickets.at(-1)!.number : 0;
	}

	//Methods
	public createTicket(): ITicket {
		const ticket: ITicket = {
			id: UuidAdapter.v4(),
			number: this.lastTicketNumber + 1,
			createdAt: new Date(),
			done: false,
			handleAt: undefined,
			handleAtDesk: undefined,
		};

		this.tickets.push(ticket);
		this.onTicketNumberChanged();

		return ticket;
	}

	public assignTicketToDesk(desk: string) {
		//Me toma el ticket mas viejo
		let ticket = this.tickets.find((ticket) => !ticket.handleAtDesk && !ticket.done);

		if (!ticket) {
			return {
				status: 'error',
				message: 'there are no pending tickets',
			};
		}

		ticket.handleAtDesk = desk;
		ticket.handleAt = new Date();

		this.ticketsWorkingOn.unshift({ ...ticket });
		this.onTicketNumberChanged();
		this.onWorkingOnChanged();

		return { status: 'ok', ticket };
	}

	public doneTicket(id: string) {
		const ticket = this.tickets.find((ticket) => ticket.id === id);

		if (!ticket)
			return {
				status: 'error',
				message: `there is no ticket with id: ${id}`,
			};

		ticket.done = true;
		ticket.doneAt = new Date();

		return { status: 'ok', ticket };
	}

	private onTicketNumberChanged() {
		this.wssService.sendMessage(wsActions.onTicketCountChanged, this.pendingTickets.length);
	}

	//Cada vez que la lista de working on cambie
	private onWorkingOnChanged() {
		this.wssService.sendMessage(wsActions.onWorkingOnChanged, this.lastTicketsWorkingOn);
	}
}
