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


function createMemberListBoats(approvedMembers) {
    var table = document.getElementById("memberListBoat");
    var tableHeader = table.createTHead();
    tableHeader.textContent = "Medlemmer med bådplads";

    approvedMembers.forEach(approvedMember => {
        const member = approvedMember.member;

        boats.forEach(boat => {
            if((member.memberID === boat.memberID) && (boat.berthID !== 9999)) {
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
                        if ((key === 'name') || (key === 'length') || (key === 'width')) {
                            var infoCell = document.createElement("div");
                            //console.log("key : " + boat[key]);
                            infoCell.textContent = key + " : " + boat[key];
                            infoCell.className = "infoCell";
                            infoContainer.appendChild(infoCell);
                        }

                        if (key === 'berthID') {
                            var infoCell = document.createElement("div");
                            //console.log("key : " + boat[key]);
                            infoCell.textContent = key + " : " + boat[key];
                            infoCell.className = "infoCell";
                            infoContainer.appendChild(infoCell);

                            var removeBtn = document.createElement("button");
                            removeBtn.textContent = "fjern";
                            removeBtn.id = "removeBtn";
                            infoCell.appendChild(removeBtn);

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

function createMemberListWithoutBoats(approvedMembers) {
    var table = document.getElementById("memberListWithoutBoat");
    var tableHeader = table.createTHead();
    tableHeader.textContent = "Medlemmer uden bådplads";

    approvedMembers.forEach(approvedMember => {
        const member = approvedMember.member;

        boats.forEach(boat => {
            if ((member.memberID === boat.memberID) && (boat.berthID === 9999)) {
                var memberRow = table.insertRow();
                var memberCell = memberRow.insertCell();
                memberCell.className = "memberCell";

                //createTableDivElement (memberCell, memberName, member);

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
                    if ((key === 'name') || (key === 'length') || (key === 'width')) {
                        var infoCell = document.createElement("div");
                        //console.log("key : " + boat[key]);
                        infoCell.textContent = key + " : " + boat[key];
                        infoCell.className = "infoCell";
                        infoContainer.appendChild(infoCell);

                    }
                    if (key === 'berthID') {
                        var infoCell = document.createElement("div");
                        //console.log("key : " + boat[key]);
                        infoCell.textContent = key + " : ";
                        infoCell.className = "infoCell";
                        infoContainer.appendChild(infoCell);

                        var addBtn = document.createElement("button");
                        addBtn.textContent = "tilføj";
                        addBtn.id = "addBtn";
                        infoCell.appendChild(addBtn);
                    }
                }
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

createMemberListWithoutBoats(approvedMembers);



const berths = await fetchBerth();
console.log("berths" + berths);

function createBerthList(berths){
    var table = document.getElementById("berthList");
    var tableHeader = table.createTHead();
    tableHeader.textContent = "Bådpladser";

    berths.forEach(berth => {
        // Creating a row for each berth
        var berthRow = table.insertRow();
        var berthCell = berthRow.insertCell();
        berthCell.className = "berthCell";

        // Creating a button for berths' names
        var berthName = document.createElement("button");
        berthName.textContent = berth.name;
        berthName.className = "berthBtn";
        berthCell.appendChild(berthName);

        // Creating a div element under each button
        var infoContainer = document.createElement("div");
        berthCell.appendChild(infoContainer);

        var size = document.createElement("div");
        size.textContent = "størrelse";
        size.className = "infoCell";

        // Creating information cells dynamically within the div container
        for (const key in berth) {
            if (key === 'availability') {
                var infoCell = document.createElement("div");

                if (berth[key] === 0 ) {
                    infoCell.textContent = "status: utilgængelig";

                } else if (berth[key] === 1) {
                    infoCell.textContent = "status: tilgængelig";

                } else if (berth[key] === 2) {
                    infoCell.textContent = "status: midlertidig tilgængelig";
                }
                infoCell.className = "infoCell";
                infoCell.id = berth.name;
                infoContainer.appendChild(infoCell);
            }
            if ((key === 'length') || (key === 'width') || (key === 'depth')) {
                var infoSize = document.createElement("div");
                infoSize.textContent = " - " + key + ": " + berth[key] + " m";
                //infoSize.className = "infoCell";
                //infoSize.id = berth.name;
                size.appendChild(infoSize);
                infoContainer.appendChild(size);

            }
        }


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

createBerthList(berths);


function switchHeader(){
    var memberTableNoBoat = document.getElementById("memberListWithoutBoat");
    var memberTableBoat = document.getElementById("memberListBoat");
    var berthTable = document.getElementById("berthList");
    var memberBtn = document.getElementById("memberBtn");
    var berthBtn = document.getElementById("berthBtn");
    memberBtn.onclick = function (){
        memberTableNoBoat.style.display = 'table';
        memberTableBoat.style.display = 'table'
        berthTable.style.display = 'none';
    };
    berthBtn.onclick = function (){
        berthTable.style.display = 'table';
        memberTableNoBoat.style.display = 'none';
        memberTableBoat.style.display = 'none';
    };
}

switchHeader();



function showBerthsForBoat() {
    var memberTableNoBoat = document.getElementById("memberListWithoutBoat");
    var memberTableBoat = document.getElementById("memberListBoat");
    var berthList = document.getElementById("berthBtn");
    var addBtn = document.getElementById("addBtn");
    addBtn.onclick = function () {
        berthTable.style.display = 'none';
        memberTableNoBoat.style.display = 'table';
        memberTableBoat.style.display = 'table'
    }
}