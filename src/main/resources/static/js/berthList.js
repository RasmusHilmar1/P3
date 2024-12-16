// import fetch functions
import {fetchApprovedMembers, fetchBoats, fetchBerth} from "./fetchMethods.js";

const members = await fetchApprovedMembers();
console.log(members);
const boats = await fetchBoats();
console.log(boats);
const berths = await fetchBerth();
console.log(berths);

function getFullBerthName(shorthand) {
    const prefixMapping = {
        FB: "Fiskebro",
        NB: "Nørrebro",
        NVB: "Ny Vestre Bro",
        NM: "Nordmolen",
        VN: "Vestre Nordmole"
    };

    const prefix = shorthand.slice(0, 2);
    const number = shorthand.slice(2).padStart(2, '0');
    return prefixMapping[prefix] ? `${prefixMapping[prefix]} ${number}` : shorthand;
}


// FUNCTIONS FOR EXPORTING TABLE TO EXCEL ---->

function exportBerthTableBerthsToExcel(){
    try {
        window.location.href = '/vesselBerthListByBerths/PladsExcel'; // redirect to endpoint for exporting list
    } catch (error) {
        console.log(error);
        console.log("List not exported.");
    }
}

function exportBerthTableMembersToExcel(){
    try {
        window.location.href = '/vesselBerthListByMembers/PladsExcel';
    } catch (error) {
        console.log(error);
        console.log("List not exported.");
    }
}

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

// calculate new areal for boat in order to calculate proper utilization percentage
function calculateArealBoatUtil(){
    boats.forEach(boat => {
        boat.arealUtil = ((boat.length + 1) * (boat.width + 0.3).toFixed(2));
    })
}

calculateArealBoatUtil();

// calculating the utilization of occupied berth in percentage - should be connected to back-end
function calculateUtilization(){
    berths.forEach(berth => {
        let boat = boats.find(boat => boat.berthID === berth.berthID); // find a boat with matching berthID
        if (boat){ // if matching boat is found
            berth.utilizationPercentage = ((boat.arealUtil / berth.areal) * 100).toFixed(2) + "%"; //toFixed rounds the number to percentage with two decimals
        }
    });
}

calculateUtilization();

// FUNCTIONS FOR ADDING CELLS TO TABLE ----->

function addCells(tr, data, editableIndexes = [], lengthAndWidthIndexes = [], berth) {
    let td;

    const valueAtIndex0 = data[1];
    const valueAtIndex7 = data[7];
    const valueAtIndex6 = data[6];

    console.log("Value at index 1:", valueAtIndex0);
    // insert a new cell for each of the item in the data
    data.forEach((item, index) => {
        //check if the data in the foreach statement is a number
        if (index === 0 && typeof item === 'number') {
            return;
        }
        if (index === 6 && item === undefined) {
            item = "";
        }
        td = tr.insertCell();
        tr.className = "berthTableRow";
        console.log(item);

        // make some of the cells narrow
        if (index === 1 || index === 3 || index === 7 || index === 9 || index === 10) {
            td.classList.add("narrowCell");
        } else {
            td.classList.add("normalCell");
        }

        if (editableIndexes.includes(index)) {
            const input = document.createElement("input");
            td.appendChild(input);
            input.type = "text";
            input.value = item;
            td.className = "editableCells"; // divided them into two classes for styling
            input.className = "editableInput";
        } else {
            td.innerHTML = item;
            td.className = "uneditableCells";
        }

        if (index === 7 && valueAtIndex6 !== "") {
            const noteIconCell = tr.insertCell();
            noteIconCell.classList.add("noteIconCell");

            const noteIcon = document.createElement("img");
            noteIcon.classList.add("noteIcon");
            noteIcon.src = "/Images/Icons/noteIcon.svg";
            noteIcon.alt = "Note Icon";
            noteIconCell.appendChild(noteIcon);

            noteIcon.addEventListener("click", () => showNoteModal(valueAtIndex0, valueAtIndex7));
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
    });
}


function addSaveBtn(row, data) {
    let saveCell, saveBtn;
    // add a cell  with a save button for each row
    saveCell = row.insertCell(); // Insert a final cell for the Save button
    saveBtn = document.createElement("button");
    saveBtn.textContent = "Gem";
    saveCell.className = "saveBtnCell";
    saveBtn.className = "saveBtn";
    saveCell.appendChild(saveBtn); // Append the Save button to the last cell
    // Add click event to the save button
    saveBtn.addEventListener("click", () => saveBerthChanges(row, data));
}

// FUNCTIONS FOR DEFINING DATA FOR TABLE ---->

function findBerthData(data) {
    const fullName = getFullBerthName(data.name); // Convert shorthand to full name
    console.log(fullName);
    return [data.berthID, data.name, fullName, data.length + "m", data.width + "m", data.areal + "m", data.utilizationPercentage];
}


function findCorrespondingMemberAndBoat(data){

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
                data.correspondingMember.member.phonenumber,
                data.correspondingMember.member.note || ""]

        }
    }
    console.log("No corresponding boat or member found");
}

