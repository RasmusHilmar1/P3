export {Berth, Boat, PendingBoat, Member, Table};

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
    findCorrespondingMember(memberID){ // could maybe be edited into a more general "findCorrespondingObject" or something
        const member = this.secondArray.find(member => member.memberID === memberID);
        return member? member.name : "Unknown Member";
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





