
var berthBtn = document.getElementById("berthBtn");

berthBtn.addEventListener("click", fetchBoats);

async function fetchBoats() {
    try {
        const response = await fetch('/members/getName/11');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();


        while (true) {
            const {done, value} = await reader.read();
            var string = new TextDecoder().decode(value);
            if (done) {
                // Do something with last chunk of data then exit reader
                return;
            }
        }

        const boats = await response.json();
        console.log("Fetched approved members:", boats); // Debug output

        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = ''; // Clear previous results

        boats.forEach(boats => {
            const boatID = boats.boatID;
            const boatInfo = document.createElement('div');
            memberInfo.textContent = `ID: ${member.memberID}, Name: ${member.name}, Address: ${member.address}, Email: ${member.email}`;
            resultDiv.appendChild(memberInfo);
        });
    } catch (error) {
        console.error('Error fetching approved members:', error);
    }
}