export {updateAvailability};


function updateAvailability(berthId, availability) {

    fetch(`/berths/update/availability/${berthId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(availability),
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                alert("Availability updated successfully");
            } else {
                alert("Error: Member not found.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error updating availability.");
        });
}

