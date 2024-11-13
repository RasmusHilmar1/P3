let memberData = [
    { id: 2001, name: "Mads Hansen Ludvigsen", boatOwner: "yes", boatId: 3001, phoneNumber1: "xxxxxxxx", phoneNumber2: "xxxxxxxx"},
    { id: 2002, name: "Line Mouritzen", boatOwner: "yes", boatId: 3002, phoneNumber1: "xxxxxxxx", phoneNumber2: null},
    { id: 2003, name: "Hans Gudenå Petersen", boatOwner: "yes", boatId: 3003, phoneNumber1: "xxxxxxxx", phoneNumber2: null},
    { id: 2004, name: "Karsten Peter Schou", boatOwner: "no", boatId: null, phoneNumber1: "xxxxxxxx", phoneNumber2: null }
];

let boatData =[
    {id: 3001, owner: "Mads Hansen Ludvigsen", name:"Frida", length: "2", width: "1.5", areal: "3", berthId: 1001},
    {id: 3002, owner: "Line Mouritzen", name: "Silje", length: "3", width: "2", areal: "6", berthId: 1002},
    {id: 3003, owner: "Hans Gudenå Petersen", name: "Maja", length: "4", width: "3", areal: "12", berthId: 1003},
];

let berthData = [
    { id: 1001, address: "Fiskerbo Plads 01", length: "3", width: "2", areal: "6"},
    { id: 1002, address: "Fiskerbo Plads 02", length: "4", width: "3", areal: "12"},
    { id: 1003, address: "FiskerboPlads 03", length: "5", width: "4", areal: "20"},
];

function calculateUtilization(){
    berthData.forEach(berth => {
        let boat = boatData.find(boat => boat.berthId === berth.id);

        if (boat) {
            berth.utilizationPercentage = ((boat.areal / berth.areal) * 100).toFixed(2) + "%";
        } else {
            berth.utilizationPercentage = "";
        }
    });
}

function addCells(tr, data){
    // Iterate over the data
    data.forEach(function(item){
        var td = tr.insertCell();
        td.textContent = item;
    });
}

function getBerthList(){
    var table = document.getElementById("berthListBody");

    calculateUtilization();

    //For each berth, create a row and add the data
    berthData.forEach(function (item){
        var row = table.insertRow();
        addCells(row, [item.id, item.address, item.length + "m", item.width + "m",  item.areal + "m", item.utilizationPercentage]);

    });
}

// Ensure the function runs after the DOM is fully loaded
window.onload = function() {
    getBerthList();
};