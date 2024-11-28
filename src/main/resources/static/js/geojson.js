let myGeoJson = null;

// Fetch GeoJSON file
async function fetchGeoJson() {
    try {

        const response = await fetch('/berths.geojson'); 
        if (!response.ok) {
            throw new Error('Failed to load GeoJSON file');
        }
        myGeoJson = await response.json();
    } catch (error) {
        console.error('Error fetching GeoJSON:', error);
    }
}

// Call fetchGeoJson to initialize `myGeoJson` as soon as possible
fetchGeoJson();

// Export the GeoJSON (note: it will be `null` initially, until fetched)
export { myGeoJson, fetchGeoJson };
