import {fetchApprovedMembers, fetchBoats, fetchBerth} from "./memberFetch.js";

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

// Floating button for opening sidebar -->
var button = document.createElement("Button");
button.innerHTML = "Title";
document.body.appendChild(button);



sidebar.addEventListener('click', function (event) {
    if(event.target.classList.contains('btnSidebar')) {
        const btnSidebar = sidebar.querySelectorAll('.btnSidebar');
        btnSidebar.forEach(btnSidebar => btnSidebar.classList.remove('pressed'));

        event.target.classList.add('pressed');
    }
});

let berthData =[
    {id: 101, name: "FB13"},
    {id: 102, name: "FB14"},
    {id: 103, name: "FB15"},
];

const approvedMembers = await fetchApprovedMembers();
//console.log("members info:" + approvedMembers);

const boats = await fetchBoats();
console.log("boats" + boats);
//console.log("boatID" + boats.name);


const berths = await fetchBerth();
console.log("berths" + berths);

function createMemberListBoats(approvedMembers) {
    var table = document.getElementById("memberListBoat");
    var tableHeader = table.createTHead();
    tableHeader.textContent = "Medlemmer med bådplads";

    approvedMembers.forEach(approvedMember => {
        const member = approvedMember.member;

        boats.forEach(boat => {
            if((member.memberID === boat.memberID) && (boat.memberID !== null)) {
                var memberRow = table.insertRow();
                var memberCell = memberRow.insertCell();
                memberCell.className = "memberCell";
                
                var memberName = document.createElement("button");
                memberName.textContent = member.name;
                //console.log(`Name: ${member.name}, Address: ${member.address}`)
                memberCell.appendChild(memberName);

                // Creating a div element under each button
                var infoContainer = document.createElement("div");
                memberCell.appendChild(infoContainer);

                for (const key in member) {
                    if (key === 'memberID') {
                        var infoCell = document.createElement("div");
                        infoCell.textContent = key + " : " + member[key];
                        infoCell.className = "infoCell";
                        infoContainer.appendChild(infoCell);
                    }
                }
                if (member.memberID === boat.memberID) {
                    for (const key in boat) {
                        if ((key === 'name') || (key === 'berthID') || (key === 'length') || (key === 'width')) {
                            var infoCell = document.createElement("div");
                            //console.log("key : " + boat[key]);
                            infoCell.textContent = key + " : " + boat[key];
                            infoCell.className = "infoCell";
                            infoContainer.appendChild(infoCell);
                        }
                    }
                }
                // event listener for the collapsable list
                memberName.addEventListener("click", function () {
                    const infoCells = infoContainer.querySelectorAll(".infoCell");
                    memberName.classList.toggle('selectedNameBtn');
                    infoCells.forEach(cell => {
                        if (cell.style.maxHeight) {
                            cell.style.maxHeight = null;
                        } else {
                            cell.style.maxHeight = cell.scrollHeight + "px";
                        }
                    });
                });
            }
        });

    });
}

createMemberListBoats(approvedMembers);


/*
// Create collapsible lists for members and berths
function createMemberListBoats(approvedMembers) {
    var table = document.getElementById("memberListBoat");
    var tableHeader = table.createTHead();
    tableHeader.textContent = "Medlemmer med bådplads";

    approvedMembers.forEach(approvedMember => {
        var memberRow = table.insertRow();
        var memberCell = memberRow.insertCell();
        memberCell.className = "memberCell";

        const member = approvedMember.member;

        var memberName = document.createElement("button");
        memberName.textContent = member.name;
        //console.log(`Name: ${member.name}, Address: ${member.address}`)
        memberCell.appendChild(memberName);

        // Creating a div element under each button
        var infoContainer = document.createElement("div");
        memberCell.appendChild(infoContainer);


        for (const key in member) {
            if (key === 'memberID') {
                var infoCell = document.createElement("div");
                infoCell.textContent = key + " : " + member[key];
                infoCell.className = "infoCell";
                infoContainer.appendChild(infoCell);
            }
        }

        boats.forEach(boat => {
            if (member.memberID === boat.memberID) {
                for (const key in boat) {
                    if ((key === 'name') || (key === 'berthID') || (key === 'length') || (key === 'width')) {
                        var infoCell = document.createElement("div");
                        //console.log("key : " + boat[key]);
                        infoCell.textContent = key + " : " + boat[key];
                        infoCell.className = "infoCell";
                        infoContainer.appendChild(infoCell);
                    }
                }
            }
        });

        // event listener for the collapsable list
        memberName.addEventListener("click", function () {
            const infoCells = infoContainer.querySelectorAll(".infoCell");
            memberName.classList.toggle('selectedNameBtn');
            infoCells.forEach(cell => {
                if (cell.style.maxHeight) {
                    cell.style.maxHeight = null;
                } else {
                    cell.style.maxHeight = cell.scrollHeight + "px";
                }
            });
        });
    });
}

createMemberListBoats(approvedMembers);
*/

