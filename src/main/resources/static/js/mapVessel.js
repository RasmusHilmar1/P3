import {fetchGeoJson, myGeoJson} from "./geojson.js";
import {fetchApprovedMembers, fetchBerth, fetchBoats} from "./fetchMethods.js";

const approvedMembers = await fetchApprovedMembers();
const boats = await fetchBoats();
const berths = await fetchBerth();

// Create map for leaflet -->
var map = L.map('map');

// Set the center for when you open the application-->
map.setView([57.05986605976934, 9.901956256639835], 15.5);


// Use map from OSM -->
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://tile.openstreetmap.org/">OpenMapTiles</a>',
    maxZoom: 20,
    minZoom: 18
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

function addGuestArea() {
    var guestAreaBounds = [
        [57.05742346980074, 9.90033925763862],
        [57.05734201796358, 9.90061552466426],
        [57.05728567822284, 9.900799976274303],
        [57.05732832447959, 9.900841314225922],
        [57.057682352673424, 9.90090670180615],
        [57.05775435796488, 9.900683763958938],
        [57.05742346980074, 9.90033925763862]
    ];

// Add an orange polygon for the guest area
    L.polygon(guestAreaBounds, {
        color: "purple",
        weight: 1,
        fillOpacity: 0.7
    }).addTo(map);
}

addGuestArea();


const harbor1 = document.getElementById("vestreBaadehavn");
if (harbor1) {
    harbor1.addEventListener("click", function(event) {
        event.preventDefault();

        const bounds = L.latLngBounds(
            [57.05861, 9.89969],
            [57.05692, 9.90523]
        );

        map.setMaxBounds(bounds);
    });
}

//Hvis knappen for "skudehavn" trykket vil kortet for den havn vises
const harbor2 = document.getElementById("skudehavn");
if (harbor2) {
    harbor2.addEventListener("click", function(event) {
        const bounds2 = L.latLngBounds(
            [57.06018973534202, 9.894721266122263],
            [57.057196830597924, 9.897628780728576]
        );

        map.setMaxBounds(bounds2);

        map.setView([57.05885016317979, 9.895671278476893], 15.5);
    });
}

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
                        fillColor = "LimeGreen";
                        break;
                    case 0:
                        fillColor = "Crimson";
                        break;
                    default:
                        fillColor = "#F2EFE9";// Default color if status is unknown
                }

                return {
                    color: "black",
                    weight: 0.3,
                    fillColor: fillColor,
                    fillOpacity: 1
                };
            }
        }).addTo(map);

        memberToMap(geoJsonLayer);
        berthListsToMap(geoJsonLayer);

    } else {
        console.error('GeoJSON data not available');
    }
}

// Call initializeMap to start the process
initializeMap();

function onEachFeature(feature, layer) {
    // Check if the feature has a valid name property
    const name = feature.properties?.name || ""; // Fallback to an empty string if undefined
    const isPier = name.toLowerCase().startsWith("pier"); // Case-insensitive check

    layer.on('click', function (e) {
        if (!isPier) {
            // Allow highlighting only for berths
            highlightBerth(e);
            mapToThreeLists(feature);
            mapToMemberList(feature);

            updateSidebarWithBerth(feature.properties);
        } else {
            console.log("Highlighting disabled for piers.");
        }
    });

    layer.featureId = feature.properties?.id; // Safely assign feature ID
    // Funktion til at opdatere sidebaren med det klikkede berth
    function updateSidebarWithBerth(berth) {
        const berthList = document.getElementById("berthList");
        if (!berthList) {
            console.error("berthList elementet blev ikke fundet.");
            return;
        }

        const rows = berthList.querySelectorAll('tr');
        const scrolledIntoViewOptions = {
            behavior: 'smooth', // Glidende scroll
            block: 'center', // Placer elementet vertikalt i midten
            inline: 'center' // Placer elementet horisontalt i midten
        };

        rows.forEach(row => {
            const berthNameBtn = row.querySelector(".berthBtn");
            const infoContainer = row.querySelector(".infoCell"); // Antag, at infoCell er tilknyttet rækken

            if (berthNameBtn) {
                const berthName = berthNameBtn.textContent.trim();

                // Sammenlign `berth.name` med knaptekst for at finde match
                if (berthName === berth.name) {
                    berthNameBtn.scrollIntoView(scrolledIntoViewOptions); // Scroll knappen i fokus

                    // Åbn infoContainer eksplicit
                    if (infoContainer && !infoContainer.style.maxHeight) {
                        infoContainer.style.maxHeight = infoContainer.scrollHeight + "px";
                    }

                    // Tilføj CSS til den aktive knap, hvis den ikke allerede har det
                    if (!berthNameBtn.classList.contains("selectedNameBtn")) {
                        berthNameBtn.click(); // Simuler klik for at tilføje yderligere handlinger (hvis nødvendigt)
                    }
                }
            }
        });
    }
}

let selectedLayer;

function highlightBerth(e) {
    let layer = e.target;
    removeHighlight();
    layer.setStyle({
        color: "blue",
        weight: 2,
        //fillOpacity: 0.5
    });
    selectedLayer = layer;
}

function removeHighlight() {
    // Reset all layers to default style
    if (geoJsonLayer) {
        geoJsonLayer.eachLayer(layer => {
            layer.setStyle({
                color: "black",
                weight: 0.3,
                fillOpacity: 1, // Default opacity
            });
        });
    }

    // Clear the selected layer reference
    selectedLayer = null;
}


