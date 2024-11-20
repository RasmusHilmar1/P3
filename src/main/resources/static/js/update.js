export {updateAvailability, updateBoatBerthId};


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


function updateBoatBerthId(boatId, berthId) {
    fetch(`/boats/update/berth/${boatId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(berthId),
    })
    .then(response => response.json())
        .then(data => {
            if (data) {
                alert("BerthID updated succesfully");
            } else {
                alert("Error: Member not found");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error updating berthID.");
        })
}