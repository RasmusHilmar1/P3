// import fetch functions
import {fetchApprovedMembers, fetchBoats, fetchBerth} from "./fetchMethods.js";

const members = await fetchApprovedMembers();
console.log(members);
const boats = await fetchBoats();
console.log(boats);
const berths = await fetchBerth();
console.log(berths);

// calculate areal for berth and boats for the dynamic table and calculating the utilization percentage
function calculateAreal(){
    berths.forEach(berth => {
        berth.areal = (berth.length * berth.width).toFixed(2);
        console.log("berth ID:" + berth.berthID +"berth areal:" + berth.areal); // console logging each berth and corresponding areal
    });
    boats.forEach(boat => {
        boat.areal = (boat.length * boat.width).toFixed(2);
        console.log("boats berth ID:" + boat.berthID + "boat areal:" + boat.areal); // console logging each boat and corresponding areal
    })
}

calculateAreal();

// calculating the utilization of occupied berth in percentage - should be connected to back-end
//IMPORTANT: cannot find function in back-end that calculates utilization in percentage
function calculateUtilization(){
    calculateAreal();
    berths.forEach(berth => {
        let boat = boats.find(boat => boat.berthID === berth.berthID); // find a boat with matching berthID
        if (boat){ // if matching boat is found
            berth.utilizationPercentage = ((boat.areal / berth.areal) * 100).toFixed(2) + "%"; //toFixed rounds the number to percentage with two decimals
        }
    });
}

calculateUtilization();

function addCells(tr, data, editableIndexes = []){
    let td;
    // insert a new cell for each of the item in the data
    data.forEach((item, index) => {
        td = tr.insertCell();
        tr.className = "berthTableRow";

        if (editableIndexes.includes(index)) {
            const input = document.createElement("input");
            td.appendChild(input);
            input.type = "text";
            input.value = item;
            td.className = "editableCells";// divided them into two classes for styling
            input.className = "editableInput";
        } else {
            td.innerHTML = item;
            td.className = "uneditableCells";
        }

        if (index === 2 || index === 3) { // if the edited cells are length or width column
            td.addEventListener('input', () => {
                // update the areal after length or width is edited
                const length = parseFloat(tr.cells[2].textContent);
                const width = parseFloat(tr.cells[3].textContent);
                const newAreal = (length * width).toFixed(2); // recalculate areal
                tr.cells[4].textContent = newAreal + "m"; // update cell
            });
        }
        console.log(item);
    });
}

function getBerthList() {
    const table = document.getElementById("berthListBody"); // get the HTML element for the dynamic table

    // For each berth, find corresponding boat and member
    berths.forEach(berth => {
        berth.correspondingBoat = boats.find(boat => boat.berthID === berth.berthID);
        console.log(berth.correspondingBoat);

        if (berth.correspondingBoat) {
            berth.correspondingMember = members.find(member =>
                member.member.memberID === berth.correspondingBoat.memberID); //if there is found a boat, find the corresponding member

            if (berth.correspondingMember) {
                console.log(berth.correspondingMember.member.memberID);
            }
        }
    });

    //For each berth, create a row and add cells with the data
    berths.forEach(berth => {
        // do not include the default berth
        if (berth.berthID !== 9999) {
            var row = table.insertRow();
            row.className = "berthTableRow";
            const berthData = [berth.berthID, berth.name, berth.length + "m", berth.width + "m", berth.areal + "m", berth.depth + "m", berth.utilizationPercentage];

            // set name, length and width as editable
            const editableColumns = [1, 2, 3];
            addCells(row, berthData, editableColumns);
            berth.correspondingBerthCells = berthData;

            // find boat assigned to berth and corresponding member
            if (berth.correspondingMember && berth.correspondingBoat) {
                if (berth.correspondingBoat.memberID === berth.correspondingMember.member.memberID && berth.correspondingBoat.berthID === berth.berthID) {

                    const memberAndBoatData = [
                        berth.correspondingMember.member.name,
                        berth.correspondingBoat.memberID,
                        berth.correspondingBoat.name,
                        berth.correspondingBoat.length,
                        berth.correspondingBoat.width,
                        berth.correspondingBoat.areal,
                        berth.correspondingMember.member.phonenumber];

                    addCells(row, memberAndBoatData);
                    berth.correspondingMemberAndBoatCells = memberAndBoatData;
                }
            }
            // else add empty cells
            else {
                addCells(row, ["", "", "", "", "", "", ""]);
            }

            // add a cell  with a save button for each row
            const saveCell = row.insertCell(); // Insert a final cell for the Save button
            const saveButton = document.createElement("button");
            saveButton.textContent = "Gem Ændringer";
            saveCell.className = "saveBtnCell";
            saveButton.className = "saveBtn";
            saveCell.appendChild(saveButton); // Append the Save button to the last cell

            // Add click event to the save button
            saveButton.addEventListener("click", () => saveBerthChanges(row, berth));
        }
    });
}
getBerthList();

