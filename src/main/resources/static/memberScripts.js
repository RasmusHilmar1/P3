function updateMemberName() {
    const newName = document.getElementById("newName").value;
    const memberId = 10;  // ID of the member you want to update (for example, Member 10)

    // Send a PUT request to the backend to update the name
    fetch(`/members/update/${memberId}`, {
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