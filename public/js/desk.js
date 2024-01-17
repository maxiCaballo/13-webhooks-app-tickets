const pendingTicketsElement = document.getElementById('lbl-pending');
const deskHeader = document.querySelector('#deskHeader');
const noMoreTicketsElement = document.getElementById('noMoreTickets');

const currentTicketElement = document.querySelector('#currentTicket');
const btnAssignTicket = document.getElementById('assignTicketBtn');
const btnFinishTicket = document.getElementById('finishTicketBtn');

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
	window.location = 'index.html';
	throw new Error('Escritorio requerido');
}

const deskNumber = searchParams.get('escritorio');
let workingTicket = null;
deskHeader.innerText = deskNumber;

function checkTicketCount(currentCount = 0) {
	if (currentCount === 0) {
		noMoreTicketsElement.classList.remove('d-none');
	} else {
		noMoreTicketsElement.classList.add('d-none');
	}

	pendingTicketsElement.innerText = currentCount;
}

async function getTicket() {
	await finishTicket();
	const { status, ticket, message } = await fetch(`/api/tickets/assign/${deskNumber}`).then((resp) => resp.json());

	if (status === 'error') {
		currentTicketElement.innerText = message;
		return;
	}

	workingTicket = ticket;
	currentTicketElement.innerText = workingTicket.number;
}

async function getPendingTickets() {
	try {
		const pendingTickets = await fetch('/api/tickets/pending').then((resp) => resp.json());
		checkTicketCount(pendingTickets.length);
	} catch (error) {
		pendingTicketsElement.innerText = 'Error';
	}
}

async function finishTicket() {
	if (!workingTicket) return;

	const { id } = workingTicket;
	const { status, message, ticket } = await fetch(`/api/tickets/done/${id}`, {
		method: 'PUT',
	}).then((resp) => resp.json());

	if (status === 'ok') {
		workingTicket = null;
		currentTicketElement.innerText = 'nadie';
	}

	if (status === 'error') {
		currentTicketElement.innerText = message;
		return;
	}
}

function connectToWebSockets() {
	const socket = new WebSocket('ws://localhost:3000/ws');

	socket.onmessage = (event) => {
		const { type, payload } = JSON.parse(event.data);

		if (type !== 'on-ticket-count-changed') return;

		checkTicketCount(payload);
	};
}

btnAssignTicket.addEventListener('click', getTicket);
btnFinishTicket.addEventListener('click', finishTicket);

//Init
connectToWebSockets();
getPendingTickets();
