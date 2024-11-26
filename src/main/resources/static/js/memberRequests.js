import {fetchBoats, fetchPendingMembers, parseData} from "./fetchMethods.js";
import {Member, Boat, Table} from "./objects.js";
import {BtnCreator} from "./boatRequests.js";

class MemberRequestTable extends Table {
    constructor(elementId, title, headers, firstArray, secondArray, colspan) {
        super(elementId, title, headers, firstArray, secondArray, colspan);// Call parent constructor
    }
    createTable() {
        super.createTable();
    }
    addDataRows(array, tableBody) {
        array.forEach(item => {
            let row = tableBody.insertRow();
            row.className = "shownRows";
            console.log(item);

            // Create collapsible row and capture reference to it
            let divElement = new createCollapsibleDiv(item, tableBody);
            const infoRow = divElement.createContainer(); // Capture the row itself

            // Pass infoRow directly to addCells
            this.addCells(row, item, infoRow, tableBody);
            this.addSpecificCells(row, item);
        });
    }
    addCells(row, data, infoRow, tableBody) {
        let memberCell = row.insertCell();
        memberCell.className = "memberCells";
        memberCell.colSpan = 5;
        let memberBtn = document.createElement("button");
        memberBtn.textContent = data.member.name;
        memberBtn.id = "memberBtn_member" + data.member.memberID;
        memberBtn.className = "memberInfoBtn";
        memberCell.appendChild(memberBtn);

        /* // Create buttons for both member ID and member name
        let idBtn = document.createElement("button");
        idBtn.textContent = data.member.memberID;
        idBtn.id = "idBtn_member" + data.member.memberID;
        idBtn.className = "memberInfoBtn";
        idCell.appendChild(idBtn);

        let nameBtn = document.createElement("button");
        nameBtn.textContent = data.member.name;
        nameBtn.id = "nameBtn_member" + data.member.memberID;
        nameBtn.className = "memberInfoBtn";
        nameCell.appendChild(nameBtn); */

        // Toggle visibility on name button click
        memberBtn.addEventListener("click", () => {
            infoRow.classList.toggle("visible"); // Toggle the visibility of the row

            // Position the collapsible content directly under the clicked button
            const rowRect = row.getBoundingClientRect();
            const memberCellRect = memberCell.getBoundingClientRect();

            // Set the position of the collapsible row dynamically
            infoRow.style.top = `${rowRect.bottom}px`;
            infoRow.style.width = `${memberCellRect.width}px`;

            // Optional: Change button appearance when the div is visible
            if (infoRow.classList.contains("visible")) {
                memberBtn.classList.add("selectedMemberBtn");
            } else {
                memberBtn.classList.remove("selectedMemberBtn");
            }
        });
    }
    addSpecificCells(row, data) {
        let acceptBtn = new BtnCreator(row, data, "<img src=http://localhost:8080/Images/Icons/AcceptBtnIcon.png alt='acceptIcon'>");
        acceptBtn.createBtn();
        let denyBtn = new BtnCreator(row, data, "<img src=http://localhost:8080/Images/Icons/DenyBtnIcon.png alt='denyIcon'>");
        denyBtn.createBtn();
    }
}


class createCollapsibleDiv {
    constructor (data, tableBody) {
        this.data = data;
        this.tableBody = tableBody;
    }
    createInfoText(infoContainer) {
        for (const key in this.data){
            for (const nestedKey in this.data[key]){
                if (nestedKey === "memberID" || nestedKey === "address" || nestedKey === "email" || nestedKey === "dateofbirth" || nestedKey === "phonenumber"){
                    let infoCellText = document.createElement("a");
                    infoCellText.innerHTML = nestedKey + " : " + this.data[key][nestedKey] + "<br/>";
                    infoContainer.appendChild(infoCellText);
                } else {
                    console.log("Not included key: " + nestedKey);
                }
            }
        }
    }
    createContainer() {
        // Create row and cell for div element
        let infoRow = this.tableBody.insertRow();
        infoRow.className = "infoRowMemberReq";

        let infoCell = infoRow.insertCell();
        infoCell.className = "infoCellMemberReq";

        let infoContainer = document.createElement("div");
        infoContainer.id = this.data.member.memberID + "_infoDiv";  // Set the ID directly on the div
        infoContainer.className = "collapsibleContent"; // CSS class to control visibility

        this.createInfoText(infoContainer);
        infoCell.appendChild(infoContainer);

        return infoRow; // Return the row itself so we can toggle it directly
    }
}

class MemberEvent {
    constructor (members){
        this.members = members;
    }
    createEvent(){
        let acceptBtn, denyBtn, acceptBtnId, denyBtnId;
        // IMPORTANT ---> Lige nu har alle 3 acceptBtns samme id. dette skal rettes. 
        this.members.forEach(member => {
            console.log(member.member.memberID);
            acceptBtnId = "<img src=http://localhost:8080/Images/Icons/AcceptBtnIcon.png alt='acceptIcon'>"
            acceptBtn = document.getElementById(acceptBtnId);
            console.log(acceptBtn);
            denyBtnId = "<img src=http://localhost:8080/Images/Icons/DenyBtnIcon.png alt='denyIcon'>";
            denyBtn = document.getElementById(denyBtnId);
            console.log(denyBtn);

            if (acceptBtn){
                acceptBtn.addEventListener("click",() => {
                    if (confirm("Er du sikker på at du vil acceptere medlemmet?")){
                        approveMember(member.id);
                        console.log("Member accepted with member ID:", member.member.memberID);
                    }
                });
            }
            if (denyBtn){
                denyBtn.addEventListener("click", () => {
                    if (confirm("Er du sikker på at du vil afvise medlemmet?")){
                        denyMember(member.id);
                        console.log("Member denied with member ID:", member.member.memberID, "and deleted successfully");
                    }
                })
            }
        });
    }
}

// Move the pending boat to approved
async function approveMember(memberId){
    try {
        let url = `/members/update/approve/member/${memberId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            console.error("Failed to approve member.");
        } else {
            console.log("Member approved successfully.");
            window.location.reload();
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function denyMember(memberId){
    try {
        let url = `/members/update/deny/member/${memberId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            console.error("Failed to deny member and delete them.");
        } else {
            console.log("Member denied successfully.");
            window.location.reload();
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

let pendingMembers = [], boats = [];

async function createTable (pendingMembersArray, boatsArray, Table, elementId, title, headers,  firstArray, secondArray, colspan){
        try {
            pendingMembersArray = await parseData(fetchPendingMembers(), Member, pendingMembersArray);
            boatsArray = await parseData(fetchBoats(), Boat, boatsArray);
            console.log(pendingMembersArray);
            console.log(boatsArray);

            console.log("data loaded!");

            new Table(elementId, title, headers, firstArray, secondArray, colspan);
        } catch (error) {
            console.log("data not found, and table not created. ")
        }
}

window.onload = async () => {
    await createTable(
        pendingMembers,
        boats,
        MemberRequestTable,
        "memberRequestsContainer",
        "Medlemsskabsanmodninger",
        [],
        pendingMembers,
        boats,
        7);
    let memberEvent = new MemberEvent(pendingMembers);
    memberEvent.createEvent();
}