function mapToMemberList(feature) {
    const tables = document.querySelectorAll(".memberList");

    tables.forEach(table => {
        const rows = table.querySelectorAll("tr");

        rows.forEach(row => {
            const nameBtn = row.querySelector(".nameBtn");
            console.log("nameBtn: " + nameBtn.outerHTML);

            if (nameBtn) {
                const memberId = nameBtn.id.replace("memberName", "");

                boats.forEach(boat => {
                    if ((Number(memberId) === boat.memberID) && (boat.berthID !== 9999) &&
                        (boat.berthID === Number(feature.properties.id)) && (table.style.display === "table")) {
                            nameBtn.scrollIntoView(scrolledIntoViewOptions);
                            nameBtn.click();
                    }
                })
            }
        });
    });

}

const scrolledIntoViewOptions = {
    behavior: 'smooth', // Enables smooth scrolling
    block: 'center', // Scroll the element to the center of the viewport
    inline: 'center' // Align the element horizontally to the center
};

function mapToThreeLists(feature){
    const tables = document.querySelectorAll("[id^='berthList']");

    tables.forEach(table => {
        const rows = table.querySelectorAll("tr");

        rows.forEach(row => {
            const berthNameBtn = row.querySelector(".berthBtn");
            //console.log("berthNameBtn: " + berthNameBtn);
            if (berthNameBtn) {
                const berthName = berthNameBtn.textContent.trim();
                //console.log("berthName: " + berthName);

                if ((berthName === feature.properties.name) && (table.style.display === "table")) {
                    berthNameBtn.scrollIntoView(scrolledIntoViewOptions);
                    berthNameBtn.click();
                }
            }
        });
    });

}

function memberToMap(geoJsonLayer){
    const memberList = document.getElementById("memberListBoat");

    memberList.addEventListener("click", (event) => {
        removeHighlight(); // Clear all highlights

        const button = event.target.closest(".nameBtn");
        console.log("button member: " + button.outerHTML);

        if(button) {
            const memberId = button.id.replace("memberName", "");

            boats.forEach(boat => {
                if ((Number(memberId) === boat.memberID) && (boat.berthID !== 9999)) {
                    geoJsonLayer.eachLayer(layer => {
                        const name = layer.feature?.properties?.name || "";
                        const isPier = name.toLowerCase().startsWith("pier");
                        if(Number(layer.featureId) === boat.berthID && !isPier) {
                            layer.setStyle({
                                color: "blue",
                                weight: 2
                            });
                            selectedLayer = layer;
                            //console.log("fundet");
                        /*} else {
                            layer.setStyle({
                                color: "black",
                                weight: 0.1
                            })*/
                        }
                    })
                }
            });
        }
    });

}

function berthListsToMap(geoJsonLayer){
    const berthList = document.getElementsByClassName("berthList");

    for(let i = 0; i < berthList.length; i++) {
        berthList[i].addEventListener("click", (event) => {
            // Clear all highlights
            removeHighlight();

            const berthBtn = event.target.closest(".berthBtn");
            console.log("button: " + berthBtn.outerHTML);

            if (berthBtn) {
                const berthName = berthBtn.textContent.trim();

                berths.forEach(berth => {
                    if (berthName === berth.name) {
                        geoJsonLayer.eachLayer(layer => {
                            const name = layer.feature?.properties?.name || "";
                            const isPier = name.toLowerCase().startsWith("pier");

                            if (Number(layer.featureId) === berth.berthID && !isPier) {
                                layer.setStyle({
                                    color: "blue",
                                    weight: 2
                                });
                                selectedLayer=layer;
                            }
                        });
                    }
                });
            }
        });
    }
}
export async function colorButtons(member, boat, berths) {
    try {
        // API call to get compatible berths for the given boat dimensions
        const response = await fetch(`/berths/find?length=${boat.length}&width=${boat.width}`);
        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }

        // Parse the response to get compatible berths
        const compatibleBerths = await response.json();

        console.log("Compatible berths:", compatibleBerths);

        // Loop through GeoJSON features and update styles for compatible berths
        myGeoJson.features.forEach(feature => {
            // Skip features that are not berths
            console.log(feature.properties);
            if (feature.properties.name.startsWith("Pier")) {
                return;
            }

            const compatibleBerth = compatibleBerths.find(b => b.berth.name === feature.properties.name);
            console.log(compatibleBerth);

            // Find the corresponding layer for this GeoJSON feature
            const layer = getLayerByFeature(feature);

            if (compatibleBerth) {
                // Update status with the availability returned by the API
                feature.properties.color = compatibleBerth.color;
                console.log("Berth status updated:", feature.properties.color);
                const { red, green, blue } = feature.properties.color;

                if (layer) {
                    layer.setStyle({
                        color: "black",
                        weight: 0.1,
                        fillColor: `rgb(${red}, ${green}, ${blue})`,
                        fillOpacity: 1
                    });
                }
            } else if (layer) {
                layer.setStyle({
                    color: "black",
                    weight: 0.1,
                    fillColor: "red",
                    fillOpacity: 1
                });
            }
        });
    } catch (error) {
        console.error("Error in colorButtons:", error);
    }
}

// Helper function to retrieve a layer from a GeoJSON feature
function getLayerByFeature(feature) {
    let targetLayer = null;

    map.eachLayer(layer => {
        if (layer.feature && layer.feature.properties.name === feature.properties.name) {
            targetLayer = layer;
        }
    });

    return targetLayer;
}
