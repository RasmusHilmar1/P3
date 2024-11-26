import {fetchApprovedMembers} from "./fetchMethods.js";

// Add sidebar -->
var sidebar = document.getElementById("sidebar");

// Open or close sidebar -->
var menuState = 0;
function openClose(){
    const sidebarBtnIcon = document.getElementById("sidebarBtn");
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
            if (key !== 'name') {
                var infoCell = document.createElement("div");
                infoCell.textContent = key + " : " + member[key];
                infoCell.className = "infoCell";
                infoContainer.appendChild(infoCell);
            }
        }

        // event listener for the collapsable list
        memberName.addEventListener("click", function () {
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
        });
    });
}

createMemberList(approvedMembers);