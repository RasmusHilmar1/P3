export {Berth, Boat, PendingBoat, Member, Table, TableHeader, BtnCreator, IconCreator};

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
        this.element = document.getElementById(elementId); // get the div that the table should be created in
        this.title = title; // the overall title of the table
        this.headers = headers; // the headers for the columns
        this.firstArray = firstArray; // the first data array, e.g. approvedMembers, pendingBoats, etc.
        this.secondArray = secondArray; // the second data array, e.g. to find corresponding member or boat, etc.
        this.colspan = colspan; // colspan for the title.

        this.createTable();
    }

    // function for creating table
    createTable() {
        // creating the structure of the table
        const table = document.createElement("table");
        const tableHead = document.createElement("thead");
        const tableBody = document.createElement("tbody");

        // create title and headers using the TableHeader class
        const tableHeader = new TableHeader(this.title, this.headers, this.colspan);
        console.log(tableHeader);
        tableHead.appendChild(tableHeader.createTitleRow());
        tableHead.appendChild(tableHeader.createHeaderRow());
        table.appendChild(tableHead);

        this.addDataRows(tableBody); //creating rows for the data'
        table.appendChild(tableBody);
        this.element.appendChild(table);
    }

    addDataRows(tableBody) {
        this.firstArray.forEach(item => {
            let row = tableBody.insertRow();
            this.addCells(row, item);
            this.addSpecificCells(row, item);
            row.id = "row_" + this.firstArray.indexOf(item);
            row.className = "infoRows";
            console.log(item);
        });
    }

    addCells(row, data){
        const values = this.extractData(data);
        values.forEach(value => {
            let td = row.insertCell();
            td.className = "infoCells";
            td.innerHTML = value;
        });
    }

    extractData(data){
        return Object.value(data);
    }

    addSpecificCells(row, data, cellContent){
        let cell = row.insertCell();
        cell.innerHTML = cellContent || data;
    }
}

class TableHeader {
    constructor(title, headers, colspan) {
        this.title = title;
        this.headers = headers;
        this.colspan = colspan;
    }

    createHeaderRow() {
        const headerRow = document.createElement("tr");
        this.headers.forEach((header, index) => {
            let th = document.createElement("th");
            th.className = "headercells";
            th.innerHTML = header;
            headerRow.appendChild(th);
        });
        return headerRow;
    }

    createTitleRow() {
        // create the DOM elements
        const titleRow = document.createElement("tr");
        const titleCell = document.createElement("th");

        titleCell.colSpan = this.colspan;
        titleCell.className = "tableTitle";
        titleCell.innerHTML = this.title;
        titleRow.appendChild(titleCell);

        return titleRow;
    }
}

// class for creating buttons
class BtnCreator {
    constructor(row) {
        this.row = row;
    }
    generateBtnId(btnType, data) {
        let buttonCounter = 0;
        switch (btnType) {
            case "Tildel":
                return "addBtn" + data.boat.memberID;
            case "Sendt":
                return "feeSentBtn" + data.boat.boatID;
            case "Betalt":
                return "feePaidBtn" + data.boat.boatID;
            case "Slet":
                return "deleteBoatBtn" + data.boat.boatID;
            case "Accepter":
                return "acceptBtn" + data.member.memberID;
            case "Afvis":
                return "denyBtn" + data.member.memberID;
            default:
                return "btn" + ++buttonCounter; // give a default ID to the button
        }
    }
    createBtn(btnText, data, btnType) {

        const btnElement = document.createElement("button"); // create buttonElement

        btnElement.className = "addBtn";
        btnElement.innerHTML = btnText;
        console.log(btnElement);

        btnElement.id = this.generateBtnId(btnType, data); // generate the ID for the button

        // create cell in row and append the button
        const btnCell = this.row.insertCell();
        btnCell.className = "btnCells";
        btnCell.appendChild(btnElement);

        console.log(`Created button: ID = ${btnElement.id}, Text = "${btnText}"`);
    }
}

// function for creating icons
class IconCreator {
    constructor(iconPaths) {
        this.iconPaths = iconPaths;
    }
    createIcon(type) {
        const icon = document.createElement("img");
        icon.src = this.iconPaths[type]; // reach the type of icon; checkmark or cross
        icon.alt = `${type} icon`;
        return icon;
    }
    appendIconToCell(cell, condition, typeIfTrue, typeIfFalse){
        const icon = this.createIcon(condition ? typeIfTrue : typeIfFalse);
        cell.appendChild(icon);
    }
}