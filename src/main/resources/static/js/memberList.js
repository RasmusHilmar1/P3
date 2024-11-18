import { fetchApprovedMembers, fetchBoats, fetchBerth } from "./memberFetch.js";

async function initialize() {
    const members = await fetchApprovedMembers();
    console.log(members);
    const boats = await fetchBoats();
    console.log(boats);
    const berths = await fetchBerth();
    console.log(berths);

    // Now call calculateAreal() after fetching the data
    calculateAreal(boats); // Pass boats data to the function
    getMemberList(members, boats, berths); // Pass all the required data
}

initialize();

function calculateAreal(boats){
    boats.forEach(boat => {
        boat.areal = boat.length * boat.width;
        console.log("Boat ID:" + boat.boatID + " Boat areal: " + boat.areal);
    });
}

function convertKeys(members, boats, berths){
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

function addCells(tr, data){
    // Iterate over the data
    data.forEach(function(item){
        var td = tr.insertCell();
        td.textContent = item;
    });
}

function getMemberList(members, boats, berths){
    const table = document.getElementById("memberListBody");
    // For each member, find corresponding boat and berth
    members.forEach(member => {
        member.correspondingBoat = boats.find(boat => boat.memberID === member.memberID);
        console.log("Corresponding Boat for Member:", JSON.stringify(member.correspondingBoat));

        if (member.correspondingBoat){
            console.log("Boat's Berth ID:", member.correspondingBoat.berthID);
            member.correspondingBerth = berths.find(berth => berth.berthID === member.correspondingBoat.berthID);
            console.log("Corresponding Berth:", JSON.stringify(member.correspondingBerth));
        }
    });

    // For each member, create a row and add the data
    members.forEach(member => {
        console.log(member)
        var row = table.insertRow();
        addCells(row, [member.memberID, member.name, member.address, member.email, member.phonenumber,"","","","","",""]);

        // find boat assigned to berth and corresponding member

    });
}

/*        if (member.correspondingBoat){
            // Since correspondingBoat is the boat object, access its properties directly
            addCells(row, [member.correspondingBoat.name, member.correspondingBoat.length + "m", member.correspondingBoat.width + "m", member.correspondingBoat.areal + "m^2"]);
            if (member.correspondingBerth){
                addCells(row, [member.correspondingBerth.name]);
            }
        } else {
            addCells(row, ["", "", "", "", "", ""]);
        }*/
