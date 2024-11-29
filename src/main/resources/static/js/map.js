// map.js

import { myGeoJson, fetchGeoJson } from "./geojson.js";
import { fetchApprovedMembers, fetchBoats, fetchBerth } from "./fetchMethods.js";

// Create map for Leaflet
var map = L.map('map', {});

// Set the center when the application opens
map.setView([57.057740645009346, 9.901853509671989], 18.5);

// Use map from OpenStreetMap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 20,
    minZoom: 18
}).addTo(map);

// Define the bounds for the map
const bounds = L.latLngBounds(
    [57.05861, 9.70969],
    [57.05692, 9.99093]
);

// Set the max bounds for navigating the map
map.setMaxBounds(bounds);

// Add Guest Area
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

    // Add a polygon for the guest area
    L.polygon(guestAreaBounds, {
        color: "purple",
        weight: 1,
        fillOpacity: 0.7
    }).addTo(map);
}

addGuestArea();

// Harbor button event listeners
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

const harbor2 = document.getElementById("skudehavn");
if (harbor2) {
    harbor2.addEventListener("click", function(event) {
        const bounds2 = L.latLngBounds(
            [57.06018973534202, 9.894721266122263],
            [57.057196830597924, 9.897628780728576]
        );

        map.setMaxBounds(bounds2);

        map.setView([57.05895016317979, 9.895671278476893], 18.2);
    });
}

// Move zoom buttons to the bottom right
map.zoomControl.setPosition('bottomright');

// Harbor button styling
const harbors = document.getElementById('harbor');
if (harbors) {
    harbors.addEventListener('click', function (event) {
        if(event.target.classList.contains('btnHarbor')) {
            const btnHarbors = harbors.querySelectorAll('.btnHarbor');
            btnHarbors.forEach(btnHarbor => btnHarbor.classList.remove('pressed'));

            event.target.classList.add('pressed');
        }
    });
}

// Load berth data from the backend
async function loadBerthData() {
    try {
        const response = await fetch('/berths/get'); // Ensure the correct API endpoint with a leading slash
        const berths = await response.json();
        return berths;
    } catch (error) {
        console.error('Error fetching berth data:', error);
        return [];
    }
}

// Update GeoJSON data with berth statuses
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
                        fillColor = "#F2EFE9"; // Default color if status is unknown
                }

                return {
                    color: "black",
                    weight: 0.3,
                    fillColor: fillColor,
                    fillOpacity: 1
                };
            }
        }).addTo(map);
    } else {
        console.error('GeoJSON data not available');
    }
}

// Call initializeMap to start the process
initializeMap();

let selectedLayer;

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

function highlightBerth(e) {
    const layer = e.target;
    removeHighlight(); // Reset previous highlight
    layer.setStyle({
        color: "blue",
        weight: 2,
    });

    selectedLayer = layer; // Update the selected layer reference
}

function onEachFeature(feature, layer) {
    const name = feature.properties?.name || "";
    const isPier = name.toLowerCase().startsWith("pier");

    layer.on("click", function (e) {
        if (!isPier) {
            highlightBerth(e); // Highlight only berths
            updateSidebarWithBerth(feature.properties); // Update the sidebar
        } else {
            console.log("Piers are not interactive.");
        }
    });

    layer.featureId = feature.properties?.id; // Assign a unique ID to each feature
}

// Define scroll options
const scrolledIntoViewOptions = {
    behavior: 'smooth', // Enables smooth scrolling
    block: 'center',    // Scroll the element to the center of the viewport
    inline: 'center'    // Align the element horizontally to the center
};

// Function to update the sidebar with the clicked berth details
function updateSidebarWithBerth(berth) {
    const berthList = document.getElementById("berthList");
    if (!berthList) {
        console.error("berthList element not found.");
        return;
    }
    const rows = berthList.querySelectorAll('tr');

    rows.forEach(row => {
        const berthNameBtn = row.querySelector(".berthBtn");
        if (berthNameBtn) {
            const berthName = berthNameBtn.textContent.trim();

            // Compare berth.name with berthName
            if (berthName === berth.name) {
                berthNameBtn.click(); // Simulate a click on the berth button
                berthNameBtn.scrollIntoView(scrolledIntoViewOptions); // Scroll into view with smooth scroll
            }
        }
    });
}
