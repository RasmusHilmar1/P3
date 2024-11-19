// import fetch functions
import {fetchApprovedMembers, fetchBoats, fetchBerth} from "./memberFetch.js";

const members = await fetchApprovedMembers();
console.log(members);
const boats = await fetchBoats();
console.log(boats);
const berths = await fetchBerth();
console.log(berths);

// Calculate areal for berth and boats for the dynamic table and calculating the utilization percentage
function calculateAreal(){
    berths.forEach(berth => {
        berth.areal = berth.length * berth.width;
        console.log("berth ID:" + berth.berthID +"berth areal:" + berth.areal); // console logging each berth and corresponding areal
    });
    boats.forEach(boat => {
        boat.areal = boat.length * boat.width;
        console.log("boats berth ID:" + boat.berthID + "boat areal:" + boat.areal); // console logging each boat and corresponding areal
    })
}

calculateAreal();

// calculating the utilization of occupied berth in percentage
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

function addCells(tr, data){
    let td;
    // insert a new cell for each of the item in the data
    data.forEach(function(item){
        td = tr.insertCell();
        td.textContent = item;
        td.id = item;
        console.log(td.id);
    });
}

function getBerthList(){
    const table = document.getElementById("berthListBody"); // get the HTML element for the dynamic table
    // For each berth, find corresponding boat and member
    berths.forEach(berth => {
        berth.correspondingBoat = boats.find(boat => boat.berthID === berth.berthID);
        console.log(berth.correspondingBoat);
        if (berth.correspondingBoat){
            berth.correspondingMember = members.find(member => member.member.memberID === berth.correspondingBoat.memberID); //if there is found a boat, find the corresponding member
            if (berth.correspondingMember){
                console.log(berth.correspondingMember.member.memberID);
            }
        }
    });
    //For each berth, create a row and add cells with the data
    berths.forEach(berth => {
        if (berth.berthID !== 9999){
            var row = table.insertRow();
            row.className = "berthTableRow";
            const berthData = [berth.berthID, berth.name, berth.length + "m", berth.width + "m", berth.areal + "m", berth.depth + "m", berth.utilizationPercentage]
            addCells(row, berthData);
            berth.correspondingBerthCells = berthData;
            // find boat assigned to berth and corresponding member
            if (berth.correspondingMember && berth.correspondingBoat){
                if (berth.correspondingBoat.memberID === berth.correspondingMember.member.memberID && berth.correspondingBoat.berthID === berth.berthID){
                    const memberAndBoatData = [berth.correspondingMember.member.name, berth.correspondingBoat.memberID, berth.correspondingBoat.name, berth.correspondingBoat.length, berth.correspondingBoat.width, berth.correspondingBoat.areal, berth.correspondingMember.member.phonenumber, berth.correspondingMember.member.phonenumber2]
                    addCells(row, memberAndBoatData);
                    berth.correspondingMemberAndBoatCells = memberAndBoatData;
                }
            }
            // else add empty cells
            else {
                addCells(row, ["", "", "", "", "", "", "", ""]);
            }
        }
    });
}

getBerthList();

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
            const cellText = rowCells[j].textContent.toLowerCase(); //have all cell content converted into lowercase since input is also converted to lowercase
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
