import {fetchApprovedMembers, fetchBoats, fetchBerth} from "./fetchMethods.js";
import {updateAvailability, updateBoatBerthId} from "./updateMethods.js";
export {switchHeader};

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
//openClose();

// Floating button for opening sidebar -->
let button = document.createElement("Button");
button.innerHTML = "Title";
document.body.appendChild(button);

sidebar.addEventListener('click', function (event) {
    if(event.target.classList.contains('btnSidebar')) {
        const btnSidebar = sidebar.querySelectorAll('.btnSidebar');
        btnSidebar.forEach(btnSidebar => btnSidebar.classList.remove('pressed'));

        event.target.classList.add('pressed');
    }
});


const approvedMembers = await fetchApprovedMembers();
console.log("members info:" + JSON.stringify(approvedMembers));

const boats = await fetchBoats();
console.log("boats" + boats);
//console.log("boatID" + boats.name);

const berths = await fetchBerth();
console.log("berths" + berths);

function updateWhenRemoving(boat) {
    berths.forEach(berth => {
        if(berth.berthID === boat.berthID) {
            console.log("berth == boat fundet");
            updateAvailability(berth.berthID, 1);
        }
        if(berth.berthID === 9999) {
            console.log("berth === 9999 fundet");
            updateBoatBerthId(boat.boatID, berth.berthID);
        }

    })
}


let currentSelectedButton = null;
let currentInfoCell = null;


function createMemberListBoats(approvedMembers, boats, berths) {
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
                memberName.id = `memberName${member.memberID}`;
                memberName.className = "nameBtn";
                //console.log(`Name: ${member.name}, Address: ${member.address}`);
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

                            var formForRedirect = document.createElement("form");
                            formForRedirect.action = "/default";
                            formForRedirect.method = "post";
                            formForRedirect.style ="display:inline;"

                            var removeBtn = document.createElement("button");
                            removeBtn.textContent = "fjern";
                            removeBtn.id = "removeBtn";
                            removeBtn.onclick = function() {
                                updateWhenRemoving(boat);
                            }
                            infoCell.appendChild(removeBtn);

                            formForRedirect.appendChild(removeBtn);
                            infoCell.appendChild(formForRedirect);

                        }
                    }
                }
                // event listener for the collapsable list
                collapsableListEventListener(memberName, infoContainer);
            }
        });

    });
}
createMemberListBoats(approvedMembers, boats, berths);

function createMemberListWithoutBoats(approvedMembers, boats, berths) {
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
                memberName.className = "nameBtn";
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
                        //addBtn.onclick = createBerthListAv(member);
                        addBtn.id = "addBtn" + member.memberID;
                        //addBtn.id = "addBtn";
                        addBtn.classList = "addBtn";
                        infoCell.appendChild(addBtn);

                    }
                }
                collapsableListEventListener(memberName, infoContainer);
            }

        });
    });
}

createMemberListWithoutBoats(approvedMembers, boats, berths);


function createBerthList(berths){
    var table = document.getElementById("berthList");
    var tableHeader = table.createTHead();
    tableHeader.textContent = "Bådpladser";


    berths.forEach(berth => {
        // Creating a row for each berth
        var berthRow = table.insertRow();
        berthRow.className = "rowsBerthList";
        var berthCell = berthRow.insertCell();
        berthCell.className = "berthCell";
        berthCell.id = "berthCellBerth" + berth.berthID;
        console.log(berthCell.id);

        // Creating a button for berths' names
        var berthName = document.createElement("button");
        berthName.textContent = berth.name;
        berthName.className = "berthBtn";
        berthCell.appendChild(berthName);

        // Creating a div element under each button
        var infoContainer = document.createElement("div");
        infoContainer.className = "infoContainerBerthList"
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
                infoContainer.appendChild(infoCell);
            }
            if ((key === 'length') || (key === 'width') || (key === 'depth')) {
                var infoSize = document.createElement("div");
                infoSize.textContent = " - " + key + ": " + berth[key] + " m";
                //infoSize.className = "infoCell";
                //infoSize.id = berth.name;
                size.appendChild(infoSize);
                infoSize.className = "infoSize";
                infoSize.id = berth.berthID;
                infoContainer.appendChild(size);
            }
        }

        // event listener for the collapsable list
        collapsableListEventListener(berthName, infoContainer);
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
        berthTable.style.display = 'none'
    };
    berthBtn.onclick = function () {
        // Finder alle elementer med klassen berthList
        const berthTables = document.querySelectorAll('.berthList');

        // Loop gennem og skjul hver tabel
        berthTables.forEach((table) => {
            table.style.display = 'none';
        });

        // Vis den rigtige tabel
        berthTable.style.display = 'table';

        // Skjul medlemslisterne
        memberTableNoBoat.style.display = 'none';
        memberTableBoat.style.display = 'none';
        currentSelectedButton = null;
    };
}
switchHeader();

