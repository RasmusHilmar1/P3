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
console.log("members info:" + JSON.stringify(approvedMembers));

const boats = await fetchBoats();
console.log("boats" + boats);
//console.log("boatID" + boats.name);

const berths = await fetchBerth();
console.log("berths" + berths);

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

createMemberListWithoutBoats(approvedMembers, boats, berths);


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
    var addBtn = document.getElementById("addBtn");

    var berthListAvailable = document.getElementById("berthListAvailable");
    var berthListSmall = document.getElementById("berthListSmall");
    var berthListUnavailable = document.getElementById("berthListUnavailable");

    memberBtn.onclick = function (){
        memberTableNoBoat.style.display = 'table';
        memberTableBoat.style.display = 'table'
        berthTable.style.display = 'none';
        berthListAvailable.style.display = 'none';
        berthListSmall.style.display = 'none'
        berthListUnavailable.style.display = 'none'
    };
    berthBtn.onclick = function (){
        berthTable.style.display = 'table';
        memberTableNoBoat.style.display = 'none';
        memberTableBoat.style.display = 'none';
        berthListAvailable.style.display = 'none';
        berthListSmall.style.display = 'none'
        berthListUnavailable.style.display = 'none'
    };
    /*
    addBtn.onclick = function () {
        berthList.style.display = 'none';
        memberTableNoBoat.style.display = 'none';
        memberTableBoat.style.display = 'none';
        berthListAvailable.style.display = 'table';
        berthListSmall.style.display = 'table'
        berthListUnavailable.style.display = 'table';
    }
     */
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

function createBerthListAvailable (member) {
    var sidebar = document.getElementById("sidebar");

    var table = document.createElement("table");
    table.id = `berthListAv${member}`;
    table.classList = "berthList";
    sidebar.appendChild(table);

    var thead = table.createTHead();
    thead.textContent = "Tilgængelige bådpladser"
    thead.id = `BerthListAv${member}`;
    thead.classList = "tableHeader";
    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

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
                            //infoSize.className = "infoCell";
                            //infoSize.id = berth.name;
                            size.appendChild(infoSize);
                            infoContainer.appendChild(size);
                        }
                    }

                    var formForRedirect = document.createElement("form");
                    formForRedirect.action = "/default";
                    formForRedirect.method = "post";
                    formForRedirect.style ="display:inline;"

                    var assignBtn = document.createElement("button");
                    assignBtn.textContent = "tildel";
                    assignBtn.classList = "assignBtn";
                    assignBtn.id = `assignBtn${member}`;

                    formForRedirect.appendChild(assignBtn);
                    infoContainer.appendChild(formForRedirect);

                    // event listener for the collapsable list

                    berthName.addEventListener("click", function () {
                        const infoCells = infoContainer.querySelectorAll(".infoCell");
                        berthName.classList.toggle('selectedNameBtn');
                        infoCells.forEach(cell => {
                            if (cell.style.maxHeight) {
                                cell.style.maxHeight = null;
                                assignBtn.style.display = 'none';
                            } else {
                                cell.style.maxHeight = cell.scrollHeight + "px";
                                assignBtn.style.display = 'block';
                            }
                        });
                    });
                }
            });
        }
    });
}

function createBerthListSmall (member) {
    var sidebar = document.getElementById("sidebar");

    var table = document.createElement("table");
    table.id = `berthListSmall${member}`;
    table.classList = "berthList";
    sidebar.appendChild(table);

    var thead = table.createTHead();
    thead.textContent = "For små bådpladser"
    thead.id = `berthListSmall${member}`;
    thead.classList = "tableHeader";
    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

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
                            //infoSize.className = "infoCell";
                            //infoSize.id = berth.name;
                            size.appendChild(infoSize);
                            infoContainer.appendChild(size);

                        }
                    }

                    var formForRedirect = document.createElement("form");
                    formForRedirect.action = "/default";
                    formForRedirect.method = "post";
                    formForRedirect.style ="display:inline;"

                    var assignBtn = document.createElement("button");
                    assignBtn.textContent = "tildel";
                    assignBtn.classList = "assignBtn";
                    assignBtn.id = `assignBtn${member}`;

                    formForRedirect.appendChild(assignBtn);
                    infoContainer.appendChild(formForRedirect);

                    // event listener for the collapsable list

                    berthName.addEventListener("click", function () {
                        const infoCells = infoContainer.querySelectorAll(".infoCell");
                        berthName.classList.toggle('selectedNameBtn');
                        infoCells.forEach(cell => {
                            if (cell.style.maxHeight) {
                                cell.style.maxHeight = null;
                                assignBtn.style.display = 'none';
                            } else {
                                cell.style.maxHeight = cell.scrollHeight + "px";
                                assignBtn.style.display = 'block';
                            }
                        });
                    });
                }
            });
        }
    });
}

function createBerthListUnavailable(member) {
    var sidebar = document.getElementById("sidebar");

    var table = document.createElement("table");
    table.id = `berthListUav${member}`;
    table.classList = "berthList";
    sidebar.appendChild(table);

    var thead = table.createTHead();
    thead.textContent = "Utilgængelige bådpladser"
    thead.id = `berthListUav${member}`;
    thead.classList = "tableHeader";
    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    boats.forEach(boat => {
        if ((member === boat.memberID) && (boat.berthID === 9999)) {
            berths.forEach(berth => {
                if((berth.availability === 0) && (berth.berthID !== 9999)) {
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

                        }
                    }

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
                }
            });
        }
    });
}