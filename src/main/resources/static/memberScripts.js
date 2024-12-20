function updateMemberName() {
    const newName = document.getElementById("newName").value;
    const memberId = 10;  // ID of the member you want to update (for example, Member 10)

    // Send a PUT request to the backend to update the name
    fetch(`/members/updateName/${memberId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newName),  // Send the new name in the body
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                alert("Name updated successfully to: " + data.name);
            } else {
                alert("Error: Member not found.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error updating member name.");
        });
}

function updateMemberAddress() {
    const newAddress = document.getElementById("newAddress").value;
    const memberId = 10;

    fetch(`/members/updateAddress/${memberId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAddress),
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                alert("Address updated successfully to: " + data.address)
            } else {
                alert("Error: Member not found.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error updating member name");
        });
}

function updateEmail() {
    const newEmail = document.getElementById("newEmail").value;
    const memberId = 10;

    fetch(`/members/updateEmail/${memberId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmail),
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                alert("Email updated successfully to: " + data.name)
            } else {
                alert("Error: Member not found.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error updating member email");
        });
}

function updatePhoneNumber() {
    const newPhoneNumber = document.getElementById("newPhoneNumber").value;
    const memberId = 10;

    fetch(`/members/updatePhoneNumber/${memberId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPhoneNumber),
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                alert("Phone Number updated successfully.")
            } else {
                alert("Error: Member not found.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error updatig member email")
        });
}

function updateBoatOwnershipStatus() {
    const newPhoneNumber = document.getElementById("newBoatOwnershipStatus").value;
    const memberId = 10;

    fetch(`/members/updateBoatOwnershipStatus/${memberId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPhoneNumber),
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                alert("Boat ownership status updated successfully.")
            } else {
                alert("Error: Member not found.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error updatig member email")
        });
}
