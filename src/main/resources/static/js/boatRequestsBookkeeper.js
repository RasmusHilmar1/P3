// arrays
import {boats, pendingBoats, approvedMembers, pendingMembers, berths} from "./boatRequests.js";
// classes
import {BoatRequestTable, BtnCreator, IconCreator, EventManager} from "./boatRequests.js";
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
    addDataRows(firstArray, tableBody) {
        super.addDataRows(firstArray, tableBody);
    }
    findCorrespondingMember(memberID){
        super.findCorrespondingMember(memberID);
    }
    addCells(row, data) {
        super.addCells(row, data);
    }
    addSpecificCells(row, data) {
        // add icon cell for vessel inspector's "tildelt"
        let icon = new IconCreator(row, data);
        icon.createCell();
        icon.createIcons(data.boat.berthID);

        // add buttons for "sendt" and "betalt"
        let sendBtn = new BtnCreator(row, data, "Sendt");
        sendBtn.createBtn();
        let paidBtn = new BtnCreator(row, data, "Betalt");
        paidBtn.createBtn();
    }
}

class FeeEvent extends EventManager {
    constructor(boats, members) {
        super(boats, members);
    }
    filterBoats() {
        return super.filterBoats();
    }
    createEvent() {
        let feeSentBtnId, feeSentBtn, feePaidBtnId, feePaidBtn;

        this.filterBoats();

        this.filteredBoats.forEach(boat => {
            console.log(boat.boat.feeSent);
            console.log(boat.boat.feePaid);
            feeSentBtnId = "feeSentBtn" + boat.boat.boatID;
            feeSentBtn = document.getElementById(feeSentBtnId);
            console.log(feeSentBtn);
            feePaidBtnId = "feePaidBtn" + boat.boat.boatID;
            feePaidBtn = document.getElementById(feePaidBtnId);
            console.log(feePaidBtn);

            if (feeSentBtn) {
                // Make sure the buttons have the correct styling corresponding to data
                boat.boat.feeSent === 0 ? feeSentBtn.classList.remove("buttonAssigned") : feeSentBtn.classList.add("buttonAssigned");
                feeSentBtn.addEventListener("click", () => {
                    if (boat.boat.feeSent === 0){
                        boat.boat.feeSent = 1;
                        feeSentBtn.classList.add('buttonAssigned');
                        console.log("Fee sent for boat ID:", boat.boat.boatID);
                    } else if (boat.boat.feeSent === 1){
                        boat.boat.feeSent = 0;
                        feeSentBtn.classList.remove("buttonAssigned");
                        console.log("Corrected to fee not sent for boat ID:", boat.boat.boatID);
                    }
                    updateBoatFeeStatus(boat.boat.boatID, "feeSent", boat.boat.feeSent);
                });
            }
            if (feePaidBtn) {
                // Make sure the buttons have the correct styling corresponding to data
                boat.boat.feePaid === 0 ? feePaidBtn.classList.remove("buttonAssigned") : feePaidBtn.classList.add("buttonAssigned");

                // event listener for updating data and changing style of buttons
                feePaidBtn.addEventListener("click", () => {
                    if (boat.boat.feePaid === 0){
                        boat.boat.feePaid = 1;
                        feePaidBtn.classList.add('buttonAssigned');
                        console.log("Fee paid for boat ID:", boat.boat.boatID);
                    } else if (boat.boat.feePaid === 1){
                        boat.boat.feePaid = 0;
                        feePaidBtn.classList.remove("buttonAssigned");
                        console.log("Corrected to fee not paid for boat ID:", boat.boat.boatID);
                    }
                    updateBoatFeeStatus(boat.boat.boatID, "feePaid", boat.boat.feePaid);
                });
            }
        });
    }
}

// function for updating feePaid and feeSent
// IMPORTANT: add such that if a pending boat has both checked, it's moved to approved boats
async function updateBoatFeeStatus(boatID, feeType, status) {
    try {
        let url;
        if(feeType === "feeSent") {
            url = `/boats/update/feeSent/${boatID}`;
        } else if (feeType === "feePaid") {
            url = `/boats/update/feeSent`
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