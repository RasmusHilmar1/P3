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
            let divElement = new createCollapsibleDiv(item, tableBody);
            divElement.id = item.member.memberID + "_infoDiv";
            divElement.createContainer();
            console.log(divElement);
            console.log(divElement.id);
            this.addCells(row, item, tableBody);
            this.addSpecificCells(row, item);
        });
    }
    addCells(row, data, tableBody) {
        // create cells for respectively the member's name and their ID
        let idCell = row.insertCell();
        let nameCell = row.insertCell();

        // create buttons for both member ID and memberName
        let idBtn = document.createElement("button");
        idBtn.textContent = data.member.memberID;
        idBtn.id = "idBtn_member" + data.member.memberID;
        idCell.appendChild(idBtn);
        /* let collapsibleEventId = new CollapsibleEvent(data, idBtn, tableBody);
        collapsibleEventId.createCollapsibleEvent(); */

        let nameBtn = document.createElement("button");
        nameBtn.textContent = data.member.name;
        nameBtn.id = "nameBtn_member" + data.member.memberID;
        nameCell.appendChild(nameBtn);
        /* let collapsibleEventName = new CollapsibleEvent(data, nameBtn, tableBody);
        collapsibleEventName.createCollapsibleEvent(); */
    }
    addSpecificCells(row, data) {
        let acceptBtn = new BtnCreator(row, data, "Accepter");
        acceptBtn.createBtn();
        let denyBtn = new BtnCreator(row, data, "Afvis");
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
                if (nestedKey === "address" || nestedKey === "email" || nestedKey === "dateofbirth" || nestedKey === "phonenumber"){
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
            // create row and cell for div element
            let infoRow = this.tableBody.insertRow();
            infoRow.className = "infoRowMemberReq";

            //IMPORTANT; Find ud af hvordan man ændrer størrelsen her på denne row
            infoRow.colSpan = 4;

            let infoContainer = document.createElement("div");
            infoRow.appendChild(infoContainer);
            console.log(infoContainer);

            this.createInfoText(infoContainer);
    }
}

/* class CollapsibleEvent {
    constructor(data, btn, table) {
        this.data = data;
        this.btn = btn;
        this.table = table;
    }
    createCollapsibleEvent(){
        this.btn.addEventListener("click", () => {
            let infoCells = Array.from(this.table.querySelectorAll(".infoRowMemberReq"));
            console.log(infoCells);
            infoCells.forEach(cell => {
                if (cell.style.display === "block") {
                    this.btn.classList.remove('selectedMemberBtn');
                    cell.style.display = "none";
                } else if (cell.style.display === "none") {
                    this.btn.classList.add('selectedMemberBtn');
                    cell.style.display = "block";
                }
            });
        });
    }
} */





class MemberEvent {
    constructor (members){
        this.members = members;
    }
    createEvent(){
        let acceptBtn, denyBtn, acceptBtnId, denyBtnId;
        this.members.forEach(member => {
            console.log(member.member.memberID);
            acceptBtnId = "acceptBtn" + member.member.memberID;
            acceptBtn = document.getElementById(acceptBtnId);
            console.log(acceptBtn);
            denyBtnId = "denyBtn" + member.member.memberID;
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
        ["Medlems nr.", "Navn", "Accepter Medlem", "Afvis Medlem"],
        pendingMembers,
        boats,
        4);
    let memberEvent = new MemberEvent(pendingMembers);
    memberEvent.createEvent();
}