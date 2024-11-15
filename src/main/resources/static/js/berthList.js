/*
//Test/mock up data
let memberData = [
    { id: 2001, name: "Mads Hansen Ludvigsen", boatOwner: "yes", boatId: 3001, phoneNumber1: "xxxxxxxx", phoneNumber2: "xxxxxxxx"},
    { id: 2002, name: "Line Mouritzen", boatOwner: "yes", boatId: 3002, phoneNumber1: "xxxxxxxx", phoneNumber2: null},
    { id: 2003, name: "Hans Gudenå Petersen", boatOwner: "yes", boatId: 3003, phoneNumber1: "xxxxxxxx", phoneNumber2: null},
    { id: 2004, name: "Karsten Peter Schou", boatOwner: "no", boatId: null, phoneNumber1: "xxxxxxxx", phoneNumber2: null }
];

let boatData =[
    {id: 3001, owner: "Mads Hansen Ludvigsen", name:"Frida", length: "2", width: "1.5", areal: "3", berthId: 1001},
    {id: 3002, owner: "Line Mouritzen", name: "Silje", length: "3", width: "2", areal: "6", berthId: 1002},
    {id: 3003, owner: "Hans Gudenå Petersen", name: "Maja", length: "4", width: "3", areal: "12", berthId: 1003},
];

let berthData = [
    { id: 1001, address: "Fiskerbo Plads 01", length: "3", width: "2", areal: "6"},
    { id: 1002, address: "Fiskerbo Plads 02", length: "4", width: "3", areal: "12"},
    { id: 1003, address: "FiskerboPlads 03", length: "5", width: "4", areal: "20"},
]; */

import {fetchApprovedMembers, fetchBoats, fetchBerth, fetchPendingMembers} from "./memberFetch.js";

const members = await fetchApprovedMembers();
console.log(members);
const boats = await fetchBoats();
console.log(boats);
const berths = await fetchBerth();
console.log(berths);
const pendingMembers = await fetchPendingMembers();
console.log(pendingMembers);

function calculateAreal(){
    berths.forEach(berth => {
        berth.areal = berth.length * berth.width;
        console.log("berth ID:" + berth.berthID +"berth areal:" + berth.areal);
    });
    boats.forEach(boat => {
        boat.areal = boat.length * boat.width;
        console.log("boats berth ID:" + boat.berthID + "boat areal:" + boat.areal);
    })
}

calculateAreal();

function convertKeys(){
    berths.forEach(berth => {
        console.log(Object.keys(berth));
    })
    boats.forEach(boat => {
        console.log(Object.keys(boat));
    })
    members.forEach(member => {
        console.log(Object.keys(member));
    })
}

convertKeys();

function calculateUtilization(){
    calculateAreal();
    berths.forEach(berth => {
        let boat = boats.find(boat => boat.berthID === berth.berthID);
        console.log(JSON.stringify(boat) + JSON.stringify(berth));
        if (boat){
            berth.utilizationPercentage = ((boat.areal / berth.areal) * 100).toFixed(2) + "%";
            console.log(berth.areal);
            console.log(berth.utilizationPercentage);
        }
    });
}

calculateUtilization();

//create an array for the cells
const cells = [];

function addCells(tr, data){
    let td;
    // Iterate over the data
    data.forEach(function(item){
        td = tr.insertCell();
        td.textContent = item;
        td.id = item;
        cells.push(td);
    });
    console.log(cells);
}