function showThreeTables(member, addBtn) {
    var memberTableNoBoat = document.getElementById("memberListWithoutBoat");
    var memberTableBoat = document.getElementById("memberListBoat");
    var berthTable = document.getElementById("berthList");
    var berthListAvailable = document.getElementById(`berthListAv${member}`);
    var berthListSmall = document.getElementById(`berthListSmall${member}`);
    var berthListUav = document.getElementById(`berthListUav${member}`);
    //var berthListAvailable = document.querySelector(".berthListAv")

    console.log("listen: "+ `berthListAv${member}`);
    //console.log("listen2: "+ berthListAvailable.style.display);

    addBtn.onclick = function() {
        berthTable.style.display = 'none';
        memberTableNoBoat.style.display = 'none';
        memberTableBoat.style.display = 'none';
        berthListAvailable.style.display = 'table';
        berthListSmall.style.display = 'table';
        berthListUav.style.display = 'table';
    }
}

function showBerthsForBoat() {

    console.log("memberinfo: " + approvedMembers);

    console.log("objectLength:" + Object.keys(approvedMembers).length);


    //for (let i = 0, l = Object.keys(approvedMembers).length; i < l; i++) {

        approvedMembers.forEach(approvedMember => {
            var members = approvedMember.member;
            var memberID = members.memberID;

            var addBtn = document.getElementById("addBtn" + memberID);

            if (addBtn) {
                if (addBtn.id === "addBtn" + members.memberID) {
                    console.log("her kommer memeber:" + members.memberID);

                    console.log("1:", memberID);
                    console.log("2:", addBtn);
                    //console.log("3:", addBtnID);

                    var addBtnID = addBtn.id;
                    createBerthListAvailable(memberID);
                    createBerthListSmall (memberID);
                    createBerthListUnavailable(memberID);

                    showThreeTables(memberID, addBtn)
                }
            }
        })
}
showBerthsForBoat();

function updateWhenAssigning(berth, boat) {
    updateAvailability(berth, 0);
    updateBoatBerthId(boat, berth);
}


function createBerthListAvailable (member) {
    var sidebar = document.getElementById("sidebar");

    createTable(member, sidebar, "berthListAv", "Tilgængelige");

    var table = document.getElementById(`berthListAv${member}`);

    boats.forEach(boat => {
        if ((member === boat.memberID) && (boat.berthID === 9999)) {
            berths.forEach(berth => {
                if ((berth.availability === 1) && (berth.length >= boat.length) && (berth.width >= boat.width)) {
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

                    for (const key in berth) {
                        if (key === 'availability') {
                            var infoCell = document.createElement("div");
                            infoCell.textContent = "status: tilgængelig";
                            infoCell.className = "infoCell";
                            infoCell.id = berth.name;
                            infoContainer.appendChild(infoCell);
                        }
                        if ((key === 'length') || (key === 'width') || (key === 'depth')) {
                            var infoSize = document.createElement("div");
                            infoSize.textContent = " - " + key + ": " + berth[key] + " m";
                            size.appendChild(infoSize);
                            infoContainer.appendChild(size);
                        }
                    }

                    var formForRedirect = document.createElement("form");
                    formForRedirect.action = "/default";
                    formForRedirect.method = "post";
                    formForRedirect.classList = "infoCell";

                    var assignBtn = document.createElement("button");
                    assignBtn.textContent = "tildel";
                    assignBtn.classList = "assignBtn";
                    assignBtn.id = `assignBtn${member}`;
                    assignBtn.onclick = function () {
                        updateWhenAssigning(berth.berthID, boat.boatID);
                    };

                    formForRedirect.appendChild(assignBtn);
                    infoContainer.appendChild(formForRedirect);

                    // event listener for the collapsable list
                    collapsableListEventListener(berthName, infoContainer);
                }
            });
        }
    });
}

function createBerthListSmall (member) {
    var sidebar = document.getElementById("sidebar");

    createTable(member, sidebar, "berthListSmall", "Tilgængelige men for små");

    var table = document.getElementById(`berthListSmall${member}`);

    boats.forEach(boat => {
        if ((member === boat.memberID) && (boat.berthID === 9999)) {
            berths.forEach(berth => {
                if ((berth.availability === 1) && (
                    ((berth.length <= boat.length) && (berth.width < boat.width)) || ((berth.length < boat.length) && (berth.width <= boat.width)) ||
                    ((berth.length <= boat.length) && (berth.width > boat.width)) || ((berth.length < boat.length) && (berth.width >= boat.width)) ||
                    ((berth.length >= boat.length) && (berth.width < boat.width)) || ((berth.length > boat.length) && (berth.width <= boat.width)))) {
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

                    for (const key in berth) {
                        if (key === 'availability') {
                            var infoCell = document.createElement("div");
                            infoCell.textContent = "status: tilgængelig";
                            infoCell.className = "infoCell";
                            infoCell.id = berth.name;
                            infoContainer.appendChild(infoCell);
                        }
                        if ((key === 'length') || (key === 'width') || (key === 'depth')) {
                            var infoSize = document.createElement("div");
                            infoSize.textContent = " - " + key + ": " + berth[key] + " m";
                            size.appendChild(infoSize);
                            infoContainer.appendChild(size);

                        }
                    }

                    var formForRedirect = document.createElement("form");
                    formForRedirect.action = "/default";
                    formForRedirect.method = "post";
                    formForRedirect.classList = "infoCell";

                    var assignBtn = document.createElement("button");
                    assignBtn.textContent = "tildel";
                    assignBtn.classList = "assignBtn";
                    assignBtn.id = `assignBtn${member}`;
                    assignBtn.onclick = function () {
                        updateWhenAssigning(berth.berthID, boat.boatID);
                    };

                    formForRedirect.appendChild(assignBtn);
                    infoContainer.appendChild(formForRedirect);

                    collapsableListEventListener(berthName, infoContainer);
                }
            });
        }
    });
}

