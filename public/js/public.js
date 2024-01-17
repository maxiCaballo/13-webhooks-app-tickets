async function getTicketsWorkingOn() {
	const ticketsWorkingOn = await fetch('/api/tickets/working-on').then((resp) => resp.json());

	if (!ticketsWorkingOn.length) return;

	renderTicketsWorkingOn(ticketsWorkingOn);
}

function renderTicketsWorkingOn(tickets) {
	tickets.forEach((ticket, index) => {
		const lblTicket = document.querySelector(`#lbl-ticket-0${index + 1}`);
		const lblDesk = document.querySelector(`#lbl-desk-0${index + 1}`);

		lblTicket.innerText = `Ticket:  ${ticket.number}`;
		lblDesk.innerText = `${ticket.handleAtDesk}`;
	});
}

function connectToWebSockets() {
	const socket = new WebSocket('ws://localhost:3000/ws');

	socket.onmessage = (event) => {
		const { type, payload } = JSON.parse(event.data);

		if (type !== 'on-working-on-changed') return;

		renderTicketsWorkingOn(payload);
	};
}

getTicketsWorkingOn();
connectToWebSockets();
