import {fetchApprovedMembers, parseData, fetchBoats, fetchBerth} from "./fetchMethods.js";
import {boats, berths} from "./fetchMethods.js";
import {Boat, Berth} from "./objects.js";

//parse boat data to array
let boatsArray = await parseData(fetchBoats(), Boat, boats);
console.log(boatsArray);

let berthArray = await parseData(fetchBerth(), Berth, berths);

// Add sidebar -->
let sidebar = document.getElementById("sidebar");

// Open or close sidebar -->
let menuState = 1;

const sidebarBtnIcon = document.getElementById("sidebarBtn");
sidebarBtnIcon.addEventListener("click", openClose);

function openClose(){
    if(menuState === 0){
        menuState = 1;
        document.getElementById("sidebar").style.width = "0";
        document.getElementById("closeSidebar").style.marginLeft = "0px";
        sidebarBtnIcon.src = "Images/Icons/openIcon.svg";
    } else {
        menuState = 0;
        document.getElementById("sidebar").style.width = "350px";
        document.getElementById("closeSidebar").style.marginLeft = "350px";
        sidebarBtnIcon.src = "Images/Icons/closeIcon.svg";
    }
}
openClose();
const approvedMembers = await fetchApprovedMembers();

//const parseApprovedMembers = JSON.parse(approvedMembers);

// Create collapsible lists for members and berths
function createMemberList(approvedMembers) {
    var table = document.getElementById("memberList");
    var tableHeader = table.createTHead();
    tableHeader.textContent = "Medlemmer";

    let currentSelectedButton = null;
    let currentInfoCell = null;

    approvedMembers.forEach(approvedMember => {
        var memberRow = table.insertRow();
        var memberCell = memberRow.insertCell();
        memberCell.className = "memberCell";

        const member = approvedMember.member;

        var memberName = document.createElement("button");
        memberName.textContent = member.name;
        memberName.className = "memberBtn";
        console.log(`Name: ${member.name}, Address: ${member.address}`)
        memberCell.appendChild(memberName);

        // Creating a div element under each button
        var infoContainer = document.createElement("div");
        memberCell.appendChild(infoContainer);

        for (const key in member) {
            if ((key !== 'name') && (key !== 'boatownership')) {
                var infoCell = document.createElement("div");
                infoCell.textContent = key + " : " + member[key];
                infoCell.className = "infoCell";
                infoContainer.appendChild(infoCell);
            }

            if ((key === 'boatownership') && (approvedMember.member.boatownership === true)) {
                boatsArray.forEach(boat => {
                   if (boat.memberID === approvedMember.member.memberID) {
                       var infoCell = document.createElement("div");
                       infoCell.textContent = "bådnavn: " + boat.name;
                       infoCell.className = "infoCell";
                       infoContainer.appendChild(infoCell);

                       berthArray.forEach(berth => {
                          if ((berth.berthID === boat.berthID) && (boat.berthID !== 9999)) {
                              var infoCell = document.createElement("div");
                              infoCell.textContent = "berth: " + berth.name;
                              infoCell.className = "infoCell";
                              infoContainer.appendChild(infoCell);
                          }
                       });

                   }
                });
            }
        }

        collapsableListEventListener(memberName, infoContainer)

        // event listener for the collapsable list
    /*    memberName.addEventListener("click", function () {
            const infoCells = infoContainer.querySelectorAll(".infoCell");
            memberName.classList.toggle('selectedNameBtn');

            if(currentSelectedButton && currentSelectedButton!== memberName) {
                currentSelectedButton.classList.remove("selectedNameBtn");
            }
            if(currentInfoCell && currentInfoCell !== infoCells) {
                currentInfoCell.forEach(cell => cell.style.maxHeight = null);
            }

            currentInfoCell = infoCells;

            memberName.classList.toggle("selectedNameBtn");

            currentSelectedButton = memberName;

            infoCells.forEach(cell => {
                cell.style.maxHeight = cell.style.maxHeight ? null : cell.scrollHeight + "px";
            });
            //infoCells.forEach(cell => {
            //    if (cell.style.maxHeight) {
            //        cell.style.maxHeight = null;
            //    } else {
            //        cell.style.maxHeight = cell.scrollHeight + "px";
            //    }
            //});
        });*/
    });
}

createMemberList(approvedMembers);

class SearchHandler {
    constructor(searchBarId, memberListId) {
        // Hent elementerne fra DOM'en
        this.searchBar = document.getElementById(searchBarId);
        this.memberList = document.getElementById(memberListId);

        // Hent alle rækker i tabellerne via tbody og tr
        this.memberRows = this.memberList.querySelectorAll("tbody tr");

        // Tilføj event listener for 'input' på søgefeltet
        this.searchBar.addEventListener("input", () => this.performSearch());
    }

    // Metode til at udføre selve søgningen
    performSearch() {
        const searchQuery = this.searchBar.value.toLowerCase();
        this.filterRows(this.memberRows, searchQuery);
    }

    filterRows(rows, searchQuery) {
        rows.forEach(row => {
            // Typecaster til et array for at kunne bruge forEach method.
            const cells = Array.from(row.querySelectorAll("td"));

            // cells.some tjekker om mindst en af td - table data - felterne indeholder hvad end der er skrevet i searchQuery.
            const match = cells.some(cell => cell.textContent.toLowerCase().includes(searchQuery));
            row.style.display = match ? "" : "none";
        });
    }
}

// Opret en instans og giv den de id'er som den skal bruge.
const searchHandler = new SearchHandler(
    "searchBarSidebar",
    "memberList"
);


let currentSelectedButton = null;
let currentInfoCell = null;

function collapsableListEventListener(button, infoContainer) {
    button.addEventListener("click", function (event) {
        const infoCells = infoContainer.querySelectorAll(".infoCell");

        if (currentSelectedButton === button) {
            // Hvis den samme knap trykkes, fjern CSS og kollaps info-cellerne
            button.classList.remove("selectedNameBtn");
            infoCells.forEach(cell => cell.style.maxHeight = null);

            // Nulstil den aktuelle valgte knap og info-celler
            currentSelectedButton = null;
            currentInfoCell = null;
        } else {
            // Hvis en anden knap trykkes, håndter den tidligere valgte knap og info-celler
            if (currentSelectedButton) {
                currentSelectedButton.classList.remove("selectedNameBtn");
            }
            if (currentInfoCell) {
                currentInfoCell.forEach(cell => cell.style.maxHeight = null);
            }

            // Tilføj CSS til den nye knap og udvid dens info-celler
            button.classList.add("selectedNameBtn");
            infoCells.forEach(cell => {
                cell.style.maxHeight = cell.scrollHeight + "px";
            });

            // Opdater den aktuelle valgte knap og info-celler
            currentSelectedButton = button;
            currentInfoCell = infoCells;
        }
    });
}