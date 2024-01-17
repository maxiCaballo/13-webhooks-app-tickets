export interface ITicket {
	id: string;
	number: number;
	createdAt: Date;
	handleAtDesk?: string; //Por que escritorio fue o está siendo atendido
	handleAt?: Date; //Cuando fue asignado a un escritorio
	doneAt?: Date; //Cuando termino de ser atendido
	done: boolean;
}
