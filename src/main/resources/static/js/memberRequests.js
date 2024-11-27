// fetch methods
import {fetchPendingBoats, fetchPendingMembers, parseData} from "./fetchMethods.js";
// arrays
import {pendingBoats, pendingMembers} from "./fetchMethods.js";
// classes
import {Member, PendingBoat, Table, BtnCreator} from "./objects.js";

class MemberRequestTable extends Table {
    constructor(elementId, title, headers, firstArray, secondArray, colspan) {
        super(elementId, title, headers, firstArray, secondArray, colspan);// Call parent constructor
    }
    createTable() {
        super.createTable();
    }
    addDataRows(array, tableBody) {
        // function is overridden because of the collapsible divs
        array.forEach(item => {
            let row = tableBody.insertRow();
            row.className = "shownRows";
            console.log(item);

            // create collapsible row and capture reference to it
            let divElement = new createCollapsibleDiv(item, tableBody);
            const infoRow = divElement.createContainer(); // capture the row itself

            // pass infoRow directly to addCells
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

        // toggle visibility on name button click
        memberBtn.addEventListener("click", () => {
            infoRow.classList.toggle("visible"); // toggle the visibility of the row

            // position the collapsible content directly under the clicked button
            const rowRect = row.getBoundingClientRect();
            const memberCellRect = memberCell.getBoundingClientRect();

            // set the position of the collapsible row dynamically
            infoRow.style.top = `${rowRect.bottom}px`;
            infoRow.style.width = `${memberCellRect.width}px`;

            // toggle styling of button when selected
            if (infoRow.classList.contains("visible")) {
                memberBtn.classList.add("selectedMemberBtn");
            } else {
                memberBtn.classList.remove("selectedMemberBtn");
            }
        });
    }
    // adding specific cells with buttons for accepting or denying requests
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
                let infoCellText = document.createElement("a");
                switch (nestedKey){
                    case 'address':
                        infoCellText.innerHTML = "Addresse: " + this.data[key][nestedKey] + "<br/>";
                        infoContainer.appendChild(infoCellText);
                        console.log(infoCellText);
                        break;
                    case 'email':
                        infoCellText.innerHTML = "Email: " + this.data[key][nestedKey] + "<br/>";
                        infoContainer.appendChild(infoCellText);
                        console.log(infoCellText);
                        break;
                    case 'dateofbirth':
                        // take the date from database in the form yyyy-mm-dd
                        const dateFromDatabase = this.data[key][nestedKey];
                        if (dateFromDatabase){
                            const [year, month, date] = dateFromDatabase.split('-'); // split the date
                            const newDate = `${date}/${month}/${year}`; //reformat the date
                            infoCellText.innerHTML = "Fødselsdato: " + newDate + "<br/>";
                            infoContainer.appendChild(infoCellText);
                            console.log(infoCellText);
                        }
                        break;
                    case 'phonenumber':
                        infoCellText.innerHTML = "Telefonnummer: " + this.data[key][nestedKey] + "<br/>";
                        infoContainer.appendChild(infoCellText);
                        console.log(infoCellText);
                        break;
                    default:
                        console.log("Not included key: " + nestedKey);
                }
            }
        }
    }
    createContainer(){
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
    constructor (members, boats){
        this.members = members;
        this.boats = boats;
    }
    createEvent(){
        let acceptBtn, denyBtn, acceptBtnId, denyBtnId;
        // find the accept and deny buttons for each pending member
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
                    const correspondingBoat = this.boats.find(boat => boat.boat.memberID === member.member.memberID); //find corresponding boat
                    if(correspondingBoat){
                        console.log(correspondingBoat);
                        console.log(correspondingBoat.id);
                    }
                    if (confirm("Er du sikker på at du vil afvise medlemmet?")){
                        if (correspondingBoat){
                            console.log("memberID: ", member.member.memberID, "pending boat ID: ", correspondingBoat.id);
                            denyMember(member.id, correspondingBoat.id);
                            console.log("Member denied with member ID:", member.member.memberID, "and deleted successfully");
                            console.log("Corresponding boat with boatID: ", correspondingBoat.boat.boatID, "deleted successfully");
                        } else if (!correspondingBoat){
                            console.log("boat not found properly.");
                            denyMember(member.id, "");
                            console.log("Member denied with member ID:", member.member.memberID, "and deleted successfully");
                        } else {
                            console.log("something went wrong.")
                        }

                    }
                });
            }
        });
    }
}

// move the pending member to approved
async function approveMember(memberId){
    try {
        let url = `/members/update/approve/member/${memberId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(memberId),
        });
        if (!response.ok) {
            console.error("Failed to approve member with ID: ", memberId);
        } else {
            console.log("Member approved successfully.");
            /*window.location.reload();*/
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// delete the member and corresponding boat if existing
async function denyMember(memberId, boatId){
    try {
        // if there is a corresponding boat delete that first since you cannot delete parent row
        if (boatId !== ""){
            let urlBoat = `/boats/update/deny/boat/${boatId}`
            const response = await fetch(urlBoat, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                console.error("Failed to deny member's boat and delete them.");
            } else {
                console.log("Member's boat denied and deleted successfully.");
                /*window.location.reload();*/
            }
        }
        // afterwards delete member from both repositories
        let urlMember = `/members/update/deny/member/${memberId}`;
        const response = await fetch(urlMember, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            console.error("Failed to deny member and delete them.");
        } else {
            console.log("Member denied successfully.");
            /*window.location.reload();*/
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function createTable (pendingMembersArray, boatsArray, Table, elementId, title, headers,  firstArray, secondArray, colspan){
        try {
            pendingMembersArray = await parseData(fetchPendingMembers(), Member, pendingMembersArray);
            boatsArray = await parseData(fetchPendingBoats(), PendingBoat, boatsArray);
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
        pendingBoats,
        MemberRequestTable,
        "memberRequestsContainer",
        "Medlemsskabsanmodninger",
        [],
        pendingMembers,
        pendingBoats,
        7);
    let memberEvent = new MemberEvent(pendingMembers, pendingBoats);
    memberEvent.createEvent();
}