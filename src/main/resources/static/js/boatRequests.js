
//import fetch function and objects
import {fetchApprovedMembers, fetchBoats, fetchBerth, fetchPendingMembers, fetchPendingBoats} from "./fetchMethods.js";
import {Berth, Boat, PendingBoat, Member} from "./objects.js";

// class for a table
export class Table {
    constructor(elementId, title, headers, firstArray, secondArray, colspan) {
        this.element = document.getElementById(elementId);
        console.log(this.element);
        this.title = title;
        this.headers = headers;
        this.firstArray = firstArray;
        console.log("Data parsed to createTable:", this.firstArray);
        this.secondArray = secondArray;
        console.log("Data parsed as second array:", this.secondArray);
        this.colspan = colspan;

        this.createTable();
    }

    // function for creating table
    createTable() {
        // creating the structure of the table
        const table = document.createElement("table");
        const tableHead = document.createElement("thead");
        const tableBody = document.createElement("tbody");

        // creating the header for the table
        const tableHeadRow = tableHead.insertRow();
        const tableHeadCell = tableHeadRow.insertCell();
        tableHeadCell.innerHTML = this.title;
        console.log(this.title);
        tableHeadCell.colSpan = this.colspan;
        tableHead.appendChild(tableHeadCell);
        table.appendChild(tableHead);

        //Adding header rows to differentiate between content
        const headerRow = document.createElement("tr");
        this.headers.forEach(item => {
            let th = headerRow.insertCell();
            th.innerHTML = item;
            console.log(item);
        });
        table.appendChild(headerRow);

        //creating rows for the data
        this.addDataRows(this.firstArray, tableBody);

        table.appendChild(tableBody);

        this.element.appendChild(table);
    }
    findCorrespondingMember(memberID){ // could maybe be edited into a more general "findCorrespondingObject" or something
        const member = this.secondArray.find(member => member.memberID === memberID);
        return member? member.name : "Unknown Member";
    }
    addDataRows(array, tableBody) {
        array.forEach(item => {
            let row = tableBody.insertRow();
            row.id = "row_" + array.indexOf(item);
            this.addCells(row, item);
            this.addSpecificCells(row, item);
            console.log(item);
        });
    }
    addCells(row, data){
        Object.values(data).forEach(value => {
            let td = row.insertCell();
            td.innerHTML = value;// Access data using item within forEach
        });
    }
    addSpecificCells(row, data){
        let newCell = row.insertCell();
        newCell.innerHTML = data;
    }
}

// new class for specific boat request table
export class BoatRequestTable extends Table {
    constructor(elementId, title, headers, firstArray, secondArray, colspan) {
        super(elementId, title, headers, firstArray, secondArray, colspan);// call parent constructor
    }
    createTable() {
        super.createTable();
    }
    addDataRows(firstArray, tableBody) {
        // filter the pending boats
        const filteredBoats = firstArray.filter(boat => {
            const correspondingMember = this.findCorrespondingMember(boat.boat.memberID);
            return correspondingMember !== "Unknown Member"; // only include pending boats with approved members
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
    findCorrespondingMember(memberID){
        console.log("searching for member with memberID:", memberID);
        console.log("in array:", this.secondArray);
        const member = this.secondArray.find(member => member.member.memberID === memberID);
        console.log("found member:", member);
        return member;
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

//function for creating button element
export function createBtn(row, boat, btnText) {
    let buttonCell = row.insertCell();
    let buttonContainer = document.createElement("a");
    let buttonElement = document.createElement("button");

    // give the buttons a class name
    buttonElement.classList.add("addBtn");
    buttonElement.textContent = btnText;

    buttonElement.id = "addBtn" + boat.boat.boatID;

    buttonContainer.appendChild(buttonElement);
    buttonCell.appendChild(buttonContainer);
}

// function for creating icons
export function createIcons(row){
        let iconCell = row.insertCell();
        iconCell.innerHTML = "";
        console.log(iconCell);
}

// parsing the data from fetch
export async function parseData(method, object, array){

    const parsedData = await method;
    console.log(parsedData);

     parsedData.map(objectData => {
        if (object === Berth){
            array.push(new object(objectData.berthID, objectData.name, objectData.availability, objectData.length, objectData.width, objectData.depth, objectData.pierId));
        } else if(object === Boat){
            array.push(new Boat(objectData.boatID, objectData.memberID, objectData.berthID, objectData.name, objectData.type, objectData.manufacturer, objectData.length, objectData.width, objectData.draught, objectData.insurance));
        } else if(object === PendingBoat){
            array.push(new object(objectData.id, objectData.boat));
            console.log(objectData.id, objectData.boat);
        } else if (object === Member) {
            array.push(new object(objectData.id, objectData.member));
        }
    });
    // return the array with elements
    return array;
}

// function to call with window.onload
export async function createTable(boatsArray, approvedMembersArray, pendingMembersArray, pendingBoatsArray, berthsArray, Table, elementId, title, headers, firstArray, secondArray, colspan){
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

