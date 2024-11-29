import {fetchApprovedMembers, fetchBoats, fetchBerth} from "./fetchMethods.js";
import {updateAvailability, updateBoatBerthId} from "./updateMethods.js";
import {colorButtons} from "./mapVessel.js";

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
//console.log("members info:" + JSON.stringify(approvedMembers));

const boats = await fetchBoats();
//console.log("boats" + boats);
//console.log("boatID" + boats.name);

const berths = await fetchBerth();
//console.log("berths" + berths);

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
                            // Find berth med det matchende ID
                            // find() kan bruges da berths er et array af objects, hvor hvert object har en berthID key.
                            const berth = berths.find(b => b.berthID === boat[key]);

                            var infoCell = document.createElement("div");
                            infoCell.className = "infoCell";

                            // Hvis der findes en matchende berth, brug dens navn
                            if (berth) {
                                infoCell.textContent = `Plads: : ${berth.name} `;
                            } else {
                                infoCell.textContent = `berthnavn : Ukendt`;
                            }
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

                        addBtn.addEventListener("click", function () {
                            colorButtons(member, boat, berths);
                            memberBox (member);
                        });

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
        //console.log(berthCell.id);

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
        size.textContent = "størrelse:";
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
            if ((key === 'length') || (key === 'width')) {
                var infoSize = document.createElement("div");
                infoSize.textContent = " - " + key + ": " + berth[key] + " m";
                //infoSize.className = "infoCell";
                //infoSize.id = berth.name;
                size.appendChild(infoSize);
                infoSize.className = "size-item";
                infoSize.id = berth.berthID;
                infoContainer.appendChild(size);
            }
        }

        //indsæt båd hvis den eksisterer
        boats.forEach(boat => {
            if (boat.berthID === berth.berthID) {
                let infoCell = document.createElement("div");
                infoCell.textContent = "båd: " + boat.name;
                infoCell.className = "infoCell";

                var removeBtn = document.createElement("button");
                removeBtn.textContent = "fjern";
                removeBtn.id = "removeBtn";
                removeBtn.onclick = function() {
                    updateWhenRemoving(boat);
                }
                infoCell.appendChild(removeBtn);
                infoContainer.appendChild(infoCell);

                approvedMembers.forEach(approvedMember => {
                    if (approvedMember.member.memberID === boat.memberID) {
                        let infoCell = document.createElement("div");
                        infoCell.textContent = "medlem: " + approvedMember.member.name;
                        infoCell.className = "infoCell";
                        infoContainer.appendChild(infoCell);
                    }
                });
            }
        });

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
    const memberBox = document.getElementById("memberBox");
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
        memberBox.style.display = 'block';

    }
}

