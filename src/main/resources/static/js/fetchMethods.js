
export {fetchApprovedMembers, fetchBoats, fetchBerth, fetchPendingMembers, fetchPendingBoats, parseData};
import {Boat, PendingBoat, Berth, Member} from "./objects.js";

//var memberBtn = document.getElementById("memberBtn");

//memberBtn.addEventListener("click", fetchApprovedMembers);

async function fetchApprovedMembers() {
    try {
        const response = await fetch('/api/approvedMembers');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const approvedMembers = await response.json();
        console.log("Fetched approved members:", approvedMembers); // Debug output

        return approvedMembers;

        /*
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = ''; // Clear previous results
        approvedMembers.forEach(approvedMember => {
            const member = approvedMember.member;
            //const memberInfo = document.createElement('div');
            //memberInfo.textContent = `ID: ${member.memberID}, Name: ${member.name}, Address: ${member.address}, Email: ${member.email}`;
            //resultDiv.appendChild(memberInfo);
        });
        */

    } catch (error) {
        console.error('Error fetching approved members:', error);
    }
}

async function fetchBoats() {
    try {
        const response = await fetch('/boats');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const boats = await response.json();
        console.log("Fetched boats:", boats); // Debug output

        return boats;


    } catch (error) {
        console.error('Error fetching boats:', error);
    }
}

async function fetchBerth() {
    try {
        const response = await fetch('berths/get');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const berths = await response.json();
        console.log("Fetched berths:", berths); // Debug output

        return berths;


    } catch (error) {
        console.error('Error fetching berths:', error);
    }
}

async function fetchPendingMembers(){
    try {
        const response = await fetch("/api/pendingMembers");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const members = await response.json();
        console.log("Fetched pending members:", members);

        return members;

    } catch (error) {
        console.error("Error fetching pending members:", error);
    }
}

async function fetchPendingBoats(){
    try {
        const response = await fetch("/api/pendingBoats");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const boats = await response.json();
        console.log("Fetched pending boats:", boats);
        boats.forEach(boat => {
            console.log(boat);
            console.log("Boat ID:", boat.boat.boatID);
            console.log("Fee Sent:", boat.boat.feeSent);
            console.log("Fee Paid:", boat.boat.feePaid);
        });
        return boats;

    } catch (error) {
        console.error("Error fetching pending boats:", error);
    }
}

// parsing the data from fetch
async function parseData(method, object, array){

    const parsedData = await method;
    console.log(parsedData);

    parsedData.map(objectData => {
        if (object === Berth){
            array.push(new object(objectData.berthID, objectData.name, objectData.availability, objectData.length, objectData.width, objectData.depth, objectData.pierId));
        } else if(object === Boat){
            array.push(new Boat(objectData.boatID, objectData.memberID, objectData.berthID, objectData.name, objectData.type, objectData.manufacturer, objectData.length, objectData.width, objectData.draught, objectData.insurance, objectData.feeSent, objectData.feePaid));
        } else if(object === PendingBoat){
            array.push(new object(objectData.id, objectData.boat));
            console.log(objectData.id, objectData.boat);
        } else if (object === Member) {
            array.push(new object(objectData.id, objectData.member));
        }
    });
    // return the array with elements
    return array;
}