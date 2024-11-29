// import fetch functions
import {fetchApprovedMembers, fetchBoats, fetchBerth} from "./fetchMethods.js";

const members = await fetchApprovedMembers();
console.log(members);
const boats = await fetchBoats();
console.log(boats);
const berths = await fetchBerth();
console.log(berths);

// FUNCTIONS FOR CALCULATING AREAL AND UTILIZATION ----->

// calculate areal for berth and boats for the dynamic table and calculating the utilization percentage. This should be connected to back-end.
function calculateAreal(){
    berths.forEach(berth => {
        berth.areal = (berth.length * berth.width).toFixed(2);
        console.log("berth ID:" + berth.berthID +"berth areal:" + berth.areal); // console logging each berth and corresponding areal
    });
    boats.forEach(boat => {
        boat.areal = (boat.length * boat.width).toFixed(2);
        console.log("boats berth ID:" + boat.berthID + "boat areal:" + boat.areal); // console logging each boat and corresponding areal
    });
}

calculateAreal();

// calculating the utilization of occupied berth in percentage - should be connected to back-end
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

// FUNCTION FOR ADDING CELLS TO TABLE ----->

function addCells(tr, data, editableIndexes = [], lengthAndWidthIndexes = []){
    let td;
    // insert a new cell for each of the item in the data
    data.forEach((item, index) => {
        td = tr.insertCell();
        tr.className = "berthTableRow";
        console.log(item);

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

        if (lengthAndWidthIndexes.includes(index)) { // if the edited cells are length or width column
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

function addSaveBtn(row, data) {
    let saveCell, saveBtn;
    // add a cell  with a save button for each row
    saveCell = row.insertCell(); // Insert a final cell for the Save button
    saveBtn = document.createElement("button");
    saveBtn.textContent = "Gem Ændringer";
    saveCell.className = "saveBtnCell";
    saveBtn.className = "saveBtn";
    saveCell.appendChild(saveButton); // Append the Save button to the last cell
    // Add click event to the save button
    saveBtn.addEventListener("click", () => saveBerthChanges(row, data));
}

// FUNCTIONS FOR CREATING TABLE ---->

function findBerthData(data){
    return [data.berthID, data.name, data.length + "m", data.width + "m", data.areal + "m", data.depth + "m", data.utilizationPercentage]; // initializing berth data for cells with berth data
}

function findCorrespondingMemberAndBoat(data){

    console.log(data);
    data.correspondingBoat = boats.find(boat => boat.berthID === data.berthID); // find corresponding boat
    console.log(data.correspondingBoat);

    // find corresponding member, if there is a corresponding boat
    if (data.correspondingBoat) {
        data.correspondingMember = members.find(member =>
            member.member.memberID === data.correspondingBoat.memberID);

        if (data.correspondingMember) {
            console.log("Found corresponding member with memberID: ", data.correspondingMember.member.memberID);
        }
    }

    if (data.correspondingMember && data.correspondingBoat) {
        if (data.correspondingBoat.memberID === data.correspondingMember.member.memberID && data.correspondingBoat.berthID === data.berthID) {

            return [ // initialize the corresponding boat and member ID
                data.correspondingMember.member.name,
                data.correspondingBoat.memberID,
                data.correspondingBoat.name,
                data.correspondingBoat.length,
                data.correspondingBoat.width,
                data.correspondingBoat.areal,
                data.correspondingMember.member.phonenumber];
        }
    }
    console.log("No corresponding boat or member found");
}

function getBerthListSortedBerths(data, table){

    let berthData, memberAndBoatData, row, editableColumns, lengthAndWidthIndexes;

    //For each berth, create a row and add cells with the data
        data.forEach(berth => {
            if (berth.berthID !== 9999) { // do not include the default berth

                // declare data for each berth
                berthData = findBerthData(berth);
                memberAndBoatData = findCorrespondingMemberAndBoat(berth);

                // initialize table rows for each berth
                row = table.insertRow();
                row.className = "berthTableRow";

                editableColumns = [1, 2, 3]; // set the columns with name, length, and width as editable

                lengthAndWidthIndexes = [2, 3]; // set the columns with length and width

                addCells(row, berthData, editableColumns, lengthAndWidthIndexes); // call addCells with berth data first

                if (memberAndBoatData) {
                    // call addCells with member data after with empty arrays in order to add member data cells
                    addCells(row, memberAndBoatData, [], []);
                } else {
                    addCells(row, ["", "", "", "", "", "", ""], [], []);
                }
                addSaveBtn(row, berth); // add save button in each row
            }
        });
}

function getBerthListSortedMembers(data, table){
    let row, berthData, memberAndBoatData, editableColumns, lengthAndWidthIndexes;

    // filter rows such that only the ones with a boat and member assigned is included
    let filteredRows = data.filter(berth => {
        findCorrespondingMemberAndBoat(berth); // Set correspondingMember here
        return berth.correspondingMember; // Filter only berths with a corresponding member
    });

    filteredRows.forEach(berth => {

        //declare data for each berth
        berthData = findBerthData(berth);
        memberAndBoatData = findCorrespondingMemberAndBoat(berth);

        // initialize table rows for each berth
        row = table.insertRow();
        row.className = "berthTableRow";

        editableColumns = []; // set the columns with name, length and width as editable

        lengthAndWidthIndexes = []; // set the columns with length and width

        addCells(row, memberAndBoatData, [], []); // add member data first

        addCells(row, berthData, editableColumns, lengthAndWidthIndexes); // add berth data after

        addSaveBtn(row, berth); // add save button in each row
    });
}

function getBerthListRefactored(data, sortedBy){
    // Declare table
    const table = document.getElementById("berthListBody"); // get the HTML element for the dynamic table

    if (sortedBy === "berths"){
        getBerthListSortedBerths(data, table);
    } else if (sortedBy === "members"){
        getBerthListSortedMembers(data, table);
    } else {
        console.log("Not possible to sort by members.")
    }
}

getBerthListRefactored(berths, "members");

// FUNCTIONS FOR UPDATING THE CHANGES IN THE EDITABLE CELLS ---->

// function for saving the changes
async function saveBerthChanges(row, berth) {

    // collect updated values from the row's cells
    const cells = row.cells;

    //calculate new areal
/*    const length = parseFloat(cells[2].textContent); // length
    const width = parseFloat(cells[3].textContent); // width */

    const lengthInput = cells[2].querySelector("input");
    const widthInput = cells[3].querySelector("input");

    const length = lengthInput ? parseFloat(lengthInput.value.trim().replace("m", "")) : NaN;
    const width = widthInput ? parseFloat(widthInput.value.trim().replace("m", "")) : NaN;

    const nameInput = cells[1].querySelector("input");
    const name = nameInput ? nameInput.value.trim() : "";
    

    const updatedBerth = {
        berthID: berth.berthID,
        name: name, // name
        length: length, // length
        width: width, // width
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

// FUNCTION FOR SEARCH FUNCTIONALITY ----->

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

// FUNCTIONS FOR EXPORTING TABLE TO EXCEL ---->

//eventhandler for exporting list as Excel fil
function exportTableToExcel(){
    const table = document.getElementById("berthList");
    try {
        window.location.href = '/vesselBerthList/PladsExcel'; // redirect to endpoint for exporting list
    } catch (error) {
        console.log(error);
        console.log("List not exported.");
    }
}
document.getElementById("exportBtn").addEventListener("click", exportTableToExcel);

// function fra printService: generateBerthListExcel

// function fra memberListController:



// OLD FUNCTIONS ---->

/*function getBerthList(data) {
    const table = document.getElementById("berthListBody"); // get the HTML element for the dynamic table

    // For each berth, find corresponding boat and member
    data.forEach(berth => {
        berth.correspondingBoat = boats.find(boat => boat.berthID === berth.berthID);
        console.log(berth.correspondingBoat);

        if (berth.correspondingBoat) {
            berth.correspondingMember = members.find(member =>
                member.member.memberID === berth.correspondingBoat.memberID); //if there is found a boat, find the corresponding member

            if (berth.correspondingMember) {
                console.log(berth.correspondingMember.member.memberID);
            }
        }
    }); */

//For each berth, create a row and add cells with the data
/* data.forEach(berth => {
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
 return table;
}
getBerthList(berths); */

// FUNCTIONS FOR SORTING THE TABLE ---->

/* function sortBerthListMember(data){
    console.log("Sorting function after members called!");

    let filteredRows, sorted;

    filteredRows = data.filter(row => row.correspondingMember); // filter data to include only the rows with a corresponding member and boat
    console.log(filteredRows);

    sorted = filteredRows.sort((a,b) => a.correspondingBoat.memberID - b.correspondingBoat.memberID); // sort the filtered rows
    console.log(sorted);

    const table = document.getElementById("berthListBody");
    table.innerHTML = ""; //clear out the table

    getBerthList(sorted); //create the new table with the sorted rows
}

function sortBerthListBerth(data){
    console.log("Sorting function after berths called!");

    const sorted = data.sort((a,b) => a.name.localeCompare(b.name));
    console.log(sorted);

    const table = document.getElementById("berthListBody");
    table.innerHTML = ""; //clear out the table in order to rerender

    /*getBerthList(sorted); //create new table with the sorted rows
}

//event handler for the sorting buttons
function sortingBtnHandler(){
    let berthSortBtn = document.getElementById("berthSort");
    let memberSortBtn = document.getElementById("memberSort");

    berthSortBtn.addEventListener("click", () => sortBerthListBerth(berths));
    memberSortBtn.addEventListener("click", () => sortBerthListMember(berths));
}

sortingBtnHandler(); */