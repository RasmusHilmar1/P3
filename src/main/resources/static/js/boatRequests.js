
//import fetch function and objects
import {fetchApprovedMembers, fetchBoats, fetchBerth, fetchPendingMembers} from "./memberFetch.js";
import {Berth, Boat, Member} from "./objects.js";

// class for a table
export class Table {
    constructor(elementId, title, headers, array) {
        this.element = document.getElementById(elementId);
        this.title = title;
        this.headers = headers;
        this.array = array;

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
        tableHeadCell.colSpan = 5;
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
        this.addDataRows(this.array, tableBody);

        table.appendChild(tableBody);

        this.element.appendChild(table);
    }
    addDataRows(array, tableBody) {
        array.forEach(item => {
            let row = tableBody.insertRow();
            row.id = "row_" + array.indexOf(item);
            this.addCells(row, item);
            console.log(item);
        });
    }
    addCells(row, data){
        Object.values(data).forEach(value => {
            let td = row.insertCell();
            td.innerHTML = value;// Access data using item within forEach
        });
    }
}

//function for creating button element
export function createBtn(row, member, btnText) {
    let buttonCell = row.insertCell();
    let buttonContainer = document.createElement("a");
    let buttonElement = document.createElement("button");

    // give the buttons a class name
    buttonElement.classList.add("addBtn");
    buttonElement.textContent = btnText;

    buttonElement.id = "addBtn" + member.member.memberID;

    buttonContainer.appendChild(buttonElement);
    buttonCell.appendChild(buttonContainer);

    //REMEMBER TO ADD EVENT LISTENER HERE IN ORDER TO CREATE FEATURE WITH ICONS
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
        } else if (object === Member) {
            array.push(new object(objectData.id, objectData.member));
        }
    });
    // return the array with elements
    return array;
}

// function for updating corresponding rows in each roles' respective table
// IMPORTANT: the corresponding row can be found, but the state of the cells cannot be saved without serverside
export function updateCorrespondingRow(rowId, targetCell, action) {
    // CHECK COMMENT ABOVE
}

// function to call with window.onload
export async function createTable(boatsArray, approvedMembersArray, pendingMembersArray, berthsArray, Table, array){
    try {
        boatsArray = await parseData(fetchBoats(), Boat, boatsArray);
        approvedMembersArray = await parseData(fetchApprovedMembers(), Member, approvedMembersArray);
        pendingMembersArray = await parseData(fetchPendingMembers(), Member, pendingMembersArray);
        berthsArray = await parseData(fetchBerth(), Berth, berthsArray);
        console.log(boatsArray);
        console.log(approvedMembersArray);
        console.log(pendingMembersArray);
        console.log(berthsArray);

        console.log("data loaded!");
        new Table("boatRequestsContainer",  "Bådanmodninger", ["ID", "Navn", "Tildelt Båd", "Sendt Faktura", "Faktura Betalt"], array);

    } catch (error){
        console.log("data not found and table not created.");
    }
}