function memberBox (member) {
    const memberBox = document.getElementById("memberBox");


        boats.forEach(boat => {
            if ((member.memberID === boat.memberID) && (boat.berthID === 9999)) {

                let memberName = document.createElement("div");
                memberName.textContent = member.name;
                memberName.className = "member-name";
                memberBox.appendChild(memberName);

                for (const key in member) {
                    if ((key === 'name') || (key === 'memberID')) {
                        var memberInfo = document.createElement("div");
                        memberInfo.textContent = key + ":  " + member[key];
                        memberInfo.className = "member-item";
                        memberBox.appendChild(memberInfo);
                    }
                }

                var size = document.createElement("div");
                size.textContent = "størrelse: ";
                size.className = "member-item";

                for (const key in boat) {
                    if ((key === 'length') || (key === 'width')) {
                        let sizeInfo = document.createElement("div");
                        //console.log("key : " + boat[key]);
                        sizeInfo.textContent = key + ":  " + boat[key];
                        sizeInfo.className = "size-item"; // Tilføjer klassen
                        size.appendChild(sizeInfo);
                    }
                }
                memberBox.appendChild(size);
            }

        });
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
function getCompatibilityScore(boat, berth) {
    return fetch(`/berths/find?length=${boat.length}&width=${boat.width}`)
        .then(response => response.json())
        .then(data => {
            // Find and return the compatibility score for the specific berth
            const compatibility = data.find(item => item.berth.name === berth.name);
            return compatibility ? compatibility.compatibilityScore : 0; // Return 0 if no match
        })
        .catch(error => {
            console.error("Error fetching compatibility score:", error);
            return 0; // Return 0 in case of error
        });
}


export async function createBerthListAvailable(member) {
    var sidebar = document.getElementById("sidebar");

    createTable(member, sidebar, "berthListAv", "Tilgængelige");

    var table = document.getElementById(`berthListAv${member}`);
    var lengthOffset = 1.0;  // 1 meter ekstra i længde
    var widthOffset = 0.3;    // 0.3 meter (30 cm) ekstra i bredde

   let compatibleBerths = [];

    // First, find compatible berths and fetch compatibility scores
    for (const boat of boats) {
        if ((member === boat.memberID) && (boat.berthID === 9999)) {
            for (const berth of berths) {
                if ((berth.availability === 1) && (berth.length >= boat.length + lengthOffset) && (berth.width >= boat.width + widthOffset)) {

                    // Get compatibility score for each berth
                    const compatibilityScore = await getCompatibilityScore(boat, berth);

                    if (compatibilityScore !== null) {
                        compatibleBerths.push({member, berth, boat, compatibilityScore});
                    }
                }
            }
        }
    }

    // Sort berths by compatibility score in descending order after all data is fetched
    compatibleBerths.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    // Now, create rows for each sorted berth
    compatibleBerths.forEach(({ member, berth, boat, compatibilityScore}) => {
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
        size.textContent = "størrelse: ";
        size.className = "infoCell";

                    for (const key in berth) {
                        if (key === 'availability') {
                            var infoCell = document.createElement("div");
                            infoCell.textContent = "status: tilgængelig";
                            infoCell.className = "infoCell";
                            infoCell.id = berth.name;
                            infoContainer.appendChild(infoCell);
                        }
                        if ((key === 'length') || (key === 'width')) {
                            var infoSize = document.createElement("div");
                            infoSize.textContent = " - " + key + ": " + berth[key] + " m";
                            size.appendChild(infoSize);
                            infoContainer.appendChild(size);
                        }
                    }

        // Display compatibility score
        var compatibilityDiv = document.createElement("div");
        compatibilityDiv.textContent = "Kompatibilitet: " + compatibilityScore.toFixed(0) + " %";
        compatibilityDiv.className = "infoCell";
        infoContainer.appendChild(compatibilityDiv);

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

        // Event listener for the collapsible list
        collapsableListEventListener(berthName, infoContainer);

        return compatibleBerths;
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
                        if ((key === 'length') || (key === 'width')) {
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
                        if ((key === 'length') || (key === 'width')) {
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


class SearchHandler {
    constructor(searchBarId, memberTableNoBoatId, memberTableBoatId, berthTableId) {
        // Hent elementerne fra DOM'en
        this.searchBar = document.getElementById(searchBarId);
        this.memberTableNoBoat = document.getElementById(memberTableNoBoatId);
        this.memberTableBoat = document.getElementById(memberTableBoatId);
        this.berthTable = document.getElementById(berthTableId);

        // Hent alle rækker i tabellerne via tbody og tr
        this.memberRowsNoBoat = this.memberTableNoBoat.querySelectorAll("tbody tr");
        this.memberRowsBoat = this.memberTableBoat.querySelectorAll("tbody tr");
        this.berthRows = this.berthTable.querySelectorAll("tbody tr");

        // Tilføj event listener for 'input' på søgefeltet
        this.searchBar.addEventListener("input", () => this.performSearch());
    }

    // Metode til at udføre selve søgningen
    performSearch() {
        const searchQuery = this.searchBar.value.toLowerCase();

        // Filtrer rækker i tabellerne
        this.filterRows(this.memberRowsNoBoat, searchQuery);
        this.filterRows(this.memberRowsBoat, searchQuery);
        this.filterRows(this.berthRows, searchQuery);
    }

    // Metode til at filtrere rækkerne
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
    "memberListWithoutBoat",
    "memberListBoat",
    "berthList"
);



class SearchHandlerAfterTildel {
    constructor(searchBarId, addButtonId) {
        // Hent søgefeltet og knappen fra DOM'en
        this.searchBar = document.getElementById(searchBarId);
        this.addButton = document.getElementById(addButtonId);

        // Tilføj event listener for 'input' på søgefeltet
        this.searchBar.addEventListener("input", () => this.performSearch());
    }

    // Metode til at udføre selve søgningen
    performSearch() {
        const searchQuery = this.searchBar.value.toLowerCase();

        // Find alle tabeller hvis ID starter med berthList - ^= er begin with matching
        const tables = document.querySelectorAll("[id^='berthList']");

        tables.forEach(table => {
            const rows = table.querySelectorAll("tbody tr");
            this.filterRows(rows, searchQuery);
        });
    }

    // Metode til at filtrere rækkerne
    filterRows(rows, searchQuery) {
        rows.forEach(row => {
            // Typecaster til et array for at kunne bruge forEach-metoden.
            const cells = Array.from(row.querySelectorAll("td"));

            // cells.some tjekker, om mindst én af td-cellerne matcher søgeforespørgslen.
            const match = cells.some(cell => cell.textContent.toLowerCase().includes(searchQuery));
            row.style.display = match ? "" : "none"; // Skjuler rækker, der ikke matcher
        });
    }
}

const searchHandlerAfterTildel = new SearchHandlerAfterTildel(
    "searchBarSidebar",
    "addBtn");