// FUNCTION FOR DEFINING HEADERS ON TABLE ---->

function createTableHeaders(headers, sortedBy){
    let th;

    const headerRow = document.getElementById("berthListHeaders"); // create new headerRow

    headerRow.innerHTML = ""; // clear out the header row each time the table is rendered

    headers.forEach(header => { // for each header create a cell
        th = document.createElement("th");

        if (header === "Plads nr." || header === "Medlems nr." || header === "Længde" || header === "Bredde") {
            th.className = "narrowHeader"; // Apply the narrowHeader class for these columns
        } else {
            th.className = "headerCell";
        }

        th.innerHTML = header;

        headerRow.appendChild(th);
    });

    th = document.createElement("th"); //create a new headercell for the export button
    th.className = "headercells";
    let exportBtn = document.createElement("button"); //create button element
    exportBtn.className = "exportBtn";
    exportBtn.id = "exportBtn" + sortedBy;
    exportBtn.innerHTML = "Exportér liste til Excel";
    th.appendChild(exportBtn);
    headerRow.appendChild(th);
}

// FUNCTIONS FOR SORTING THE TABLES ------>

function getBerthListSortedBerths(data, table){
    let berthData, memberAndBoatData, row, editableColumns, lengthAndWidthIndexes;

    table.innerHTML = ""; //clear out the table in order to rerender

    createTableHeaders( // create correct headers for the list when sorted by berths
        ["Plads nr.",
            "Plads",
            "Længde",
            "Bredde",
            "Areal",
            "Udnyttelse i %",
            "Navn",
            "Medlems nr.",
            "Bådnavn",
            "Længde",
            "Bredde",
            "Areal",
            "Telefon nr.",
        "Note", "Tilføj Note"],
        "Berths");

    //For each berth, create a row and add cells with the data
    data.forEach(berth => {
        if (berth.berthID !== 9999) { // do not include the default berth

            // declare data for each berth
            berthData = findBerthData(berth);
            console.log(berthData);
            memberAndBoatData = findCorrespondingMemberAndBoat(berth);

            // initialize table rows for each berth
            row = table.insertRow();
            row.className = "berthTableRow";

            editableColumns = [1, 3, 4]; // set the columns with name, length, and width as editable

            lengthAndWidthIndexes = [3, 4]; // set the columns with length and width

            addCells(row, berthData, editableColumns, lengthAndWidthIndexes); // call addCells with berth data first

            if (memberAndBoatData) {
                // call addCells with member data after with empty arrays in order to add member data cells
                addCells(row, memberAndBoatData, [], []);
            } else {
                addCells(row, ["", "", "", "", "", "", "", "", ""], [], []);
            }
            addSaveBtn(row, berth); // add save button in each row
        }
    });

    // get the corresponding exportBtn
    let exportBtn = document.getElementById("exportBtnBerths");
    console.log(exportBtn);

    exportBtn.addEventListener("click", exportBerthTableBerthsToExcel);
}

function getBerthListSortedMembers(data, table){
    let row, berthData, memberAndBoatData, editableColumns, lengthAndWidthIndexes;

    table.innerHTML = ""; //clear out the table in order to rerender

    createTableHeaders( // create correct headers for the list when sorted by berths
        ["Navn",
            "Medlems nr.",
            "Bådnavn",
            "Længde",
            "Bredde",
            "Areal",
            "Telefon nr.",
            "Note",
            "Tilføj",
            "Plads nr.",
            "Plads navn",
            "Længde",
            "Bredde",
            "Areal",
            "Udnyttelse i %"],
        "Members");

    // filter rows such that only the ones with a boat and member assigned is included
    let filteredRows = data.filter(berth => {
        findCorrespondingMemberAndBoat(berth); // Set correspondingMember here
        return berth.correspondingMember; // Filter only berths with a corresponding member
    });

    filteredRows.forEach(berth => {
        if (berth.berthID !== 9999) { // do not include the default berth
            //declare data for each berth
            berthData = findBerthData(berth);
            memberAndBoatData = findCorrespondingMemberAndBoat(berth);

            // initialize table rows for each berth
            row = table.insertRow();
            row.className = "berthTableRow";

            editableColumns = [1, 2, 3]; // set the columns with name, length and width as editable

            lengthAndWidthIndexes = [2, 3]; // set the columns with length and width

            addCells(row, memberAndBoatData, [], []); // add member data first

            addCells(row, berthData, editableColumns, lengthAndWidthIndexes); // add berth data after

            addSaveBtn(row, berth); // add save button in each row
        }
    });

    // intialize tablebody and rows for the table sorted by members
    let tableBody = document.getElementById("berthListBody");
    let rows = Array.from(document.getElementsByClassName("berthTableRow"));

    rows.sort((rowA, rowB) => { // sort the rows after membership number, having the lowest number highest
        let cellA = rowA.cells[1].textContent;
        let cellB = rowB.cells[1].textContent;
        return cellA - cellB;
    });

    rows.forEach(row => tableBody.appendChild(row)); // append each row in sorted order to the table

    // get the corresponding exportBtn
    let exportBtn = document.getElementById("exportBtnMembers");
    console.log(exportBtn);

    exportBtn.addEventListener("click", exportBerthTableMembersToExcel);
}

