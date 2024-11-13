
export {fetchApprovedMembers, fetchBoats};

var memberBtn = document.getElementById("memberBtn");

memberBtn.addEventListener("click", fetchApprovedMembers);

async function fetchApprovedMembers() {
    try {
        const response = await fetch('/api/approvedMembers');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const approvedMembers = await response.json();
        console.log("Fetched approved members:", approvedMembers); // Debug output

        return approvedMembers;

        /*
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = ''; // Clear previous results
        approvedMembers.forEach(approvedMember => {
            const member = approvedMember.member;
            //const memberInfo = document.createElement('div');
            //memberInfo.textContent = `ID: ${member.memberID}, Name: ${member.name}, Address: ${member.address}, Email: ${member.email}`;
            //resultDiv.appendChild(memberInfo);
        });
        */

    } catch (error) {
        console.error('Error fetching approved members:', error);
    }
}

async function fetchBoats() {
    try {
        const response = await fetch('/boats');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const boats = await response.json();
        console.log("Fetched approved members:", boats); // Debug output

        return boats;


    } catch (error) {
        console.error('Error fetching boats:', error);
    }
}

