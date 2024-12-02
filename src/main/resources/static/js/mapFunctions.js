// mapFunctions.js

export function addGuestArea(map) {
    var guestAreaBounds = [
        [57.05742346980074, 9.90033925763862],
        [57.05734201796358, 9.90061552466426],
        [57.05728567822284, 9.900799976274303],
        [57.05732832447959, 9.900841314225922],
        [57.057682352673424, 9.90090670180615],
        [57.05775435796488, 9.900683763958938],
        [57.05742346980074, 9.90033925763862]
    ];

    L.polygon(guestAreaBounds, {
        color: "purple",
        weight: 1,
        fillOpacity: 0.7
    }).addTo(map);
}

export function removeHighlight(geoJsonLayer) {
    if (geoJsonLayer) {
        geoJsonLayer.eachLayer(layer => {
            layer.setStyle({
                color: "black",
                weight: 0.3,
                fillOpacity: 1
            });
        });
    }
}

export function highlightBerth(e, geoJsonLayer) {
    const layer = e.target;
    removeHighlight(geoJsonLayer);
    layer.setStyle({
        color: "blue",
        weight: 2
    });
}

export function onEachFeature(feature, layer, geoJsonLayer, clickHandler) {
    const name = feature.properties?.name || "";
    const isPier = name.toLowerCase().startsWith("pier");

    if (!isPier) {
        layer.on('click', function (e) {
            highlightBerth(e, geoJsonLayer);
            if (clickHandler) {
                clickHandler(feature);
            }
        });
    }

    layer.featureId = feature.properties?.id;
}

export function styleFeature(feature) {
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
            fillColor = "#F2EFE9";
    }

    return {
        color: "black",
        weight: 0.3,
        fillColor: fillColor,
        fillOpacity: 1
    };
}
