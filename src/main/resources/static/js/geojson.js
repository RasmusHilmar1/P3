// geojson.js

async function fetchGeoJson() {
    try {
        // Assuming the server serves files from /static/data/
        const response = await fetch('/static/data/berths.geojson');

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const geoJsonData = await response.json();
        console.log(geoJsonData); // To verify the data

        // Call a function to process or display the GeoJSON data
        processGeoJson(geoJsonData);
    } catch (error) {
        console.error('There was a problem fetching the GeoJSON:', error);
    }
}

// Example function to use the GeoJSON data (customize as needed)
function processGeoJson(geoJsonData) {
    // Your logic here to render the GeoJSON on the map or use it otherwise
    console.log('Processing GeoJSON:', geoJsonData);
}

// Call the fetch function
fetchGeoJson();
