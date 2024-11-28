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
            case "Tildelt":
                return "addBtn" + data.boat.boatID;
            case "Sendt":
                return "feeSentBtn" + data.boat.boatID;
            case "Betalt":
                return "feePaidBtn" + data.boat.boatID;
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

// Old classes:

// function for creating table
/*class Table {
    constructor(elementId, title, headers, firstArray, secondArray, colspan) {
        this.element = document.getElementById(elementId); // get the div that the table should be created in
        this.title = title; // the overall title of the table
        this.headers = headers; // the headers for the columns
        this.firstArray = firstArray; // the first data array, e.g. approvedMembers, pendingBoats, etc.
        this.secondArray = secondArray; // the second data array, e.g. to find corresponding member or boat, etc.
        this.colspan = colspan; // colspan for the title.

        this.createTable();
    }
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
addSpecificCells(row, data, cellContent){
    let newCell = row.insertCell();
    newCell.innerHTML = cellContent || data;
}
}*/

// class for creating buttons
/*class BtnCreator {
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
} */

/* class IconCreator {
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
} */