// function for saving the changes
async function saveBerthChanges(row, berth) {

    // collect updated values from the row's cells
    const cells = row.cells;

    //calculate new areal
    const length = parseFloat(cells[2].textContent); // length
    const width = parseFloat(cells[3].textContent); // width

    const updatedBerth = {
        berthID: berth.berthID,
        name: cells[1].textContent, // name
        length: parseFloat(cells[2].textContent), // length
        width: parseFloat(cells[3].textContent), // width
    };

    // send PUT request to update the berth data
    try {
        const response = await fetch(`/berths/update/information/${berth.berthID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedBerth),
        });

        if (!response.ok) {
            throw new Error(`Error updating berth: ${response.status}`);
        }

        const updatedBerthData = await response.json();
        console.log("Berth updated successfully:", updatedBerthData);

        // update the local berths array to reflect the changes
        const index = berths.findIndex(b => b.berthID === updatedBerthData.berthID);
        if (index !== -1) {
            berths[index] = updatedBerthData; // Update the corresponding berth in the array
        }
        // recalculate areal after save
        const newAreal = (length * width).toFixed(2);

        // recalculate utilization percentage
        const boat = boats.find(boat => boat.berthID === updatedBerthData.berthID);
        let newUtilizationPercentage = ""; // Default to 0% if no boat is assigned

        if (boat) {
            const boatAreal = (boat.length * boat.width).toFixed(2); // calculate boat's areal
            newUtilizationPercentage = ((boatAreal / newAreal) * 100).toFixed(2) + "%"; // calculate utilization percentage
        }

        // update the row
        row.cells[1].textContent = updatedBerthData.name;
        row.cells[2].textContent = updatedBerthData.length + "m";
        row.cells[3].textContent = updatedBerthData.width + "m";
        row.cells[4].textContent = newAreal + "m";
        row.cells[6].textContent = newUtilizationPercentage;

        alert("Ændringer på bådplads gemt!");

    } catch (error) {
        console.error("Kunne ikke gemme ændringer:", error);
        alert("Ændringer kunne ikke gemmes!");
    }
}



// IMPLEMENT THIS SEARCH FUNCTION IN SIDEBAR:
// IMPORTANT: Maybe add such that users can only search for names and IDs, not areal, length and width
function searchBarBerthList() {
    console.log("Search function triggered"); //console logging to make sure that the function runs
    let input, filter, table, tableRows;
    input = document.getElementById("berthListSearchBar"); // input field
    filter = input.value.toLowerCase(); // input entered by user converted to lowercase
    console.log(filter);
    table = document.getElementById("berthListBody"); // get the dynamic created table
    console.log(table);
    tableRows = table.getElementsByClassName("berthTableRow"); // get all rows

    //Iterate through all rows
    for (let i = 0; i < tableRows.length; i++){
        // initialize result as false
        let result = false;
        const rowCells = tableRows[i].cells;

        //Iterate through all cells in the respective row
        for (let j = 0; j < rowCells.length; j++) {
            const cell = rowCells[j];
            let cellText = cell.textContent.toLowerCase(); // check content of the cell

            // check if there is an input field inside the cell
            const inputField = cell.querySelector('input');
            if (inputField){
                cellText = inputField.value.toLowerCase();
            }
            if (cellText.includes(filter)){
                result = true;
                break;
            }
        }

        // make sure the rows with no match are hidden while the one with a match are displayed
        if (result){
            tableRows[i].style.display = "table-row";
        } else {
            tableRows[i].style.display = "none";
        }
    }
}

//event handler for the search function
function searchBarEvent(){
    const berthSearchBar = document.getElementById("berthListSearchBar");
    berthSearchBar.addEventListener("keyup", searchBarBerthList);
}

searchBarEvent();