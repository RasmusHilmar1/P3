//import fetch function and objects
import {fetchApprovedMembers, fetchBoats, fetchBerth, fetchPendingMembers, fetchPendingBoats, parseData} from "./fetchMethods.js";
import {Berth, Boat, PendingBoat, Member, Table} from "./objects.js";

export {boats, pendingBoats, approvedMembers, pendingMembers, berths};
export {BoatRequestTable, BtnCreator, IconCreator, EventManager};
export {createTable};

// new class for specific boat request table
class BoatRequestTable extends Table {
    constructor(elementId, title, headers, firstArray, secondArray, colspan) {
        super(elementId, title, headers, firstArray, secondArray, colspan);// call parent constructor
    }
    createTable() {
        super.createTable();
    }
    addDataRows(firstArray, tableBody) {
        console.log(firstArray);
        // filter the pending boats
        let filteredBoats = firstArray.filter(boat => {
            console.log("searching for member with memberID:", boat.boat.memberID);
            console.log("in array:", this.secondArray);
            const correspondingMember = this.secondArray.find(member => member.id === boat.boat.memberID);
            console.log("found member:", correspondingMember);
            console.log(correspondingMember);
            return correspondingMember !== undefined; // Only include pending boats with approved members
        });
        console.log(filteredBoats);

        // only create rows for the filtered boats
        filteredBoats.forEach(item => {
            let row = tableBody.insertRow();
            row.id = "row_" + firstArray.indexOf(item);
            this.addCells(row, item);
            this.addSpecificCells(row, item);
            console.log(item);
        });
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

        let memberNameCell = row.insertCell();
        console.log(memberNameCell);
        let correspondingMember = this.secondArray.find(member => member.member.memberID === data.boat.memberID);
        console.log(correspondingMember);
        if (correspondingMember) {
            memberNameCell.innerHTML = correspondingMember.member.name;
        } else {
            memberNameCell.innerHTML = "Unknown Member";
            console.log("No member found with memberID:", data.boat.memberID);
        }
        console.log(correspondingMember);
    }
    addSpecificCells(row, data){
        super.addSpecificCells(row, data);
    }
}

class BtnCreator {
    constructor(row, data, btnText) {
        this.row = row;
        this.data = data;
        this.btnText = btnText;
    }

    createBtn() {
        let buttonCell = this.row.insertCell();
        buttonCell.className = "btnCells";
        let buttonContainer = document.createElement("a");
        let buttonElement = document.createElement("button");

        // give the buttons a class name
        buttonElement.classList.add("addBtn");
        buttonElement.textContent = this.btnText;

        if (this.btnText === "Tildelt") {
            buttonElement.id = "addBtn" + this.data.boat.boatID;
            console.log(buttonElement.id);
        } else if (this.btnText === "Sendt") {
            buttonElement.id = "feeSentBtn" + this.data.boat.boatID;
            console.log(buttonElement.id);
        } else if (this.btnText === "Betalt") {
            buttonElement.id = "feePaidBtn" + this.data.boat.boatID;
            console.log(buttonElement.id);
        } else if (this.btnText === "Accepter") {
            buttonElement.id = "acceptBtn" + this.data.member.memberID;
        } else if (this.btnText === "Afvis") {
            buttonElement.id = "denyBtn" + this.data.member.memberID;
        }


        buttonContainer.appendChild(buttonElement);
        buttonCell.appendChild(buttonContainer);

        console.log(buttonElement.id);
    }
}

// function for creating icons
class IconCreator {
    constructor(row, boat) {
        this.row = row;
        this.boat = boat;
    }

    createCell() {
        this.iconCell = this.row.insertCell();
        this.iconCell.className = "iconCells";
    }

    createIcons(data) {
        const checkmark = document.createElement("img");
        checkmark.src = "http://localhost:8080/Images/Icons/AcceptBtnIcon.png";
        const cross = document.createElement("img");
        cross.src = "http://localhost:8080/Images/Icons/DenyBtnIcon.png";
        // vessel inspector corresponding cell to "Sendt"
        if (data === this.boat.boat.feeSent) {
            if (data === 1) {
                this.iconCell.appendChild(checkmark);
            } else if (data === 0) {
                this.iconCell.appendChild(cross);
            }
        }
        // vessel inspector corresponding cell to "Betalt"
        else if (data === this.boat.boat.feePaid) {
            if (data === 1) {
                this.iconCell.appendChild(checkmark);
            } else if (data === 0) {
                this.iconCell.appendChild(cross);
            }
        }
        // bookkeeper corresponding cell to "Tildelt"
        else if (data === this.boat.boat.berthID) {
            if (data !== 9999) {
                this.iconCell.appendChild(checkmark);
            } else {
                this.iconCell.appendChild(cross);
            }
        }
    }
}

class EventManager {
    constructor(boats, members) {
        this.boats = boats;
        this.members = members;
    }
    filterBoats() {
        this.filteredBoats = this.boats.filter(boat => {
            const correspondingMember = this.members.find(member => member.member.memberID === boat.boat.memberID);
            return correspondingMember !== "Unknown Member";// only include pending boats with approved members
        });
        console.log(this.filteredBoats);
        return this.filteredBoats;
    }
    createEvent(){
        let btn = document.querySelector('.addBtn');
        if (btn) {
            btn.disabled = false;
        }
    }
}

// initialize the empty arrays for the data
let boats = [], pendingBoats=[], approvedMembers = [], pendingMembers = [], berths = [];

// function to call with window.onload
async function createTable(boatsArray, approvedMembersArray, pendingMembersArray, pendingBoatsArray, berthsArray, Table, elementId, title, headers, firstArray, secondArray, colspan){
    try {
        boatsArray = await parseData(fetchBoats(), Boat, boatsArray);
        pendingBoatsArray = await  parseData(fetchPendingBoats(), PendingBoat, pendingBoatsArray)
        approvedMembersArray = await parseData(fetchApprovedMembers(), Member, approvedMembersArray);
        pendingMembersArray = await parseData(fetchPendingMembers(), Member, pendingMembersArray);
        berthsArray = await parseData(fetchBerth(), Berth, berthsArray);
        console.log(boatsArray);
        console.log(pendingBoatsArray);
        console.log(approvedMembersArray);
        console.log(pendingMembersArray);
        console.log(berthsArray);

        console.log("data loaded!");
        new Table(elementId, title, headers, firstArray, secondArray, colspan);

    } catch (error){
        console.log("data not found and table not created.");
    }
}

