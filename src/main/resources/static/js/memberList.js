import { fetchApprovedMembers, fetchBoats, fetchBerth } from "./memberFetch.js";

async function initialize() {
    const members = await fetchApprovedMembers();
    console.log(members); // Check the structure of members data
    const boats = await fetchBoats();
    console.log(boats);
    const berths = await fetchBerth();
    console.log(berths);

    // Now call calculateAreal() after fetching the data
    calculateAreal(boats); // Pass boats data to the function
    getMemberList(members, boats, berths); // Pass all the required data
}

initialize();

function calculateAreal(boats) {
    boats.forEach(boat => {
        boat.areal = boat.length * boat.width;
        console.log("Boat ID:" + boat.boatID + " Boat areal: " + boat.areal);
    });
}

function convertKeys(members, boats, berths) {
    berths.forEach(berth => {
        console.log(Object.keys(berth));
    });
    boats.forEach(boat => {
        console.log(Object.keys(boat));
    });
    members.forEach(member => {
        console.log(Object.keys(member));
    });
}

function addCells(tr, data) {
    // Iterate over the data
    data.forEach(function(item) {
        var td = tr.insertCell();
        td.textContent = item;
    });
}

function getMemberList(members, boats, berths) {
    const table = document.getElementById("memberListBody");

    // For each member, create a row and add the data
    members.forEach(memberObj => {
        const member = memberObj.member;  // Access the 'member' property
        console.log(member);  // This should now log the member data correctly
        var row = table.insertRow();

        // Add member details to the row
        addCells(row, [
            member.memberID,
            member.name,
            member.address,
            member.email,
            member.phonenumber,
        ]);

        // Check if the member owns a boat
        if (member.boatownership == 1) {
            // Find the boat associated with the member by matching memberID
            const boat = boats.find(boat => boat.memberID === member.memberID);

            if (boat) {
                // If a boat is found, add boat details to the row
                addCells(row, [
                    boat.name,          // Boat name
                    boat.length,        // Boat length
                    boat.width,         // Boat width
                    boat.areal,         // Boat area (assuming you have calculated this already)
                    boat.price,         // Boat price
                ]);
            } else {
                // If no boat is found, add empty values or a placeholder
                addCells(row, ["No boat assigned", "", "", "", ""]);
            }
        } else {
            // If the member does not own a boat, add empty values for boat details
            addCells(row, ["No boat ownership", "", "", "", ""]);
        }

        // Optionally, you can add logic to find and display berth data related to the member
    });
}
