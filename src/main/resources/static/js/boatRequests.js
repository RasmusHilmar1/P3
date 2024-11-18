//Test data
let requestsData = [
    { id: 1001, name: "Mads Hansen Ludvigsen", boatAssigned: "no", feeSent: "no", feePaid: "no" },
    { id: 1002, name: "Line Mouritzen", boatAssigned: "yes", feeSent: "yes", feePaid: "no"},
    { id: 1003, name: "Hans Gudenå Petersen", boatAssigned: "no", feeSent: "yes", feePaid: "yes"},
];

//Helper function for adding cells to a table dynamically
function addCells(tr, data){
    // Iterate over the data
    data.forEach(function(item, index){
        var td = tr.insertCell();

        // Create buttons in the cells from index 2 and up, else add the data from the array
        if (index === 2) {
            //create buttons for distributing berths
            var buttonContainer = document.createElement("a");
            var buttonElement = document.createElement("button");
            buttonElement.textContent = "Tildel plads";
            buttonElement.classList.add("distributeBerthsBtn");
            buttonElement.id = "distributeBerthsBtn";
            buttonContainer.appendChild(buttonElement);
            td.appendChild(buttonContainer);
            buttonContainer.setAttribute("href", "vesselInspectorStartPage.html"); //Remember to change this to the correct page. Should the vessel inspector be able to distribute berths from his startpage?
        } else if (index > 2) {
            //create icons to see the progress of the tasks of the bookkeeper
            var cellIcon = document.createElement("img");
            cellIcon.id = "iconsBoatRequests";
            cellIcon.classList.add("iconsBoatRequests");
            if (data[index] === 'yes'){
                cellIcon.src = '/Images/Icons/AcceptBtnIcon.png'; // Remember to find correct icons and add them to the folder
            } else if (data[index] === 'no'){
                cellIcon.src = '/Images/Icons/DenyBtnIcon.png'; // Remember to find correct icons and add them to the folder
            }
            td.appendChild(cellIcon);
        } else {
            //create text-content of data
            td.textContent = item;
        }
    });
}

//Function for getting information and adding it to the table
function getBoatRequests(){
    var table = document.getElementById("boatRequestsBody");

    //For each element in the array of data there is added a new row with the data
    requestsData.forEach(function (item){
        var row = table.insertRow();
        addCells(row, [item.id, item.name, item.boatAssigned, item.feeSent,  item.feePaid]);
    });
}

getBoatRequests();