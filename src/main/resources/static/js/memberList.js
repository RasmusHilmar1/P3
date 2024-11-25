// Opdaterer medlemsinformationer
function updateMemberInformation(rowIndex) {
    // Indsamler alle værdierne og eventuelle ændringer fra input-felterne
    const updatedInfo = {
        memberID: document.querySelector(`input[name="memberID"][data-row="${rowIndex}"]`).value,
        memberName: document.querySelector(`input[name="memberName"][data-row="${rowIndex}"]`).value,
        memberAddress: document.querySelector(`input[name="memberAddress"][data-row="${rowIndex}"]`).value,
        memberEmail: document.querySelector(`input[name="memberEmail"][data-row="${rowIndex}"]`).value,
        memberPhonenumber: document.querySelector(`input[name="memberPhonenumber"][data-row="${rowIndex}"]`).value,
        boatID: document.querySelector(`input[name="boatID"][data-row="${rowIndex}"]`).value,
        boatName: document.querySelector(`input[name="boatName"][data-row="${rowIndex}"]`).value,
        boatLength: document.querySelector(`input[name="boatLength"][data-row="${rowIndex}"]`).value,
        boatWidth: document.querySelector(`input[name="boatWidth"][data-row="${rowIndex}"]`).value,
        boatAreal: document.querySelector(`input[name="boatAreal"][data-row="${rowIndex}"]`).value,
        boatPrice: document.querySelector(`input[name="boatPrice"][data-row="${rowIndex}"]`).value,
        berthID: document.querySelector(`input[name="berthID"][data-row="${rowIndex}"]`).value,
        berthName: document.querySelector(`input[name="berthName"][data-row="${rowIndex}"]`).value,
    };

    // Sender POST request til endpoint
    fetch(`/bookkeeperMemberList/updateMember`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // Konverterer til JSON string
        body: JSON.stringify(updatedInfo),
    })
        // Tjekker server respons
        .then(response => response.json())
        .then(data => {
            if (data) {
                alert("Information successfully updated");

                // Genindlæser siden så man kan se ændringer
                refreshMemberList();
            } else {
                alert("Error: Member not found.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error updating member information.");
        });
}

// Funktion der genindlæser siden
function refreshMemberList() {
    // Redirects the page to /bookkeeperMemberList
    window.location.href = '/bookkeeperMemberList'; // or use window.location.replace('/bookkeeperMemberList') to avoid adding the page to history
}

// Function der henter og filtrerer søgning
function searchMembers() {
    // Henter værdi fra input-feltet med søgning
    const searchQuery = document.getElementById('searchInput').value;
    //Sender GET request med søgequery
    fetch('/bookkeeperMemberList/search?query=' + encodeURIComponent(searchQuery))
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        //Opdaterer tabel baseret på søgning
        .then(data => {
            const tableBody = document.querySelector('tbody');
            if (!tableBody) {
                console.error('Table body not found!');
                return;
            }

            // Fjerner alle rækker
            tableBody.innerHTML = '';

            // Generer nye felter med medlemmer der opfylder søgeresultat
            data.forEach((member, index) => {
                const row = `
                <tr>
                    <td><input type="text" name="memberID" value="${member.memberID}" class="form-control" data-row="${index}" readonly></td>
                    <td><input type="text" name="memberName" value="${member.memberName}" class="form-control" data-row="${index}"></td>
                    <td><input type="text" name="memberAddress" value="${member.memberAddress}" class="form-control" data-row="${index}"></td>
                    <td><input type="text" name="memberEmail" value="${member.memberEmail}" class="form-control" data-row="${index}"></td>
                    <td><input type="text" name="memberPhonenumber" value="${member.memberPhonenumber}" class="form-control" data-row="${index}"></td>
                    <td hidden><input type="number" name="boatID" value="${member.boatID}" class="form-control" data-row="${index}" readonly></td>
                    <td><input type="text" name="boatName" value="${member.boatName}" class="form-control" data-row="${index}"></td>
                    <td><input type="number" name="boatLength" value="${member.boatLength}" class="form-control" data-row="${index}"></td>
                    <td><input type="number" name="boatWidth" value="${member.boatWidth}" class="form-control" data-row="${index}"></td>
                    <td><input type="text" name="boatAreal" value="${member.boatAreal}" class="form-control" data-row="${index}" readonly></td>
                    <td><input type="text" name="boatPrice" value="${member.boatPrice}" class="form-control" data-row="${index}" readonly></td>
                    <td hidden><input type="number" name="berthID" value="${member.berthID}" class="form-control" data-row="${index}" readonly></td>
                    <td><input type="text" name="berthName" value="${member.berthName}" class="form-control" data-row="${index}" readonly></td>
                    <td>
                        <button onclick="updateMemberInformation(${index})" data-row="${index}">Gem Ændringer</button>
                    </td>
                </tr>`;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(error => {
            console.error('Error fetching members:', error);
            alert('Could not fetch members. Please try again.');
        });
}
// Funktion til at eksporterer specifik excel fil.
function exportSelectedList() {
    // Får værdi fra menuen fra html'et
    const selectedList = document.getElementById('listSelect').value;
    // if statement for at tjekke hvilken liste der skal eksporteres
    if (selectedList === 'memberList') {
        // eksporterer listen ved at redirect til et api endpoint lavet i MemberlistController
        window.location.href = '/bookkeeperMemberlist/MemberExcel';
    } else if (selectedList === 'emailList') {
        window.location.href = '/bookkeeperMemberlist/EmailExcel';
    } else {
        console.error('Invalid selection');
        alert('Invalid selection');
    }
}