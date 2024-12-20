// arrays
import {boats, pendingBoats, approvedMembers, pendingMembers, berths} from "./fetchMethods.js";
// classes
import {BoatRequestTable, EventManagerBoatRequests} from "./boatRequests.js";
import {BtnCreator, IconCreator} from "./objects.js";
// function
import {createTable} from "./boatRequests.js"

// create new Table constructor that overrides the one from boatRequests.js
class BoatRequestTableVessel extends BoatRequestTable {
    constructor(elementId, title, headers, firstArray, secondArray, colspan) {
        super(elementId, title, headers, firstArray, secondArray, colspan);// call parent constructor
    }
    createTable() {
        super.createTable();
    }
    addDataRows(tableBody) {
        super.addDataRows(tableBody);
    }
    addCells(row, data) {
        super.addCells(row, data);
    }
    extractData(data) {
        return super.extractData(data);
    }
    addSpecificCells(row, data) {
        // add button for "tildelt"
        let assignBtn = new BtnCreator(row);
        assignBtn.createBtn("Tildelt", data, "Tildelt");

        // Initialize the icons' paths
        const iconCreator = new IconCreator({
            checkmark: "http://localhost:8080/Images/Icons/AcceptBtnIcon.png",
            cross: "http://localhost:8080/Images/Icons/DenyBtnIcon.png"
        });

        // create icons for the bookkeeeper's "Sendt" and "Betalt"
        const iconCellFeeSent = row.insertCell();
        iconCellFeeSent.className = "iconCells";
        const iconCellFeePaid = row.insertCell();
        iconCellFeePaid.className = "iconCells";

        iconCreator.appendIconToCell(iconCellFeeSent, data.boat.feeSent === 1, 'checkmark', 'cross')
        iconCreator.appendIconToCell(iconCellFeePaid, data.boat.feePaid === 1, 'checkmark', 'cross');
    }
}

class BoatAssignedEvent extends EventManagerBoatRequests {
    constructor (boats, members) {
        super(boats, members);
    }
    filterBoats() {
        return super.filterBoats();
    }
    createEvent() {
        this.filterBoats();

        this.filteredBoats.forEach(boat => {
            // deconstruct boat object
            let { boatID, berthID } = boat.boat;

            // query all buttons with class 'addBtn'
            let addBtns = document.querySelectorAll(".addBtn");

            addBtns.forEach(addBtn => {
                let addBtnId = "addBtn" + boatID;
                console.log(addBtn.id === addBtnId);

                if (addBtn.id === addBtnId) {
                    boat.assigned = berthID !== 9999;
                    if (boat.assigned) {
                        addBtn.classList.add('buttonAssigned');
                        addBtn.disabled = true;
                    } else {
                        addBtn.classList.remove('buttonAssigned');
                        addBtn.disabled = false;
                    }
                }
            });
        });
    }
}

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

    // call event class
    let boatAssignedEvent = new BoatAssignedEvent(pendingBoats, approvedMembers);
    boatAssignedEvent.createEvent();
};
