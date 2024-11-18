

import {fetchApprovedMembers, fetchBoats, fetchBerth} from "./memberFetch.js";

const members = await fetchApprovedMembers();
console.log(members);
const boats = await fetchBoats();
console.log(boats);
const berths = await fetchBerth();
console.log(berths);

function calculateAreal(){
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


function addCells(tr, data){
    // Iterate over the data
    data.forEach(function(item){
        var td = tr.insertCell();
        td.textContent = item;
    });
}

function getMemberList(){
    const table = document.getElementById("memberListBody");
    // For each berth, find corresponding boat and member
    members.forEach(member => {
        member.correspondingBoat = boats.find(boat => boat.memberID === member.memberID);
        console.log(JSON.stringify(member.correspondingBoat));
        if (member.correspondingBoat){
            console.log(JSON.stringify(member.correspondingBoat.berthID));
            member.correspondingBerth = berths.find(berth => berth.berth.berthID === member.correspondingBoat.berthID);
            console.log(JSON.stringify(member.correspondingBerth));
            if (member.correspondingBerth){
                console.log(JSON.stringify(member.correspondingBerth.berth.berthID));
            }
        }
    });
    //For each berth, create a row and add the data
    members.forEach(member => {
        var row = table.insertRow();
        addCells(row, [member.memberID, member.name, member.address, member.email, member.phonenumber]);
        // find boat assigned to berth and corresponding member
        if (member.correspondingBoat ){
                addCells(row, [member.correspondingBoat.boat.name,member.correspondingBoat.boat.length + "m", member.correspondingBoat.boat.width + "m", member.correspondingBoat.boat.areal + "m^2", "hey"])
            if (member.correspondingBerth){
                addCells(row, [member.correspondingBerth.berth.name,]);
            }
        } else {
            addCells(row, ["", "", "", "", "", ""]);
        }
    });
}

getMemberList();

//chatgpt was here