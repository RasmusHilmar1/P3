class Sidebar {
    constructor() {
        this.menuState = 0;
        this.sidebar = document.getElementById("sidebar");
        this.sidebarBtnIcon = document.getElementById("sidebarBtn");
        this.closeSidebar = document.getElementById("closeSidebar");
    }

    toggle() {
        if (this.menuState === 0) {
            this.menuState = 1;
            this.sidebar.style.width = "0";
            this.closeSidebar.style.marginLeft = "0px";
            this.sidebarBtnIcon.src = "Images/Icons/openIcon.svg";
        } else {
            this.menuState = 0;
            this.sidebar.style.width = "350px";
            this.closeSidebar.style.marginLeft = "350px";
            this.sidebarBtnIcon.src = "Images/Icons/closeIcon.svg";
        }
    }
}

class MemberList {
    constructor(apiEndpoint) {
        this.apiEndpoint = apiEndpoint;
        this.labelMapping = {
            phoneNumber: "Telefon Nummer",
            boatAssigned: "Båd Navn",
            berthAssigned: "Båd Plads",
        };
    }

    fetchMembers() {
        fetch(this.apiEndpoint)
            .then(response => response.json())
            .then(members => {
                this.createMemberList(members);
            })
            .catch(error => {
                console.error('Error fetching members:', error);
                alert('Error fetching members. Please try again later.');
            });
    }

    createMemberList(members) {
        const table = document.getElementById("memberList");
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = ''; // Clear existing rows

        members.forEach(item => {
            const memberRow = tbody.insertRow();
            const memberCell = memberRow.insertCell();
            memberCell.className = "memberCell";

            // Button for the member's name
            const memberName = document.createElement("button");
            memberName.textContent = item.name || 'N/A';
            memberName.className = "nameBtn";
            memberCell.appendChild(memberName);

            // Collapsible info container
            const infoContainer = document.createElement("div");
            memberCell.appendChild(infoContainer);

            // Displaying the phone number
            const phoneCell = document.createElement("div");
            phoneCell.textContent = `${this.labelMapping.phoneNumber}: ${item.phoneNumber || 'N/A'}`;
            phoneCell.className = "infoCell";
            infoContainer.appendChild(phoneCell);

            // Fetch boats and berths if they haven't been loaded
            if (!infoContainer.querySelector(".boatCell")) {
                this.fetchBoatsByMemberId(item.memberID, infoContainer);
            }

            // Add event listener for collapsing/expanding
            memberName.addEventListener("click", function () {
                memberName.classList.toggle('selectedNameBtn');
                const infoCells = infoContainer.querySelectorAll(".infoCell");
                infoCells.forEach(cell => {
                    cell.style.maxHeight = cell.style.maxHeight ? null : cell.scrollHeight + "px";
                });
            });
        });
        searchHandler.updateRows(); // Sørger for at mine dynamisk oprettet tabeller indeholder data.
    }

    fetchBoatsByMemberId(memberId, infoContainer) {
        fetch(`/boats/public/${memberId}`)
            .then(response => response.json())
            .then(boats => {
                if (boats.length > 0) {
                    boats.forEach(boat => {
                        const boatCell = document.createElement("div");
                        boatCell.textContent = `${this.labelMapping.boatAssigned}: ${boat.name || 'N/A'}`;
                        boatCell.className = "infoCell boatCell";
                        infoContainer.appendChild(boatCell);
                        if (!infoContainer.querySelector(".berthCell")) {
                            this.fetchBerthByMemberId(boat.berth, infoContainer);
                        }
                    });

                } else {
                    const noBoatCell = document.createElement("div");
                    noBoatCell.textContent = `${this.labelMapping.boatAssigned}: N/A`;
                    noBoatCell.className = "infoCell boatCell";
                    infoContainer.appendChild(noBoatCell);
                }
            })
            .catch(error => {
                console.error('Error fetching boats:', error);
                alert('Error fetching boat information. Please try again later.');
            });
    }

