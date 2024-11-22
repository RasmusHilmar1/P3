
//import functions
import {createBtn, createIcons, createTable, BoatRequestTable} from "./boatRequests.js";

// create new Table constructor that overrides the one from boatRequests.js
class BoatRequestTableVessel extends BoatRequestTable {
    constructor(elementId, title, headers, firstArray, secondArray, colspan) {
        super(elementId, title, headers, firstArray, secondArray, colspan);// call parent constructor
    }
    createTable() {
        super.createTable();
    }
    addDataRows(firstArray, tableBody) {
        super.addDataRows(firstArray, tableBody);
    }
    findCorrespondingMember(memberID){
        super.findCorrespondingMember(memberID);
    }
    addCells(row, data) {
        super.addCells(row, data);
    }
    addSpecificCells(row, data) {
        // add button for "tildelt"
        createBtn(row, data, "Tildelt");

        // add icon rows ready for feature with icons
        for (let i = 0; i < 2; i++) {
            createIcons(row);
        }
    }
}

//event handler for when the boat has been assigned to a berth
function boatAssignedEvent(boats, members){
    const filteredBoats = boats.filter(boat => {
        const correspondingMember = members.find(member => member.member.memberID === boat.boat.memberID);
        return correspondingMember !== "Unknown Member";// only include pending boats with approved members
    });
    console.log(filteredBoats);
    filteredBoats.forEach(boat => {
        let btn = document.querySelector('.addBtn');
        console.log(btn);
        console.log(btn.id);
        let btnId = "addBtn" + boat.boat.boatID;
        console.log(btnId);
        console.log(btn.id === btnId);
        boat.assigned = boat.boat.berthID !== 9999;
        console.log(boat.assigned);
        if (boat.assigned){
            btn.classList.add("")
        }
    });
}

// initialize the empty arrays for the data
let boats = [], approvedMembers = [], pendingMembers = [], berths = [], pendingBoats=[];

// make sure that the calls to fetch are made after the window has finished loading all content
window.onload = async () => {
    await createTable(
        boats,
        approvedMembers,
        pendingMembers,
        pendingBoats,
        berths,
        BoatRequestTableVessel,
        "boatRequestsContainer",
        "Bådanmodninger",
        ["Båd ID", "Båd Navn", "Medlemsnr.", "Medlems Navn", "Tildelt Båd", "Sendt Faktura", "Faktura Betalt"],
        pendingBoats,
        approvedMembers,
        7 );
    boatAssignedEvent(pendingBoats, approvedMembers);
};