// FUNCTION FOR CREATING TABLE ------>

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

// Start with the list sorted by berths
getBerthListRefactored(berths, "berths");

//event handler for the sorting buttons
function sortingBtnHandler(){
    let berthSortBtn = document.getElementById("berthSort");
    let memberSortBtn = document.getElementById("memberSort");

    berthSortBtn.classList.add("selected"); //start with "sorted by berths"-button 'selected'

    berthSortBtn.addEventListener("click", () => {
        getBerthListRefactored(berths, "berths");
        berthSortBtn.classList.add('selected');
        memberSortBtn.classList.remove('selected');
    });
    memberSortBtn.addEventListener("click", () => {
        getBerthListRefactored(berths, 'members')
        berthSortBtn.classList.remove('selected');
        memberSortBtn.classList.add('selected');
    });
}

sortingBtnHandler();

// FUNCTIONS FOR UPDATING THE CHANGES IN THE EDITABLE CELLS ---->

// function for saving the changes
async function saveBerthChanges(row, berth) {

    // collect updated values from the row's cells
    const cells = row.cells;

    const lengthInput = cells[2].querySelector("input");
    const widthInput = cells[3].querySelector("input");

    const length = lengthInput ? parseFloat(lengthInput.value.trim().replace("m", "")) : NaN;
    const width = widthInput ? parseFloat(widthInput.value.trim().replace("m", "")) : NaN;

    const nameInput = cells[0].querySelector("input");
    const name = nameInput ? nameInput.value.trim() : "";

    console.log("This is the name" + cells[0].querySelector("input"));

    const updatedBerth = {
        berthID: berth.berthID,
        name: name,
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

        //reload the page
        setTimeout(function () {
            location.reload();
        }, 300)
        alert("Ændringer på bådplads gemt!");

    } catch (error) {
        console.error("Kunne ikke gemme ændringer:", error);
        alert("Ændringer kunne ikke gemmes!");
    }
}

// FUNCTION FOR SEARCH FUNCTIONALITY ----->

// IMPORTANT: Maybe add such that the vessel inspector can only search for names and IDs, not areal, length and width
function searchBarBerthList() {
    let input, filter, table, tableRows;

    input = document.getElementById("berthListSearchBar"); // input field
    filter = input.value.toLowerCase(); // input entered by user converted to lowercase

    table = document.getElementById("berthListBody"); // get the dynamic created table
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

function showNoteModal(data, note) {
    // Open the modal
    const modal = document.getElementById("noteModal");
    const noteText = document.getElementById("noteText");
    const saveNoteBtn = document.getElementById("saveNoteBtn");

    // Set the current note for the selected member (or berth)
    noteText.value = note || "";  // Display the note (if any)

    // Show the modal
    modal.style.display = "block";

    // Add save functionality
    saveNoteBtn.onclick = async function() {
        // Save the note for the member (or berth)
        let note = noteText.value;
        console.log("Note saved:", note);

        // Call saveNoteForMember to save the note in the backend
        await saveNoteForMember(data, note);

        // Close the modal
        modal.style.display = "none";
    };
}

// Close the modal
document.querySelector(".close").onclick = function() {
    document.getElementById("noteModal").style.display = "none";
};


// Close the modal
document.querySelector(".close").onclick = function() {
    document.getElementById("noteModal").style.display = "none";
};

async function saveNoteForMember(data, note) {

    // Send the note value to your back-end
    try {
        const response = await fetch(`/members/updateNote/${data}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: note  // Wrap note in an object
        });

        if (response.ok) {
            console.log("Note saved successfully");
        } else {
            console.log("Error saving note");
        }
    } catch (error) {
        console.error("Error saving note:", error);
    }
    setTimeout( function () { location.reload(); }, 300)
}
