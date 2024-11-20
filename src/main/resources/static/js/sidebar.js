
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

// Test/mockup data for creating the lists
let memberData = [
    { id: 1001, name: "Mads Hansen Ludvigsen", boatAssigned: "no", feeSent: "no", feePaid: "no" },
    { id: 1002, name: "Line Mouritzen", boatAssigned: "yes", feeSent: "yes", feePaid: "no"},
    { id: 1003, name: "Hans Gudenå Petersen", boatAssigned: "no", feeSent: "yes", feePaid: "yes"},
];

let berthData =[
    {id: 101, name: "FB13"},
    {id: 102, name: "FB14"},
    {id: 103, name: "FB15"},
];

// Create collapsible lists for members and berths
function createMemberList(data) {
    var table = document.getElementById("memberList");
    var tableHeader = table.createTHead();
    tableHeader.textContent = "Medlemmer";

    data.forEach(function (item) {
        // Creating a row for each member
        var memberRow = table.insertRow();
        var memberCell = memberRow.insertCell();
        memberCell.className = "memberCell";

        // Creating a button for members' names
        var memberName = document.createElement("button");
        memberName.textContent = item.name;
        memberName.className = "nameBtn";
        memberCell.appendChild(memberName);

        // Creating a div element under each button
        var infoContainer = document.createElement("div");
        memberCell.appendChild(infoContainer);

        // Creating information cells dynamically within the div container
        Object.keys(item).forEach(function (key) {
            if (key !== 'name') {
                var infoCell = document.createElement("div");
                infoCell.textContent = key + ":" + item[key];
                infoCell.className = "infoCell";
                infoContainer.appendChild(infoCell);
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

createMemberList(memberData);

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
