const btnGenerateTicket = document.querySelector('#btnGenerateTicket');
const newTicketSpan = document.querySelector('#lbl-new-ticket');

async function getLastTicket() {
	try {
		const lastTicket = await fetch('/api/tickets/last').then((resp) => resp.json());
		newTicketSpan.innerText = lastTicket;
	} catch (error) {
		newTicketSpan.innerText = 'error';
	}
}

async function createNewTicket() {
	try {
		const lastTicket = await fetch('/api/tickets', {
			method: 'POST',
		}).then((resp) => resp.json());

		newTicketSpan.innerText = lastTicket.number;
	} catch (error) {
		newTicketSpan.innerText = 'error';
	}
}

btnGenerateTicket.addEventListener('click', createNewTicket);

getLastTicket();
