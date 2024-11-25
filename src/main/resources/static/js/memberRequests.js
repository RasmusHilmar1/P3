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
        super.addDataRows(array, tableBody);
    }
    addCells(row, data) {
        let idCell = row.insertCell();
        idCell.innerHTML = data.member.memberID; // access ID property
        let nameCell = row.insertCell();
        nameCell.innerHTML = data.member.name; // access name property
        console.log(data);
    }
    addSpecificCells(row, data) {
        let acceptBtn = new BtnCreator(row, data, "Accepter");
        acceptBtn.createBtn();
        let denyBtn = new BtnCreator(row, data, "Afvis");
        denyBtn.createBtn();
    }
}

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