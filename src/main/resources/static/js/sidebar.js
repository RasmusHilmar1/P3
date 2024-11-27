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

class BerthList {
    constructor(apiEndpoint) {
        this.apiEndpoint = apiEndpoint;
    }

    createBerthList(data) {
        const table = document.getElementById("berthList");
        const tbody = table.createTBody();
        tbody.innerHTML = ''; // Clear existing rows

        let currentSelectedButton = null; // Variable to keep track of the currently selected button
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
                const infoCells = infoContainer.querySelectorAll(".infoCell");
                console.log(infoCells);
                // Remove the 'selectedNameBtn' class from the previously selected button, if any
                if (currentSelectedButton && currentSelectedButton !== berthNameBtn) {
                    currentSelectedButton.classList.remove('selectedNameBtn');
                }

                if(currenInfoCell && currenInfoCell !== infoCells) {
                    currenInfoCell.forEach(cell => cell.style.maxHeight = null);
                }

                currenInfoCell = infoCells; // Update the current info cell

                // Toggle the 'selectedNameBtn' class on the newly clicked button
                berthNameBtn.classList.toggle('selectedNameBtn');

                // Set the current button as the selected button
                currentSelectedButton = berthNameBtn;

                // Toggle the visibility of the info container

                infoCells.forEach(cell => {
                    cell.style.maxHeight = cell.style.maxHeight ? null : cell.scrollHeight + "px";
                });
            });

            searchHandler.updateRows();

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
                const boatName = boat && boat.name ? boat.name : 'N/A';

                const boatCell = document.createElement("div");
                boatCell.textContent = `Båd: ${boatName}`;
                boatCell.className = "infoCell";
                infoContainer.appendChild(boatCell);
                this.fetchMemberDetails(boat.memberID, infoContainer);
            })
            .catch(error => {
                console.error('Error fetching boat for berth ID ' + berthId, error);
                const boatCell = document.createElement("div");
                boatCell.textContent = `Boat: N/A`;
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
                    const memberPhone = member && member.phoneNumber ? member.phoneNumber : 'N/A';

                    // Create a cell for member's name and phone number
                    const memberCell = document.createElement("div");
                    memberCell.textContent = `Medlem: ${memberName}, Telefon Nummer: ${memberPhone}`;
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


