//import fetch function and objects
import {fetchApprovedMembers, fetchBoats, fetchBerth, fetchPendingMembers, fetchPendingBoats, parseData} from "./fetchMethods.js";
import {Berth, Boat, PendingBoat, Member, Table, IconCreator} from "./objects.js";

export {BoatRequestTable, EventManagerBoatRequests};
export {createTable};

class BoatRequestTable extends Table {
    constructor(elementId, title, headers, firstArray, secondArray, colspan) {
        super(elementId, title, headers, firstArray, secondArray, colspan);// call parent constructor
    }
    createTable() {
        super.createTable();
    }
    addDataRows(tableBody) {
        console.log(this.firstArray);
        // filter the pending boats
        let filteredBoats = this.firstArray.filter(boat => {
            console.log("searching for member with memberID:", boat.boat.memberID);
            console.log("in array:", this.secondArray);
            const correspondingMember = this.secondArray.find(member => member.member.memberID === boat.boat.memberID);
            console.log("found member:", correspondingMember);
            console.log(correspondingMember);
            return correspondingMember !== undefined; // Only include pending boats with approved members
        });
        console.log(filteredBoats);

        // only create rows for the filtered boats
        filteredBoats.forEach(boat => {
            console.log(boat);
            let row = tableBody.insertRow();
            console.log(row);
            row.id = "row_" + this.firstArray.indexOf(boat);
            console.log(row.id);
            this.addCells(row, boat);
            this.addSpecificCells(row, boat);
            console.log(boat);
        });
    }
    addCells(row, data) {
        // create cells for boat data
        let boatIdCell = row.insertCell();
        boatIdCell.innerHTML = data.boat.boatID;// access boat ID property
        let boatNameCell = row.insertCell();
        boatNameCell.innerHTML = data.boat.name; // access boat name property

        // create cells for member data
        let memberIdCell = row.insertCell();
        memberIdCell.innerHTML = data.boat.memberID; // access member id property
        let memberNameCell = row.insertCell();
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
    extractData(data) {
        return super.extractData(data);
    }
    addSpecificCells(row, data, cellContent){
        super.addSpecificCells(row, data, cellContent);
    }
}

//CHECK THE CLASSES HERE ---->

class EventManagerBoatRequests {
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