    fetchBerthByMemberId(BerthID, infoContainer) {
        fetch(`/berths/getBerth/${BerthID}`)
            .then(response => response.json())
            .then(berth => {
                const berthCell = document.createElement("div");
                berthCell.textContent = `${this.labelMapping.berthAssigned}: ${berth && berth.name ? berth.name : 'N/A'}`;
                berthCell.className = "infoCell berthCell";
                infoContainer.appendChild(berthCell);
            })
            .catch(error => {
                console.error('Error fetching berth information:', error);
                const berthCell = document.createElement("div");
                berthCell.textContent = `${this.labelMapping.berthAssigned}: N/A`;
                berthCell.className = "infoCell berthCell";
                infoContainer.appendChild(berthCell);
            });
    }
}

class BerthList {
    constructor(apiEndpoint) {
        this.apiEndpoint = apiEndpoint;
    }

    createBerthList(data) {
        const table = document.getElementById("berthList");
        const tbody = table.createTBody();
        tbody.innerHTML = ''; // Clear existing rows

        let currentSelectedButton = null; // Variable to keep track of the currently selected button
        let selectedButton = null;
        let currenInfoCell = null; // Variable to keep track of the currently selected info cell

        data.forEach(item => {
            // Exclude berths with berthId 9999
            if (item.berthID === 9999) {
                return;
            }

            const row = document.createElement('tr');
            const berthCell = document.createElement('td');
            berthCell.className = 'berthCell'; // Class for styling

            // Button for the berth name
            const berthNameBtn = document.createElement("button");
            berthNameBtn.textContent = item.name || 'N/A';
            berthNameBtn.className = "berthBtn";
            berthCell.appendChild(berthNameBtn);

            // Collapsible info container for berth details
            const infoContainer = document.createElement("div");
            berthCell.appendChild(infoContainer);

            // Display availability information in the collapsible section
            const availabilityCell = document.createElement("div");
            const availabilityText = this.getAvailabilityText(item.availability);
            availabilityCell.textContent = `Tilgængelighed: ${availabilityText}`;
            availabilityCell.className = "infoCell";
            infoContainer.appendChild(availabilityCell);

            // Fetch boat for the berth
            this.fetchBoatByBerthId(item.berthID, infoContainer);

            // Add event listener for expanding/collapsing the info container
            berthNameBtn.addEventListener("click", function () {
                // Check if the clicked button is already the selected button
                if (currentSelectedButton === berthNameBtn) {
                    // If it is, toggle off the CSS and collapse the info cells
                    berthNameBtn.classList.remove('selectedNameBtn');
                    const infoCells = infoContainer.querySelectorAll(".infoCell");
                    infoCells.forEach(cell => cell.style.maxHeight = null);

                    // Reset current selections
                    currentSelectedButton = null;
                    currenInfoCell = null;
                } else {
                    // If a different button is clicked, handle the previous selection
                    if (currentSelectedButton) {
                        currentSelectedButton.classList.remove('selectedNameBtn');
                    }

                    if (currenInfoCell) {
                        currenInfoCell.forEach(cell => cell.style.maxHeight = null);
                    }

                    // Set the clicked button as the new selected button
                    berthNameBtn.classList.add('selectedNameBtn');
                    currentSelectedButton = berthNameBtn;

                    // Expand the associated info cells
                    const infoCells = infoContainer.querySelectorAll(".infoCell");
                    infoCells.forEach(cell => {
                        cell.style.maxHeight = cell.scrollHeight + "px";
                    });

                    currenInfoCell = infoCells;
                }
            });


            searchHandler.updateRows(); // Sørger for at mine dynamisk oprettet tabeller indeholder data.

            // Append berth row to the table body
            row.appendChild(berthCell);
            tbody.appendChild(row);
        });
    }

    getAvailabilityText(availability) {
        switch (availability) {
            case 0:
                return 'Optaget';
            case 1:
                return 'Tilgængelig';
            case 2:
                return 'Midlertidig Utilgængelig';
            default:
                return 'Unknown';
        }
    }

    fetchBerths() {
        fetch(this.apiEndpoint)
            .then(response => response.json())
            .then(data => this.createBerthList(data))
            .catch(error => {
                console.error('Error fetching berths:', error);
            });
    }

