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
        fetch(`/Berths/getBerth/${BerthID}`)
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

        data.forEach(item => {
            // Exclude berths with berthId 9999
            if (item.berthID=== 9999) {
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
                berthNameBtn.classList.toggle('selectedNameBtn');
                const infoCells = infoContainer.querySelectorAll(".infoCell");
                infoCells.forEach(cell => {
                    cell.style.maxHeight = cell.style.maxHeight ? null : cell.scrollHeight + "px";
                });
            });

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
    constructor(memberList, berthList) {
        this.memberList = memberList;
        this.berthList = berthList;
    }

    switchView() {
        const memberTable = document.getElementById("memberList");
        const berthTable = document.getElementById("berthList");
        const memberBtn = document.getElementById("memberBtn");
        const berthBtn = document.getElementById("berthBtn");

        memberBtn.addEventListener('click', () => {
            memberTable.style.display = 'table';
            berthTable.style.display = 'none';
        });

        berthBtn.addEventListener('click', () => {
            berthTable.style.display = 'table';
            memberTable.style.display = 'none';
        });
    }
}

// Instantiate and initialize objects
const sidebar = new Sidebar();
const memberList = new MemberList('/api/sidebar/approved-members');
const berthList = new BerthList('/Berths/get');
const headerSwitch = new HeaderSwitch(memberList, berthList);

// Fetch and display data
memberList.fetchMembers();
berthList.fetchBerths();
headerSwitch.switchView();

// Add sidebar toggle functionality
document.getElementById("sidebarBtn").addEventListener('click', () => sidebar.toggle());