function getBerthList(){
    const table = document.getElementById("berthListBody");
    let infoCellsBerths, infoCellsMembersAndBoats, berthInfoCell, memberAndBoatInfoCell;
    // For each berth, find corresponding boat and member
    berths.forEach(berth => {
        berth.correspondingBoat = boats.find(boat => boat.berthID === berth.berthID);
        console.log(JSON.stringify(berth.correspondingBoat));
        if (berth.correspondingBoat){
            console.log(JSON.stringify(berth.correspondingBoat.memberID));
            berth.correspondingMember = members.find(member => member.member.memberID === berth.correspondingBoat.memberID);
            console.log(JSON.stringify(berth.correspondingMember));
            if (berth.correspondingMember){
                console.log(JSON.stringify(berth.correspondingMember.member.memberID));
            }
        }
    });
    //For each berth, create a row and add the data
    berths.forEach(berth => {
        if (berth.berthID !== 9999){
            var row = table.insertRow();
            row.className = "berthTableRow";
            const berthData = [berth.berthID, berth.name, berth.length + "m", berth.width + "m", berth.areal + "m", berth.depth + "m", berth.utilizationPercentage]
            addCells(row, berthData);
            for (let i = 0; i < 6; i++){
                infoCellsBerths = cells[i];
                console.log(infoCellsBerths);
            }
            for (let i = 0; i < infoCellsBerths.length; i++){
                berthInfoCell.textContent = infoCellsBerths[i].value;
                berthInfoCell.className = "berthInfo";
            }
            let berthInfoCells = document.getElementsByClassName("berthInfo");
            console.log(berthInfoCells);
            // find boat assigned to berth and corresponding member
            if (berth.correspondingMember && berth.correspondingBoat){
                if (berth.correspondingBoat.memberID === berth.correspondingMember.member.memberID && berth.correspondingBoat.berthID === berth.berthID){
                    const memberAndBoatData = [berth.correspondingMember.member.name, berth.correspondingBoat.memberID, berth.correspondingBoat.name, berth.correspondingBoat.length, berth.correspondingBoat.width, berth.correspondingBoat.areal, berth.correspondingMember.member.phonenumber, berth.correspondingMember.member.phonenumber2]
                    addCells(row, memberAndBoatData);
                    for (let i = 6; i < 15; i++){
                        infoCellsMembersAndBoats = cells[i];
                        for (let i = 0; i < infoCellsMembersAndBoats.length; i++){
                            memberAndBoatInfoCell.textContent = infoCellsMembersAndBoats[i].value;
                            memberAndBoatInfoCell.className = "memberAndBoatInfo";
                        }
                        let memberAndBoatInfoCells = document.getElementsByClassName("memberAndBoatInfo");
                        console.log(memberAndBoatInfoCells);
                    }
                }
            } else {
                addCells(row, ["", "", "", "", "", "", "", ""]);
            }
        }
    });
}

getBerthList();

/*
let berthInfo = document.getElementsByClassName("berthInfo");
console.log(berthInfo);
let memberAndBoatInfo = document.getElementsByClassName("memberAndBoatInfo");
console.log(memberAndBoatInfo);
let input = document.getElementById("berthListSearchBar"); //input
let filter = input.value.toLowerCase(); //filter
let table = document.getElementById("berthListBody"); //ul
console.log(filter);
console.log(input);
console.log(table);*/
// Search function for the search bar

/* function searchBarBerthList() {
    console.log("Search function triggered"); //console logging to make sure that the function runs
    let input, filter, table, tableRow, berthInfo, memberAndBoatInfo, berthInfoContent, memberAndBoatInfoContent, result, tableRows;
    input = document.getElementById("berthListSearchBar"); //input
    filter = input.value.toLowerCase(); //filter
    table = document.getElementById("berthListBody"); //ul
    console.log(filter);
    tableRow = document.getElementsByTagName("")
    berthInfo = document.getElementsByClassName("berthInfo");
    console.log(berthInfo);
    memberAndBoatInfo = document.getElementsByClassName("memberAndBoatInfo");
    console.log(memberAndBoatInfo);
    for (let i = 0; i < berthInfo.length; i++){
        berthInfoContent = berthInfo[i];
        if (berthInfoContent.innerHTML !== ""){
            berthInfoContent.className = "berthInfoContent";
            console.log(berthInfoContent);
        }
        memberAndBoatInfoContent = memberAndBoatInfo[i];
        if (memberAndBoatInfoContent){
            if (memberAndBoatInfoContent.innerHTML !== ""){ // not all berths have corresponding boat and member
                memberAndBoatInfoContent.className = "memberAndBoatInfoContent";
                console.log(memberAndBoatInfoContent);
            }
        }
        tableRows = table.getElementsByClassName("berthTableRow");
        for (let i = 0; i < tableRows.length; i++) {
            if (result) {
                tableRows[i].style.display = "table-row";
            } else {
                tableRows[i].style.display = "none";
            }
        }
    }
}

function searchBarEvent(){
    const berthSearchBar = document.getElementById("berthListSearchBar");
    berthSearchBar.addEventListener("keyup", searchBarBerthList);
}

searchBarEvent();*/