function createBerthListUnavailable(member) {
    var sidebar = document.getElementById("sidebar");

    createTable(member, sidebar, "berthListUav", "Utilgængelige bådpladser");

    var table = document.getElementById(`berthListUav${member}`);

    boats.forEach(boat => {
        if ((member === boat.memberID) && (boat.berthID === 9999)) {
            berths.forEach(berth => {
                if(((berth.availability === 0) || (berth.availability === 2)) && (berth.berthID !== 9999)) {
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

                    for (const key in berth) {
                        if (key === 'availability') {
                            var infoCell = document.createElement("div");
                            infoCell.textContent = "status: utilgængelig";
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
                            infoSize.className= "infoSize";
                        }
                    }
                    collapsableListEventListener(berthName, infoContainer);
                }
            });
        }
    });
}

function collapsableListEventListener(nameList, infoContainer) {
    // event listener for the collapsable list
    nameList.addEventListener("click", function () {
        const infoCells = infoContainer.querySelectorAll(".infoCell");
        nameList.classList.toggle('selectedNameBtn');

        if(currentSelectedButton && currentSelectedButton!== nameList) {
            currentSelectedButton.classList.remove("selectedNameBtn");
        }
        if(currentInfoCell && currentInfoCell !== infoCells) {
            currentInfoCell.forEach(cell => cell.style.maxHeight = null);
        }

        currentInfoCell = infoCells;
        nameList.classList.toggle("selectedNameBtn");
        currentSelectedButton = nameList;

        infoCells.forEach(cell => {
            cell.style.maxHeight = cell.style.maxHeight ? null : cell.scrollHeight + "px";
        });
    });
}

/*
function collapsableListEventListener(nameList, infoContainer) {
    nameList.addEventListener("click", function () {
        const infoCells = infoContainer.querySelectorAll(".infoCell");
        infoCells.forEach(cell => {
            if (cell.style.maxHeight) {
                nameList.classList.remove('selectedNameBtn');
                cell.style.maxHeight = null;
            } else {
                nameList.classList.add('selectedNameBtn');
                cell.style.maxHeight = cell.scrollHeight + "px";
            }
        });
    });
}
 */

function createTable(member, sidebar, berthList, ListTitel){
    var table = document.createElement("table");
    table.id = berthList + member;
    table.classList = "berthList";
    sidebar.appendChild(table);

    var thead = table.createTHead();
    thead.textContent = ListTitel;
    thead.id = berthList + member;
    thead.classList = "tableHeader";
    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
}

function searchBarSidebar() {
    console.log("Search function triggered"); //console logging to make sure that the function runs

    let input, filter, table, tableRows;
    input = document.getElementById("searchBarSidebar"); // input field

    filter = input.value.toLowerCase(); // input entered by user converted to lowercase

    table = document.getElementById("berthListSidebarBody"); // get the dynamic created table

    tableRows = table.getElementsByClassName("rowsBerthList");

    for (let i = 0; i < tableRows.length; i++) {
        let row = tableRows[i], berthName, infoContainer, rowBtn, infoCells;

        berthName = row.querySelector(".berthBtn").textContent.toLowerCase(); // Get text content of button

        infoContainer = row.querySelector(".infoContainerBerthList");

        rowBtn = row.querySelector(".berthBtn");

        infoCells = infoContainer.querySelectorAll(".infoCell");

        //collapse all  cells from start of search
        infoCells.forEach(cell => {
            cell.style.maxHeight = null;
        })

        //make sure all buttons are deselected
        rowBtn.classList.remove('selectedNameBtn');

        if (berthName.includes(filter)) {
            row.style.display = "table-row"; // show the rows that match the input
            if (berthName === filter){ // if the full berth name is written, expand the info cell
                rowBtn.classList.add('selectedNameBtn');
                infoCells.forEach(cell => {
                    cell.style.maxHeight = cell.scrollHeight + "px";
                });
            }
        } else {
            row.style.display = "none"; // hide the rows that doesn't match the input
        }
    }
}

//event handler for the search function
function searchBarEvent(){
    const berthSearchBar = document.getElementById("searchBarSidebar");
    berthSearchBar.addEventListener("keyup", searchBarSidebar);
}

searchBarEvent(berths);