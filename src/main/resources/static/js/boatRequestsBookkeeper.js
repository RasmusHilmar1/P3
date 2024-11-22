//import functions
import {createBtn, createIcons, createTable, BoatRequestTable} from "./boatRequests.js";

// create new Table constructor that overrides the one from boatRequests.js
class BoatRequestTableBook extends BoatRequestTable {
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
        // add icon cell for "tildelt"
        createIcons(row);

        // add buttons for "sendt" and "betalt"
        createBtn(row, data, "Sendt");
        createBtn(row, data, "Betalt");
    }
}

//event handler for when the boat has been assigned to a berth
function feeEvent(boats, members){
    const filteredBoats = boats.filter(boat => {
        const correspondingMember = members.find(member => member.member.memberID === boat.boat.memberID);
        return correspondingMember !== "Unknown Member";// only include pending boats with approved members
    });
    console.log(filteredBoats);
    filteredBoats.forEach(boat => {
        console.log(boat.boat.feeSent);
        console.log(boat.boat.feePaid);
        let feeSentBtnId = "feeSentBtn" + boat.boat.boatID;
        let feeSentBtn = document.getElementById(feeSentBtnId);
        console.log(feeSentBtn);
        let feePaidBtnId = "feePaidBtn" + boat.boat.boatID;
        let feePaidBtn = document.getElementById(feePaidBtnId);
        console.log(feePaidBtn);
    });
}

// initialize the empty arrays for the data
let boats = [], approvedMembers = [], pendingMembers = [], berths = [], pendingBoats = [];

// make sure that the calls to fetch are made after the window has finished loading all content
window.onload = async () => {
    await createTable(
        boats,
        approvedMembers,
        pendingMembers,
        pendingBoats,
        berths,
        BoatRequestTableBook,
        "boatRequestsContainer",
        "Bådanmodninger",
        ["Båd ID", "Båd Navn", "Medlemsnr.", "Medlems Navn", "Tildelt Båd", "Sendt Faktura", "Faktura Betalt"],
        pendingBoats,
        approvedMembers,
        7 );
    feeEvent(pendingBoats, approvedMembers);
};