    fetchBoatByBerthId(berthId, infoContainer) {
        console.log("Fetching boat for berth ID:", berthId);
        fetch(`/boats/get/${berthId}`)
            .then(response => response.json())
            .then(boat => {
                console.log('Fetched boat:', boat); // Debugging step

                // Ensure the boat name is being accessed correctly
                const boatName = boat && boat.name ? boat.name : 'Ingen båd';

                const boatCell = document.createElement("div");
                boatCell.textContent = `Båd: ${boatName}`;
                boatCell.className = "infoCell";
                infoContainer.appendChild(boatCell);
                this.fetchMemberDetails(boat.memberID, infoContainer);
            })
            .catch(error => {
                console.error('Error fetching boat for berth ID ' + berthId, error);
                const boatCell = document.createElement("div");
                boatCell.textContent = `Båd: Ingen båd`;
                boatCell.className = "infoCell";
                infoContainer.appendChild(boatCell);
            });
    }

    fetchMemberDetails(memberId, infoContainer) {
        if (memberId > 0) {  // Only fetch member details if memberId is valid
            fetch(`/members/public/${memberId}`)
                .then(response => response.json())
                .then(member => {
                    const memberName = member && member.name ? member.name : 'N/A';

                    // Create a cell for member's name and phone number
                    const memberCell = document.createElement("div");
                    memberCell.innerHTML = `Medlem: ${memberName}`;
                    memberCell.className = "infoCell memberCell";
                    infoContainer.appendChild(memberCell);
                })
                .catch(error => {
                    console.error('Error fetching member details:', error);
                    const memberCell = document.createElement("div");
                    memberCell.textContent = `Member: N/A, Phone: N/A`;
                    memberCell.className = "infoCell memberCell";
                    infoContainer.appendChild(memberCell);
                });
        }
    }
}


class HeaderSwitch {
    constructor(berthList) {
        this.berthList = berthList;
    }

    switchView() {
        const berthTable = document.getElementById("berthList");
        berthTable.style.display = 'table';

    }
}

// Instantiate and initialize objects
const sidebar = new Sidebar();
const berthList = new BerthList('/berths/get');
const headerSwitch = new HeaderSwitch(berthList);

// Fetch and display data
berthList.fetchBerths();
headerSwitch.switchView();

// Add sidebar toggle functionality
document.getElementById("sidebarBtn").addEventListener('click', () => sidebar.toggle());

class SearchHandler {
    constructor(searchBarId, berthTableId) {
        // Hent elementerne fra DOM'en
        this.searchBar = document.getElementById(searchBarId);
        this.berthList = document.getElementById(berthTableId);

        // Hent alle rækker i tabellerne via tbody og tr
        this.berthRows = this.berthList.querySelectorAll("tbody tr");

        // Tilføj event listener for 'input' på søgefeltet
        this.searchBar.addEventListener("input", () => this.performSearch());
    }

    // Metode til at udføre selve søgningen
    performSearch() {
        const searchQuery = this.searchBar.value.toLowerCase();

        this.filterRows(this.berthRows, searchQuery, "berth");
    }

    filterRows(rows, searchQuery, tableType) {
        rows.forEach(row => {
            // Typecaster til et array for at kunne bruge forEach method.
            const cells = Array.from(row.querySelectorAll("td"));

            // cells.some tjekker om mindst en af td - table data - felterne indeholder hvad end der er skrevet i searchQuery.
            const match = cells.some(cell => cell.textContent.toLowerCase().includes(searchQuery));
            row.style.display = match ? "" : "none";
        });

        // Hjælper med at opdateret/søge memberListRows eller berthRows afhænigt af hvilken tabel der er valgt.
        if (tableType === "berth") {
            this.berthRows = this.berthList.querySelectorAll("tbody tr");
        }
    }

    // endnu en hjælperfunktion som hjælper med at sørge for at de tomme felter, som der er fra start
    // får data i sig efter de er blevet oprettet. De kaldes på linje 85 og 185
    updateRows() {
        this.berthRows = this.berthList.querySelectorAll("tbody tr");
    }
}

// Opret en instans og giv den de id'er som den skal bruge.
const searchHandler = new SearchHandler(
    "searchBar",
    "berthList"
);


