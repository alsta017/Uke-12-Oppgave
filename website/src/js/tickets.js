// Function to get URL query parameters
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return params;
}

// Function to remove the 'success' and 'id' query parameters from the URL
function removeQueryParams() {
    const url = new URL(window.location.href);
    url.searchParams.delete('success');
    url.searchParams.delete('id');
    window.history.replaceState({}, document.title, url);
}

// Check if the page was reloaded
window.onload = function() {
    const queryParams = getQueryParams();
    if (queryParams.has('id')) {
        // Remove the 'id' query parameter from the URL
        removeQueryParams();
    }
};

// Check if the 'success' query parameter is present
const queryParams = getQueryParams();
if (queryParams.has('success') && queryParams.get('success') === 'true') {
    // Display the success message
    const successMessage = document.getElementById('successMessage');
    const successText = document.getElementById('successText');
    const insertedId = queryParams.get('id');
    successText.textContent = 'Success! Your ticket with ID ' + insertedId + ' has been created. Please save the ID so you can lookup the ticket later.';
    successMessage.style.display = 'block';
}

function lookupTicket() {
    const ticketId = document.getElementById('ticketId').value;

    // Make an AJAX request to retrieve ticket information
    fetch(`/ticket/${ticketId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ticketId: ticketId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ticket not found');
        }
        return response.json();
    })
    .then(data => {
        // Display ticket information
        const ticketInfoDiv = document.getElementById('ticketInfo');
        ticketInfoDiv.innerHTML = `
            <h2>Ticket Information</h2>
            <p><strong>ID:</strong> ${data.id}</p>
            <p><strong>Title:</strong> ${data.title}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Description:</strong> ${data.description}</p>
            <p><strong>Status:</strong> ${data.status}</p>
            <p><strong>Created:</strong> ${data.created}</p>
        `;
    })
    .catch(error => {
        console.error('Error fetching ticket information:', error);
        // Display error message
        const ticketInfoDiv = document.getElementById('ticketInfo');
        ticketInfoDiv.innerHTML = '<p>Error: Ticket not found</p>';
    });
}