// arrays
import {boats, pendingBoats, approvedMembers, pendingMembers, berths} from "./fetchMethods.js";
// classes
import {BoatRequestTable, EventManagerBoatRequests} from "./boatRequests.js";
import {BtnCreator, IconCreator} from "./objects.js";
// function
import {createTable} from "./boatRequests.js"

// create new Table constructor that overrides the one from boatRequests.js
class BoatRequestTableBook extends BoatRequestTable {
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
        // add icon cell for vessel inspector's "tildelt"
        const iconCreator = new IconCreator({
            checkmark: "http://localhost:8080/Images/Icons/AcceptBtnIcon.png",
            cross: "http://localhost:8080/Images/Icons/DenyBtnIcon.png"
        });

        const iconCell = row.insertCell();
        iconCell.className = "iconCells";

        iconCreator.appendIconToCell(iconCell, data.boat.berthID !== 9999, 'checkmark', 'cross');

        // add buttons for "sendt" and "betalt"
        let sendBtn = new BtnCreator(row);
        sendBtn.createBtn("Sendt", data, "Sendt");
        let paidBtn = new BtnCreator(row);
        paidBtn.createBtn("Betalt", data, "Betalt");
    }
}

class FeeEvent extends EventManagerBoatRequests {
    constructor(boats, members) {
        super(boats, members);
    }
    filterBoats() {
        return super.filterBoats();
    }
    createEvent() {
        let feeSentBtnId, feePaidBtnId;

        this.filterBoats();

        this.filteredBoats.forEach(boat => {
            let {feeSentBtn, feePaidBtn, feeSent, feePaid, boatID} = boat.boat;

            feeSentBtnId = "feeSentBtn" + boatID;
            boat.feeSentBtn = document.getElementById(feeSentBtnId);
            feeSentBtn = boat.feeSentBtn;

            feePaidBtnId = "feePaidBtn" + boatID;
            boat.feePaidBtn = document.getElementById(feePaidBtnId);
            feePaidBtn = boat.feePaidBtn;

            // make sure the btn is pressed if fee has been sent
            feeSent === 0 ? feeSentBtn.classList.remove("buttonAssigned") : feeSentBtn.classList.add("buttonAssigned");

            feeSentBtn.addEventListener("click", () => {
                if (feeSent === 0){
                    feeSent = 1;
                    feeSentBtn.classList.add("buttonAssigned");
                    console.log("Fee sent for boat ID:", boatID);
                } else if (feeSent === 1){
                    feeSent = 0;
                    feeSentBtn.classList.remove("buttonAssigned");
                    console.log("Corrected to fee not sent for boat ID:", boatID);
                }
                updateBoatFeeStatus(boatID, "feeSent", feeSent);
                location.reload();
            });

            // Make sure the buttons have the correct styling corresponding to data
            feePaid === 0 ? feePaidBtn.classList.remove("buttonAssigned") : feePaidBtn.classList.add("buttonAssigned");

            // event listener for updating data and changing style of buttons
            feePaidBtn.addEventListener("click", () => {
                if (feePaid === 0){
                    if (confirm("Er du sikker på at medlemmet har betalt for bådpladsen?")){
                        feePaid = 1;
                        feePaidBtn.classList.add('buttonAssigned');
                        console.log("Fee paid for boat ID:", boatID);
                    }
                } else if (feePaid === 1){
                    feePaid = 0;
                    feePaidBtn.classList.remove("buttonAssigned");
                    console.log("Corrected to fee not paid for boat ID:", boatID);
                }
                updateBoatFeeStatus(boatID, "feePaid", feePaid);
                setTimeout(function() {
                    approveBoat(boat.id);
                }, 500);
                setTimeout(function() {
                    location.reload();
                }, 800)
            });
        });
    }
}


// Move the pending boat to approved
async function approveBoat(boatId){
    try {
        let url = `/boats/update/approve/boat/${boatId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            console.error("Failed to approve boat.");
        } else {
            console.log(`Boat with ID ${boatId} approved successfully.`)
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// function for updating feePaid and feeSent
async function updateBoatFeeStatus(boatID, feeType, status) {
    try {
        let url;
        if(feeType === "feeSent") {
            url = `/boats/update/feeSent/${boatID}`;
        } else if (feeType === "feePaid") {
            url = `/boats/update/feePaid/${boatID}`;
        } else {
            console.error("Invalid fee type specified.");
            return 0;
        }
        const response = await  fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(status),
        });
        if (!response.ok) {
            console.error("Failed to update fee status for boat.");
        } else {
            console.log("Boat fee status update successful.")
        }
    } catch (error) {
        console.error("Error:", error);
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
        BoatRequestTableBook,
        "boatRequestsContainer",
        "Bådanmodninger",
        ["Båd ID", "Båd Navn", "Medlemsnr.", "Medlems Navn", "Tildelt Båd", "Sendt Faktura", "Faktura Betalt"],
        pendingBoats,
        approvedMembers,
        7 );
    let feeEvent = new FeeEvent(pendingBoats, approvedMembers);
    feeEvent.createEvent();
};