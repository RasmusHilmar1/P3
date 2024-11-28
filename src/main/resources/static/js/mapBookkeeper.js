import {fetchGeoJson, myGeoJson} from "./geojson.js";
import {fetchApprovedMembers, fetchBerth, fetchBoats} from "./fetchMethods.js";

const approvedMembers = await fetchApprovedMembers();
const boats = await fetchBoats();
const berths = await fetchBerth();

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


// Load berth data from the backend
async function loadBerthData() {
    try {
        const response = await fetch('berths/get'); // Replace with your actual API endpoint
        return await response.json();
    } catch (error) {
        console.error('Error fetching berth data:', error);
        return [];
    }
}


// Update GeoJSON data with berth status
async function updateGeoJsonWithStatus() {
    const berths = await loadBerthData();

    // Map berth data to GeoJSON features
    myGeoJson.features.forEach(feature => {
        const berthStatus = berths.find(b => b.name === feature.properties.name);
        feature.properties.status = berthStatus ? berthStatus.availability : 'Unknown';
    });
}
let geoJsonLayer;

// Wait for GeoJSON to be fetched before using it
async function initializeMap() {
    await fetchGeoJson(); // Ensure that the GeoJSON is fetched

    if (myGeoJson) {
        await updateGeoJsonWithStatus(); // Update GeoJSON data with berth statuses

        // Add the updated GeoJSON to the map
        geoJsonLayer = L.geoJSON(myGeoJson, {
            onEachFeature: onEachFeature,
            style: function (feature) {
                const status = feature.properties.status;
                let fillColor;

                switch (status) {
                    case 1:
                        fillColor = "#00FF00";
                        break;
                    case 0:
                        fillColor = "red";
                        break;
                    case 2:
                        fillColor = "orange";
                        break;
                    default:
                        fillColor = "#F2EFE9";// Default color if status is unknown
                }

                return {
                    color: "black",
                    weight: 0.1,
                    fillColor: fillColor,
                    fillOpacity: 0.8
                };
            }
        }).addTo(map);

        memberToMap(geoJsonLayer);

    } else {
        console.error('GeoJSON data not available');
    }
}

// Call initializeMap to start the process
initializeMap();

function onEachFeature(feature, layer) {

    layer.on('click', function(e) {
        highlightBerth(e);
        berthToSideBar(feature);
    });

    layer.featureId = feature.properties.id;
}

let selectedLayer;

function highlightBerth(e) {
    let layer = e.target;
    removeHighlight(layer);
    layer.setStyle({
        color: "blue",
        weight: 2,
        //fillOpacity: 0.5
    });
    selectedLayer = layer;
}


function removeHighlight(layer) {
    if (selectedLayer && (selectedLayer !== layer)){
        selectedLayer.setStyle({
            color: "black",
            weight: 0.1,
        });
    }
}


function berthToSideBar(feature) {
    const memberList = document.getElementById("memberList");
    const rows = memberList.querySelectorAll('tr');

    rows.forEach(row => {
        const memberNameBtn = row.querySelector(".memberBtn");

        if (memberNameBtn) {
            const memberName = memberNameBtn.textContent.trim();

            approvedMembers.forEach(approvedMember => {
                if ((approvedMember.member.name === memberName) && (approvedMember.member.boatownership === true)) {

                    boats.forEach(boat => {
                        if ((approvedMember.member.memberID === boat.memberID) && (boat.berthID === Number(feature.properties.id))) {
                            memberNameBtn.click();
                            memberNameBtn.scrollIntoView();
                        }
                    })
                }
            })
        }
    });
}

function memberToMap(geoJsonLayer){
    const memberList = document.getElementById("memberList");
    memberList.addEventListener("click", (event) => {
        geoJsonLayer.eachLayer(layer => {
            layer.setStyle({
                color: "black",
                weight: 0.1
            })
        })
        const button = event.target.closest(".memberBtn");

        if(button) {
            const memberName = button.textContent.trim();
            console.log("button:", button);
            console.log("memberName:", memberName);

            approvedMembers.forEach(approvedMember => {
                if ((approvedMember.member.name === memberName) && (approvedMember.member.boatownership === true)) {

                    boats.forEach(boat => {
                        if ((approvedMember.member.memberID === boat.memberID) && (boat.berthID !== 9999)) {
                            geoJsonLayer.eachLayer(layer => {

                                if (Number(layer.featureId) === boat.berthID) {
                                    /*if((layer.options.color === "blue") && (layer.options.weight === 2)) {
                                        layer.setStyle({
                                            color: "black",
                                            weight: 0.1
                                        })
                                    } else {*/

                                        layer.setStyle({
                                            color: "blue",
                                            weight: 2
                                        })
                                    //}
                                }/* else {
                                    layer.setStyle({
                                        color: "black",
                                        weight: 0.1
                                    })
                                }*/
                            })
                        }
                    });
                }
            })
        }
    })

}
