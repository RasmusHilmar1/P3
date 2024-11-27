//import fetch function and objects
import {fetchApprovedMembers, fetchBoats, fetchBerth, fetchPendingMembers, fetchPendingBoats, parseData} from "./fetchMethods.js";
import {Berth, Boat, PendingBoat, Member, Table} from "./objects.js";

export {BoatRequestTable, EventManagerBoatRequests};
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
            const correspondingMember = this.secondArray.find(member => member.member.memberID === boat.boat.memberID);
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

