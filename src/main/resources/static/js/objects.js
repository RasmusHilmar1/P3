export {Berth, Boat, Member, Table};

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
    constructor(boatID, memberID, berthID, name, type, manufacturer, length, width, draught, insurance){
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
    constructor(elementId, title, headers, array) {
        this.element = document.getElementById(elementId);
        this.title = title;
        this.headers = headers;
        this.array = array;

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
        tableHeadCell.innerHTML = this.title;
        tableHeadCell.colSpan = 5;
        tableHead.appendChild(tableHeadCell);
        table.appendChild(tableHead);

        //Adding header rows to differentiate between content
        const headerRow = document.createElement("tr");
        this.headers.forEach(item => {
            let th = headerRow.insertCell();
            th.innerHTML = item;
            console.log(item);
        });
        table.appendChild(headerRow);

        //creating rows for the data
        this.addDataRows(this.array, tableBody);

        table.appendChild(tableBody);

        this.element.appendChild(table);
    }
    addDataRows(array, tableBody) {
        array.forEach(item => {
            let row = tableBody.insertRow();
            this.addCells(row, item);
            console.log(item);
        });
    }
    addCells(row, data){
        Object.values(data).forEach(value => {
            let td = row.insertCell();
            td.innerHTML = value;// Access data using item within forEach
        });
    }
}


