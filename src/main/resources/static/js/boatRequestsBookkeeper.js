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
        console.log("addCells called with data:", data);
        let boatIdCell = row.insertCell();
        boatIdCell.innerHTML = data.boat.boatID;// access boat ID property
        let boatNameCell = row.insertCell();
        boatNameCell.innerHTML = data.boat.name; // access boat name property
        let memberIdCell = row.insertCell();
        memberIdCell.innerHTML = data.boat.memberID; // access member id property
        console.log(data);

        //get members name with use of the boat's memberID
        let memberNameCell = row.insertCell();
        console.log(memberNameCell);
        let correspondingMember = this.findCorrespondingMember(data.boat.memberID);
        if (correspondingMember) {
            memberNameCell.innerHTML = correspondingMember.member.name;
        } else {
            memberNameCell.innerHTML = "Unknown Member";
            console.log("No member found with memberID:", data.boat.memberID);
        }
        console.log(correspondingMember);

        // add icon cell for "tildelt"
        createIcons(row);

        // add buttons for "sendt" and "betalt"
        createBtn(row, data, "Sendt");
        createBtn(row, data, "Betalt");
    }
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
};