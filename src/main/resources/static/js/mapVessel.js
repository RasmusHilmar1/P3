import {myGeoJson} from "./geojson.js";
import {fetchApprovedMembers, fetchBerth, fetchBoats} from "./fetchMethods.js";
import {switchHeader} from "./sidebarVessel.js";

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

let geoJsonLayer;

// Update GeoJSON data with berth status
function updateGeoJsonWithStatus() {
    // Map berth data to GeoJSON features
    myGeoJson.features.forEach(feature => {
        const berthStatus = berths.find(berth => berth.berthID === Number(feature.properties.id));
        feature.properties.status = berthStatus ? berthStatus.availability : 'Unknown';
    });

    // Render updated GeoJSON with styles based on status
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
                    fillColor = "white"; // Default color if status is unknown
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
    berthListsToMap(geoJsonLayer)
}
// Initial load and update
updateGeoJsonWithStatus();

function onEachFeature(feature, layer) {

    layer.on('click', function(e) {
        highlightBerth(e);
        //berthToSideBarBerthList(feature);
        berthToThreeLists(feature);
        berthToMemberList(feature);
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

function berthToMemberList(feature) {
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
                        (boat.berthID === feature.properties.id) && (table.style.display === "table")) {
                            nameBtn.scrollIntoView();
                            nameBtn.click();
                    }
                })

/*
                if ((berthName === feature.properties.name) && (table.style.display === "table")) {
                    berthNameBtn.scrollIntoView();
                    berthNameBtn.click();
                }*/
            }
        });
    });

}

function berthToThreeLists(feature){
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
                    berthNameBtn.scrollIntoView();
                    berthNameBtn.click();
                }
            }
        });
    });

}

/*
function berthToSideBarBerthList(feature) {
    const berthList = document.getElementById("berthList");
    const rows = berthList.querySelectorAll('tr');

    rows.forEach(row => {
        const berthNameBtn = row.querySelector(".berthBtn");
        //console.log("berthNameBtn: " + berthNameBtn);
        if (berthNameBtn) {
            const berthName = berthNameBtn.textContent.trim();
            //console.log("berthName: " + berthName);

            if ((berthName === feature.properties.name) && (berthList.style.display === "table")) {
                //memberListBoat.style.display = "none";
                //console.log("display", memberListBoat.style.display = "none");
                //memberListWithoutBoat.style.display = "none";

                // Loop gennem og skjul hver tabel
                //allBerthTables.forEach((table) => {
                //    table.style.display = 'none';
                //});
                //berthList.style.display = "table";

                berthNameBtn.click();
                berthNameBtn.scrollIntoView();
            }
        }
    });
}
*/
function memberToMap(geoJsonLayer){
    const memberList = document.getElementById("memberListBoat");
    memberList.addEventListener("click", (event) => {
        geoJsonLayer.eachLayer(layer => {
            layer.setStyle({
                color: "black",
                weight: 0.1
            })
        });

        const button = event.target.closest(".nameBtn");
        console.log("button member: " + button.outerHTML);

        if(button) {
            const memberId = button.id.replace("memberName", "");

            boats.forEach(boat => {
                if ((Number(memberId) === boat.memberID) && (boat.berthID !== 9999)) {
                    geoJsonLayer.eachLayer(layer => {
                        if(Number(layer.featureId) === boat.berthID) {
                            layer.setStyle({
                                color: "blue",
                                weight: 2
                            })
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
            geoJsonLayer.eachLayer(layer => {
                layer.setStyle({
                    color: "black",
                    weight: 0.1
                })
            });

            const berthBtn = event.target.closest(".berthBtn");
            console.log("button: " + berthBtn.outerHTML);

            if (berthBtn) {
                const berthName = berthBtn.textContent.trim();

                berths.forEach(berth => {
                    if (berthName === berth.name) {
                        geoJsonLayer.eachLayer(layer => {
                            if (Number(layer.featureId) === berth.berthID) {
                                layer.setStyle({
                                    color: "blue",
                                    weight: 2
                                })
                            }
                        });
                    }
                });
            }
        });
    }
}










/*
function berthListToMap(geoJsonLayer){
    const berthList = document.getElementById("berthList");
    berthList.addEventListener("click", (event) => {
        geoJsonLayer.eachLayer(layer => {
            layer.setStyle({
                color: "black",
                weight: 0.1
            })
        });

        const berthBtn = event.target.closest(".berthBtn");
        console.log("button: " + berthBtn.outerHTML);

        if(berthBtn) {

            const berthName = berthBtn.textContent.trim();

            berths.forEach(berth => {
                if (berthName === berth.name) {
                    geoJsonLayer.eachLayer(layer => {
                       if (Number(layer.featureId) === berth.berthID) {
                           layer.setStyle({
                               color: "blue",
                               weight: 2
                           })
                       }
                    });
                }
            });
        }
    });

}





var memberList = document.getElementById("memberListBoat");
const rows = memberList.querySelectorAll('tr');
console.log("memberList: " + memberList);
console.log("rows: " + rows);


rows.forEach(row => {

    row.addEventListener("click", function() {
        //const memberCell = row.querySelector(".memberCell");

        const markerId = row.getAttribute("")



        approvedMembers.forEach(approvedMember => {
            const memberName = row.querySelector(`#memberName${approvedMember.member.memberID}`);
            //console.log("memberCell: " + memberCell.innerHTML);

            if(memberName) {
                const memberNameId = memberName.id;
                const id = memberNameId.replace("memberName", "");
                //console.log(id);

                boats.forEach(boat => {
                    if ((Number(id) === boat.memberID) && (boat.berthID !== 9999) && (boat.berthID === Number(feature.properties.id))) {
                        highlightBerth(e);
                    }
                });
            }
        });
    });
});
*/