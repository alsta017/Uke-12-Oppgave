
function markAsCompleted(ticketId, status) {
    if (status === 'Closed') {
        // Reopen the ticket
        location.replace(`/ticket/${ticketId}/reopen`);
    } else {
        // Mark the ticket as completed
        location.replace(`/ticket/${ticketId}/complete`);
    }
}

function deleteTicket(ticketId) {
    // Delete the ticket
    location.replace(`/ticket/${ticketId}/delete`);
}

// Fetch tickets when the page loads
fetch('/tickets/all')
.then(response => response.json())
.then(tickets => {
    const ticketList = document.getElementById('ticketList');
    ticketList.innerHTML = ''; // Clear existing content

    tickets.forEach(ticket => {
        const createdDate = new Date(ticket.created);
        const formattedCreatedDate = `${createdDate.getDate().toString().padStart(2, '0')}.${(createdDate.getMonth() + 1).toString().padStart(2, '0')}.${createdDate.getFullYear()} ${createdDate.getHours().toString().padStart(2, '0')}:${createdDate.getMinutes().toString().padStart(2, '0')}`;

        const ticketElement = document.createElement('div');
        ticketElement.innerHTML = `
            <div class="adminticket">
                <p><strong>Title:</strong> ${ticket.title}</p>
                <p><strong>Email:</strong> ${ticket.email}</p>
                <p><strong>Description:</strong> ${ticket.description}</p>
                <p><strong>Status:</strong> ${ticket.status}</p>
                <p><strong>Created:</strong> ${formattedCreatedDate}</p>
                <button class="button1 buttoncolor" onclick="markAsCompleted(${ticket.id}, '${ticket.status}')">${ticket.status === 'Closed' ? 'Reopen Ticket' : 'Mark as Completed'}</button>
                <button class="button1 buttoncolor" onclick="deleteTicket(${ticket.id})">Delete Ticket</button>
            </div>
        `;
        ticketList.appendChild(ticketElement);
    });
})
.catch(error => {
    console.error('Error fetching tickets:', error);
});