
//import functions
import {createBtn, createIcons,  Table, createTable} from "./boatRequests.js";

// create new Table constructor that overrides the one from objects.js
class BoatRequestTableVessel extends Table {
    constructor(elementId, title, headers, array) {
        super(elementId, title, headers, array);// Call parent constructor
    }
    createTable() {
        super.createTable();
    }
    addDataRows(array, tableBody) {
        super.addDataRows(array, tableBody); //IMPORTANT: husk at lav sådan at det kun er dem der mangler at betale og få tildelt plads der kommer frem (PENDING BOATS)
    }
    addCells(row, data) {
        let idCell = row.insertCell();
        idCell.innerHTML = data.member.memberID; // access ID property
        let nameCell = row.insertCell();
        nameCell.innerHTML = data.member.name; // access name property
        console.log(data);

        // add button for "tildelt"
        createBtn(row, data, "Tildelt");

        // add icon rows ready for feature with icons
        for (let i = 0; i < 2; i++) {
            createIcons(row);
        }
    }
}

// initialize the empty arrays for the data
let boats = [], approvedMembers = [], pendingMembers = [], berths = [];

// make sure that the calls to fetch are made after the window has finished loading all content
window.onload = async () => {
    await createTable(boats, approvedMembers, pendingMembers, berths, BoatRequestTableVessel, approvedMembers);
};
