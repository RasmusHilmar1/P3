export {Berth, Boat, PendingBoat, Member, Table, BtnCreator, IconCreator};

// Classes for the different objects from database
class Berth {
    constructor(berthID, name, availability, length, width, depth, pierId){
        this.berthID = berthID;
        this.name = name;
        this.availability = availability;
        this.length = length;
        this.width = width;
        this.depth = depth;
        this.pierId = pierId;
    }
}

class Boat {
    constructor(boatID, memberID, berthID, name, type, manufacturer, length, width, draught, insurance, feeSent, feePaid){
        this.boatID = boatID;
        this.memberID = memberID;
        this.berthID = berthID;
        this.name = name;
        this.type = type;
        this.manufacturer = manufacturer;
        this.length = length;
        this.width = width;
        this.draught = draught;
        this.insurance = insurance;
        this.feeSent = feeSent;
        this.feePaid = feePaid;
    }
}

class PendingBoat {
    constructor(id, boat){
        this.id = id;
        this.boat = {
            boatID: boat.boatID,
            memberID: boat.memberID,
            berthID: boat.berthID,
            name: boat.name,
            type: boat.type,
            manufacturer: boat.manufacturer,
            length: boat.length,
            width: boat.width,
            draught: boat.draught,
            insurance: boat.insurance,
            feeSent: boat.feeSent,
            feePaid: boat.feePaid,
        }
    }
}

class Member {
    constructor(id, member){
        this.id = id;
        this.member = {
            memberID: member.memberID,
            name: member.name,
            address: member.address,
            email: member.email,
            dateofbirth: member.dateofbirth,
            phonenumber: member.phonenumber,
            boatownership: member.boatownership,
        }
    }
}

// class for a table
class Table {
    constructor(elementId, title, headers, firstArray, secondArray, colspan) {
        this.element = document.getElementById(elementId);
        console.log(this.element);
        this.title = title;
        this.headers = headers;
        this.firstArray = firstArray;
        console.log("Data parsed to createTable:", this.firstArray);
        this.secondArray = secondArray;
        console.log("Data parsed as second array:", this.secondArray);
        this.colspan = colspan;

        this.createTable();
    }

    // function for creating table
    createTable() {
        // creating the structure of the table
        const table = document.createElement("table");
        const tableHead = document.createElement("thead");
        const tableBody = document.createElement("tbody");

        // creating the header for the table
        const tableHeadRow = tableHead.insertRow();
        const tableHeadCell = tableHeadRow.insertCell();
        tableHeadCell.className = "tableTitle";
        tableHeadCell.innerHTML = this.title;
        console.log(this.title);
        tableHeadCell.colSpan = this.colspan;
        tableHead.appendChild(tableHeadCell);
        table.appendChild(tableHead);

        //Adding header rows to differentiate between content
        const headerRow = document.createElement("tr");
        this.headers.forEach((item, index) => {
            let th = headerRow.insertCell();
            th.className = index < 4 ? "headerCellsLeft" : "headerCellsCenter";
            th.innerHTML = item;
            console.log(item);
        });
        table.appendChild(headerRow);

        //creating rows for the data
        this.addDataRows(this.firstArray, tableBody);

        table.appendChild(tableBody);

        this.element.appendChild(table);
    }
    addDataRows(array, tableBody) {
        array.forEach(item => {
            let row = tableBody.insertRow();
            row.id = "row_" + array.indexOf(item);
            row.className = "infoRows";
            this.addCells(row, item);
            this.addSpecificCells(row, item);
            console.log(item);
        });
    }
    addCells(row, data){
        Object.values(data).forEach(value => {
            let td = row.insertCell();
            td.className = "infoCells";
            td.innerHTML = value;// Access data using item within forEach
        });
    }
    addSpecificCells(row, data){
        let newCell = row.insertCell();
        newCell.innerHTML = data;
    }
}

class BtnCreator {
    constructor(row, data, btnText) {
        this.row = row;
        this.data = data;
        this.btnText = btnText;
    }

    createBtn() {
        let buttonCell = this.row.insertCell();
        buttonCell.className = "btnCells";
        let buttonContainer = document.createElement("a");
        let buttonElement = document.createElement("button");

        // give the buttons a class name
        buttonElement.classList.add("addBtn");
        buttonElement.innerHTML = this.btnText;

        if (this.btnText === "Tildelt") {
            buttonElement.id = "addBtn" + this.data.boat.boatID;
            console.log(buttonElement.id);
        } else if (this.btnText === "Sendt") {
            buttonElement.id = "feeSentBtn" + this.data.boat.boatID;
            console.log(buttonElement.id);
        } else if (this.btnText === "Betalt") {
            buttonElement.id = "feePaidBtn" + this.data.boat.boatID;
            console.log(buttonElement.id);
        } else if (this.btnText.includes("AcceptBtnIcon")){
            buttonElement.id = "acceptBtn" + this.data.member.memberID;
        } else if (this.btnText.includes("DenyBtnIcon")){
            buttonElement.id = "denyBtn" + this.data.member.memberID;
        }


        buttonContainer.appendChild(buttonElement);
        buttonCell.appendChild(buttonContainer);

        console.log(buttonElement.id);
    }
}

// function for creating icons
class IconCreator {
    constructor(row, boat) {
        this.row = row;
        this.boat = boat;
    }

    createCell() {
        this.iconCell = this.row.insertCell();
        this.iconCell.className = "iconCells";
    }

    createIcons(data) {
        const checkmark = document.createElement("img");
        checkmark.src = "http://localhost:8080/Images/Icons/AcceptBtnIcon.png";
        const cross = document.createElement("img");
        cross.src = "http://localhost:8080/Images/Icons/DenyBtnIcon.png";
        // vessel inspector corresponding cell to "Sendt"
        if (data === this.boat.boat.feeSent) {
            if (data === 1) {
                this.iconCell.appendChild(checkmark);
            } else if (data === 0) {
                this.iconCell.appendChild(cross);
            }
        }
        // vessel inspector corresponding cell to "Betalt"
        else if (data === this.boat.boat.feePaid) {
            if (data === 1) {
                this.iconCell.appendChild(checkmark);
            } else if (data === 0) {
                this.iconCell.appendChild(cross);
            }
        }
        // bookkeeper corresponding cell to "Tildelt"
        else if (data === this.boat.boat.berthID) {
            if (data !== 9999) {
                this.iconCell.appendChild(checkmark);
            } else {
                this.iconCell.appendChild(cross);
            }
        }
    }
}





