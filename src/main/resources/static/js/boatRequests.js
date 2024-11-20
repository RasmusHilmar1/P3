
//import fetch function and objects
import {fetchApprovedMembers, fetchBoats, fetchBerth, fetchPendingMembers} from "./memberFetch.js";
import {Berth, Boat, Member, Table} from "./objects.js";
//import functions from sidebarVessel

// create new Table constructor that overrides the one from objects.js
class BerthRequestTable extends Table {
    constructor(elementId, title, headers, array) {
        super(elementId, title, headers, array);// Call parent constructor
    }
    createTable() {
        super.createTable();
    }
    addDataRows(array, tableBody) {
        super.addDataRows(array, tableBody);
    }
    addCells(row, data) {
        let idCell = row.insertCell();
        idCell.innerHTML = data.member.memberID; // access ID property
        let nameCell = row.insertCell();
        nameCell.innerHTML = data.member.name; // access name property
        console.log(data);
        createBtn(row);
        createIcons(row);
    }
}

//functions for creating button element and icons
function createBtn (row, data){
    let buttonCell = row.insertCell();
    let buttonContainer = document.createElement("a");
    let buttonElement = document.createElement("button");
    buttonElement.textContent = "Tildel plads";
    buttonElement.classList.add("addBtn");
    buttonElement.id = "addBtn" + data.member.memberID;
    buttonContainer.appendChild(buttonElement);
    buttonCell.appendChild(buttonContainer);
    buttonContainer.setAttribute("href", "vesselInspectorStartPage.html");
    console.log(buttonCell);
}

function createIcons(row){
    for (let i = 0; i < 2; i++){
        let iconCell = row.insertCell();
        iconCell.innerHTML = "";
        console.log(iconCell);
    }
}

/*function assignBoat(){
    let assignBtn = document.getElementById("addBtn");

}*/

async function parseData(method, object, array){

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

// initialize the empty arrays for the data
let boats = [], approvedMembers = [], pendingMembers = [], berths = [];

// Make sure that the calls to fetch are made after the window has finished loading all content
window.onload = async function() {
    try {
        boats = await parseData(fetchBoats(), Boat, boats);
        approvedMembers = await parseData(fetchApprovedMembers(), Member, approvedMembers);
        pendingMembers = await parseData(fetchPendingMembers(), Member, pendingMembers);
        berths = await parseData(fetchBerth(), Berth, berths);
        console.log(approvedMembers);
        console.log(approvedMembers[0].member.memberID);
        console.log(approvedMembers[1].member.name);

        console.log("data loaded!");
        new BerthRequestTable("boatRequestsContainer",  "Bådanmodninger", ["ID", "Navn", "Tildelt Båd", "Sendt Faktura", "Faktura Betalt"], approvedMembers);
        /*getBoatRequests();*/
    } catch (error){
    console.log("data not found and table not created.");
    }
}