function createMemberListWithoutBoats(approvedMembers) {
    var table = document.getElementById("memberListWithoutBoat");
    var tableHeader = table.createTHead();
    tableHeader.textContent = "Medlemmer uden bådplads";

    approvedMembers.forEach(approvedMember => {
        const member = approvedMember.member;

        boats.forEach(boat => {
            if ((member.memberID === boat.memberID) && (boat.berthID === null)) {
                var memberRow = table.insertRow();
                var memberCell = memberRow.insertCell();
                memberCell.className = "memberCell";

                var memberName = document.createElement("button");
                memberName.textContent = member.name;
                //console.log(`Name: ${member.name}, Address: ${member.address}`)
                memberCell.appendChild(memberName);

                // Creating a div element under each button
                var infoContainer = document.createElement("div");
                memberCell.appendChild(infoContainer);

                for (const key in member) {
                    if (key === 'memberID') {
                        var infoCell = document.createElement("div");
                        infoCell.textContent = key + " : " + member[key];
                        infoCell.className = "infoCell";
                        infoContainer.appendChild(infoCell);
                    }
                }

                for (const key in boat) {
                    if ((key === 'name') || (key === 'berthID') || (key === 'length') || (key === 'width')) {
                        var infoCell = document.createElement("div");
                        //console.log("key : " + boat[key]);
                        infoCell.textContent = key + " : " + boat[key];
                        infoCell.className = "infoCell";
                        infoContainer.appendChild(infoCell);
                    }
                }
            }

        });
    });

}

createMemberListWithoutBoats(approvedMembers);

function createBerthList(data){
    var table = document.getElementById("berthList");
    var tableHeader = table.createTHead();
    tableHeader.textContent = "Bådpladser";

    data.forEach(function (item) {
        // Creating a row for each berth
        var berthRow = table.insertRow();
        var berthCell = berthRow.insertCell();
        berthCell.className = "berthCell";

        // Creating a button for berths' names
        var berthName = document.createElement("button");
        berthName.textContent = item.name;
        berthName.className = "berthBtn";
        berthCell.appendChild(berthName);

        // Creating a div element under each button
        var infoContainer = document.createElement("div");
        berthCell.appendChild(infoContainer);

        // Creating information cells dynamically within the div container
        Object.keys(item).forEach(function (key) {
            if (key !== 'name') {
                var infoCell = document.createElement("div");
                infoCell.textContent = key + ":" + item[key];
                infoCell.className = "infoCell";
                infoCell.id = item.name;
                infoContainer.appendChild(infoCell);
            }
        });

        // event listener for the collapsable list
        berthName.addEventListener("click", function () {
            const infoCells = infoContainer.querySelectorAll(".infoCell");
            berthName.classList.toggle('selectedNameBtn');
            infoCells.forEach(cell => {
                if (cell.style.maxHeight) {
                    cell.style.maxHeight = null;
                } else {
                    cell.style.maxHeight = cell.scrollHeight + "px";
                }
            });
        });
    });
}

createBerthList(berthData);


function switchHeader(){
    var memberTable = document.getElementById("memberList");
    var berthTable = document.getElementById("berthList");
    var memberBtn = document.getElementById("memberBtn");
    var berthBtn = document.getElementById("berthBtn");
    memberBtn.onclick = function (){
        memberTable.style.display = 'table';
        berthTable.style.display = 'none';
    };
    berthBtn.onclick = function (){
        berthTable.style.display = 'table';
        memberTable.style.display = 'none';
    };
}

switchHeader();
