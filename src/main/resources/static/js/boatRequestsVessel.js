// arrays
import {boats, pendingBoats, approvedMembers, pendingMembers, berths} from "./boatRequests.js";
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
    addDataRows(firstArray, tableBody) {
        super.addDataRows(firstArray, tableBody);
    }
    addCells(row, data) {
        super.addCells(row, data);
    }
    addSpecificCells(row, data) {
        // add button for "tildelt"
        let assignBtn = new BtnCreator(row, data, "Tildelt");
        assignBtn.createBtn();

        // add icon rows for bookkeeper's respective "sendt" and "betalt"
        let iconFeeSent = new IconCreator(row, data);
        iconFeeSent.createCell();
        iconFeeSent.createIcons(data.boat.feeSent);
        let iconFeePaid = new IconCreator(row, data);
        iconFeePaid.createCell();
        iconFeePaid.createIcons(data.boat.feePaid);
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
            let addBtn = document.querySelector('.addBtn');
            console.log(addBtn);
            console.log(addBtn.id);
            let addBtnId = "addBtn" + boat.boat.boatID;
            console.log(addBtnId);
            console.log(addBtn.id === addBtnId);
            if (addBtn) {
                boat.assigned = boat.boat.berthID !== 9999;
                console.log(boat.assigned);

                if (boat.assigned) {
                    addBtn.classList.add('buttonAssigned');
                    addBtn.disabled = true;
                } else {
                    addBtn.classList.remove('buttonAssigned');
                    addBtn.disabled = false;
                }
            }
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
