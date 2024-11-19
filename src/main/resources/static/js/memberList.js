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
    calculatePrice(boats);
    getMemberList(members, boats, berths); // Pass all the required data
}

initialize();

function calculateAreal(boats) {
    boats.forEach(boat => {
        boat.areal = boat.length * boat.width;
        console.log("Boat ID:" + boat.boatID + " Boat areal: " + boat.areal);
    });
}

function calculatePrice(boats) {
    boats.forEach(boat => {
        boat.price = boat.areal * 50;
        console.log("Boat ID:" + boat.boatID + " Boat price: " + boat.price);
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

function getMemberList(members, boats, berths) {
    const table = document.getElementById("memberListBody");

    members.forEach(memberObj => {
        const member = memberObj.member;
        var row = table.insertRow();

        // Add editable member details
        addEditableCells(row, [
            { value: member.memberID, editable: false, type: "number"}, // Member ID is not editable
            { value: member.name, editable: true, },
            { value: member.address, editable: true },
            { value: member.email, editable: true },
            { value: member.phonenumber, editable: true },
        ]);

        if (member.boatownership == 1) {
            const boat = boats.find(boat => boat.memberID === member.memberID);

            if (boat) {
                addEditableCells(row, [
                    { value: boat.name, editable: true },
                    { value: boat.length, editable: true, type: "number" },
                    { value: boat.width, editable: true, type: "number" },
                    { value: boat.areal, editable: false }, // Areal is calculated
                    { value: boat.price, editable: false }, // Price is calculated
                ]);

                if (boat.berthID) {
                    const berth = berths.find(berth => berth.berthID === boat.berthID);
                    if (berth) {
                        addEditableCells(row, [
                            { value: berth.name, editable: false }, // Berth name is not editable
                        ]);
                    } else {
                        addEditableCells(row, [
                            { value: "No berth assigned", editable: false },
                        ]);
                    }
                } else {
                    addEditableCells(row, [
                        { value: "No berth assigned", editable: false },
                    ]);
                }
            } else {
                addEditableCells(row, [
                    { value: "No boat assigned", editable: false },
                    { value: "", editable: false },
                    { value: "", editable: false },
                    { value: "", editable: false },
                    { value: "", editable: false },
                ]);
            }
        } else {
            addEditableCells(row, [
                { value: "No boat ownership", editable: false },
                { value: "", editable: false },
                { value: "", editable: false },
                { value: "", editable: false },
                { value: "", editable: false },
            ]);
        }
    });

    // Attach input change listener for dynamic updates
    table.addEventListener("input", handleTableEdit);
}

function addEditableCells(tr, data) {
    data.forEach(function(cell) {
        const td = tr.insertCell();
        const input = document.createElement("input");
        input.type = cell.type || "text"; // Default to "text" if no type is provided
        input.value = cell.value;
            input.dataset.fieldName = cell.id || ""; // Save field name for backend update
            td.appendChild(input);
        }
    );
}

function handleTableEdit(event) {
    const target = event.target;
    if (target.tagName === "INPUT") {
        const newValue = target.value;
        const fieldName = target.dataset.fieldName;
        const memberID = target.closest("tr").querySelector("input").value; // Assuming MemberID is the first cell

        // Optional: Update local members array (not shown in your snippet)
        // Optional: Update backend
        updateMemberData(memberID, fieldName, newValue);
    }
}

function updateMemberData(memberID, fieldName, newValue) {
    console.log(memberID, fieldName, newValue);
    fetch(`/members/update/information/${memberID}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ newValue }), // Update specific field
    })
        .then(response => response.json())
        .then(data => {
            console.log(`Updated for Member ID ${memberID}:`, data);
        })
        .catch(error => {
            console.error("Error updating member data:", error);
        });
}

/*import { fetchApprovedMembers, fetchBoats, fetchBerth } from "./memberFetch.js";

async function initialize() {
    const members = await fetchApprovedMembers();
    console.log(members); // Check the structure of members data
    const boats = await fetchBoats();
    console.log(boats);
    const berths = await fetchBerth();
    console.log(berths);

    // Now call calculateAreal() after fetching the data
    calculateAreal(boats); // Pass boats data to the function
    calculatePrice(boats);
    getMemberList(members, boats, berths); // Pass all the required data
}

initialize();

function calculateAreal(boats) {
    boats.forEach(boat => {
        boat.areal = boat.length * boat.width;
        console.log("Boat ID:" + boat.boatID + " Boat areal: " + boat.areal);
    });
}

function calculatePrice(boats) {
    boats.forEach(boat => {
        boat.price = boat.areal * 50;
        console.log("Boat ID:" + boat.boatID + " Boat price: " + boat.price);
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

                // Now check if the boat has an associated berth
                if (boat.berthID) {
                    const berth = berths.find(berth => berth.berthID === boat.berthID);
                    if (berth) {
                        // If a berth is found, add berth name to the row
                        addCells(row, [berth.name]);
                    } else {
                        // If no berth is found, display a placeholder
                        addCells(row, ["No berth assigned"]);
                    }
                } else {
                    // If no berthID is found on the boat, display a placeholder
                    addCells(row, ["No berth assigned"]);
                }

            } else {
                // If no boat is found, add empty values or a placeholder
                addCells(row, ["No boat assigned", "", "", "", "", ""]);
            }
        } else {
            // If the member does not own a boat, add empty values for boat details
            addCells(row, ["No boat ownership", "", "", "", "", ""]);
        }
    });
/*
    function updateMemberData(memberID, fieldName, newValue) {
        // Find the member object in the members array by memberID
        const memberIndex = members.findIndex(member => member.memberID === memberID);
        if (memberIndex > -1) {
            members[memberIndex].member[fieldName] = newValue;
        }
            // Send a PUT request to the backend to update the name
            fetch(`/members/update/${memberID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newValue),  // Send the new name in the body
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
        */


