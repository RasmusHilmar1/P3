import {myGeoJson} from "./geojson.js";
import {fetchApprovedMembers, fetchBoats, fetchBerth} from "./memberFetch.js";

// Create map for leaflet -->
var map = L.map('map', {
    minZoom: 17,
    maxZoom: 23
});

// Set the center for when you open the application-->
map.setView([57.05778747921157, 9.902244340136367], 18);

// Use map from OSM -->
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://tile.openstreetmap.org/">OpenMapTiles</a>'
}).addTo(map);

// Initialize the bounds of the image used for overlay -->
var imageBounds = [
    [57.05861, 9.89969], // Top-left
    [57.05692, 9.90523]  // Bottom-right
];

// Get picture for overlay -->
//var imageUrl = '../../Images/vestre_badelaug_kort_kopi.jpeg';

// Create image overlay -->
//var imageOverlay = L.imageOverlay(imageUrl, imageBounds).addTo(map);

//Initialize bounds for map as the bounds of picture in coordinates -->
const bounds = L.latLngBounds(
    [57.05861, 9.89969],
    [57.05692, 9.90523]
);

// Set the max bounds for navigating map as the bounds of picture -->
map.setMaxBounds(bounds);

const harbor1 = document.getElementById("vestreBaadehavn");
harbor1.addEventListener("click", function(event) {
    event.preventDefault();

    var imageBounds = [
        [57.05861, 9.89969], // Top-left
        [57.05692, 9.90523]  // Bottom-right
    ];

    //var imageUrl = '../../Images/vestre_badelaug_kort_kopi.jpeg';

    //var imageOverlay = L.imageOverlay(imageUrl, imageBounds).addTo(map);

    const bounds = L.latLngBounds(
        [57.05861, 9.89969],
        [57.05692, 9.90523]
    );

    map.setMaxBounds(bounds);

});


//Hvis knappen for "skudehavn" trykket vil kortet for den havn vises
const harbor2 = document.getElementById("skudehavn");


harbor2.addEventListener("click", function(event) {

    var imageBounds2 = [
        [57.060017, 9.893899], // Top-left
        [57.057100, 9.898600]  // Bottom-right
    ];

    //var imageUrl2 = '../../Images/skudehavn.jpeg';
    //var imageOverlay2 = L.imageOverlay(imageUrl2, imageBounds2).addTo(map);

    const bounds2 = L.latLngBounds(
        [57.060017, 9.893899], // Top-left
        [57.057100, 9.898600]
    );

    map.setMaxBounds(bounds2);

});


// Move zoom buttons -->
map.zoomControl.setPosition('bottomright');




//const btnHarbor1 = document.querySelector('.vestreBaadehavn');
//const btnHarbor2 = document.querySelector('.skudehavn');
const harbors = document.getElementById('harbor');

harbors.addEventListener('click', function (event) {
    if(event.target.classList.contains('btnHarbor')) {
        const btnHarbors = harbors.querySelectorAll('.btnHarbor');
        btnHarbors.forEach(btnHarbors => btnHarbors.classList.remove('pressed'));

        event.target.classList.add('pressed');
    }
});


L.geoJSON(myGeoJson, {
    onEachFeature: onEachFeature,
    style: function(feature) {
        var status = feature.properties.status;

        var fillColor;

        if (status === "Available") {
            fillColor = "#00FF00";
        } else if (status === "Unavailable") {
            fillColor = "red";
        } else if (status === "TempAvailable") {
            fillColor = "orange";
        } else if (status === "Structure") {
            fillColor = "white";
        }

        return {
            //color: "#00bfff",    // Sets the border color to black
            color: "black",
            weight: 0.1,         // Adjusts border thickness
            fillColor: fillColor,
            fillOpacity: 0.8   // Adjusts fill opacity
        };
    }
}).addTo(map);


const approvedMembers = await fetchApprovedMembers();
console.log("members info:" + JSON.stringify(approvedMembers));

const boats = await fetchBoats();
console.log("boats" + boats);
//console.log("boatID" + boats.name);

const berths = await fetchBerth();
console.log("berths" + berths);


function onEachFeature(feature, layer) {
    //console.log(feature.properties);
    layer.on('click', function(e) {
        var memberList = document.getElementById("memberListBoat");
        const rows = memberList.querySelectorAll('tr');
        console.log("memberList: " + memberList);
        console.log("rows: " + rows);

        rows.forEach(row => {
            const memberCell = row.querySelector(".memberCell");
            console.log("memberCell: " + memberCell.innerHTML);

            //if (memberCell) {
            //const memberName = memberCell.textContent.trim();
            //console.log("memberName:" + memberName);
            approvedMembers.forEach(approvedMember => {
                const memberName = row.querySelector(`#memberName${approvedMember.member.memberID}`);
                //console.log("memberCell: " + memberCell.innerHTML);

                if(memberName) {
                    const memberNameId = memberName.id;
                    const id = memberNameId.replace("memberName", "");
                    console.log(id);

                    //if (id === approvedMember.member.memberID) {
                    //  console.log("id match member");
                    boats.forEach(boat => {
                        if ((Number(id) === boat.memberID) && (boat.berthID !== 9999) && (boat.berthID === Number(feature.properties.id))) {
                            memberCell.click();
                            console.log("membercell clicked");
                        }
                    });
                    //}
                }
            });

            //}
        });

        /*
        document.getElementById("berthId").innerHTML = feature.properties.id;
        document.getElementById("berthName").innerHTML = feature.properties.name;
        document.getElementById("berthStatus").innerHTML = feature.properties.status;
         */
    });
}





