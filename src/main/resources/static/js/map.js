import { myGeoJson, fetchGeoJson } from "./geojson.js";

// Create map for leaflet -->
var map = L.map('map', {
   // minZoom: 17,
   // maxZoom: 19
});

// Set the center for when you open the application-->
map.setView([57.057740645009346, 9.901853509671989], 18.5);

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
    [57.05861, 9.70969],
    [57.05692, 9.99093]
);

// Set the max bounds for navigating map as the bounds of picture -->
map.setMaxBounds(bounds);

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
    weight: 2,
    fillOpacity: 0.6
}).addTo(map);


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
        [57.06018973534202, 9.894721266122263], // Top-left
        [57.057196830597924, 9.897628780728576]
    );

    map.setMaxBounds(bounds2);

    map.setView([57.05895016317979, 9.895671278476893], 18.2);

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
        const berths = await response.json();
        return berths;
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

// Wait for GeoJSON to be fetched before using it
async function initializeMap() {
    await fetchGeoJson(); // Ensure that the GeoJSON is fetched

    if (myGeoJson) {
        await updateGeoJsonWithStatus(); // Update GeoJSON data with berth statuses

        // Add the updated GeoJSON to the map
        L.geoJSON(myGeoJson, {
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
    } else {
        console.error('GeoJSON data not available');
    }
}

// Call initializeMap to start the process
initializeMap();


function onEachFeature(feature, layer) {
    const berthId = feature.properties.id;

    layer.on('click', function () {
        updateSidebarWithBerth(feature.properties);
    });

    // Bind popup with updated status
    const status = feature.properties.status === 1 ? "Tilgængelig" : feature.properties.status === 0 ? "Optaget" : feature.properties.status === 2 ? "Midlertidig Utilgængelig" : "Unknown";
    /*
    const popupContent = `
           <div>
                <b>Address:</b> ${berthId || 'N/A'}<br>
                <b>Name:</b> ${feature.properties.name || 'N/A'}<br>
                <b>Status:</b> ${status}
            </div>
        `;
        layer.bindPopup(popupContent);
    }



     */
// Define scroll options
    const scrolledIntoViewOptions = {
        behavior: 'smooth', // Enables smooth scrolling
        block: 'center', // Scroll the element to the center of the viewport
        inline: 'center' // Align the element horizontally to the center
    };

// Function to update the sidebar with the clicked berth details
    function updateSidebarWithBerth(berth) {
        const berthList = document.getElementById("berthList");
        const rows = berthList.querySelectorAll('tr');

        rows.forEach(row => {
            const berthNameBtn = row.querySelector(".berthBtn");
            if (berthNameBtn) {
                const berthName = berthNameBtn.textContent.trim();

                // Compare berth.id with berthName (ensure matching data format)
                if (berthName === berth.name) {
                    berthNameBtn.click(); // Simulate a click on the berth button
                    berthNameBtn.scrollIntoView(scrolledIntoViewOptions); // Scroll into view with smooth scroll
                }
            }
        });
    }
}
