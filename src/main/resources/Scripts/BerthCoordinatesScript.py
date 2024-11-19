# Import necessary modules for the script
import json  # For working with JSON and GeoJSON data
import math  # For mathematical calculations
import os    # For interacting with the operating system
from shapely.geometry import Polygon  # For creating polygon geometries
from geopy.distance import geodesic   # For geodesic calculations (distance and bearing)
import mysql.connector  # For connecting to the MySQL database
from mysql.connector import Error  # For handling MySQL errors
from dotenv import load_dotenv  # For loading environment variables from a .env file

# Get the path to the directory containing the script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Define the path to the .env file in the src directory
env_path = os.path.join(script_dir, '..', '..', '..', '.env')

# Load the .env file
load_dotenv(dotenv_path=env_path)

# --------------------------------------------
# Database Connection Functions
# --------------------------------------------

def connect_to_database():
    """
    Establish a connection to the MySQL database using credentials from environment variables.
    Returns:
        connection (mysql.connector.connection_cext.CMySQLConnection): The database connection object.
    """
    try:
        # Create a connection to the database
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST'),       # Database host (e.g., 'localhost')
            database=os.getenv('DB_NAME'),   # Database name
            user=os.getenv('DB_USER'),       # Database user
            password=os.getenv('DB_PASSWORD')  # Database password
        )
        # Check if the connection was successful
        if connection.is_connected():
            print("Connected to the database")
            return connection
    except Error as e:
        # Print any errors that occur during the connection attempt
        print(f"Error connecting to database: {e}")
    return None  # Return None if the connection was unsuccessful

def fetch_data(query):
    """
    Execute a given SQL query and return the fetched data as a list of dictionaries.
    Args:
        query (str): The SQL query to execute.
    Returns:
        data (list): A list of dictionaries containing the fetched data.
    """
    connection = connect_to_database()  # Establish a database connection
    if connection:
        try:
            # Create a cursor object with dictionary=True to get results as dictionaries
            cursor = connection.cursor(dictionary=True)
            cursor.execute(query)  # Execute the SQL query
            data = cursor.fetchall()  # Fetch all rows of the query result
            return data  # Return the fetched data
        except Error as e:
            # Print any errors that occur during data fetching
            print(f"Error fetching data: {e}")
        finally:
            # Ensure that the cursor and connection are closed properly
            cursor.close()
            connection.close()
    return []  # Return an empty list if data fetching was unsuccessful

# --------------------------------------------
# Data Retrieval Functions
# --------------------------------------------

def get_berth_data():
    """
    Retrieve all berth data from the database.
    Returns:
        berths (list): A list of dictionaries containing berth data.
    """
    print("Fetching berth data from the database...")
    query = "SELECT * FROM berth"
    berths = fetch_data(query)  # Fetch berth data using the generic fetch_data function
    print(f"Fetched {len(berths)} berths from the database.")
    return berths  # Return the list of berths

def get_pier_data():
    """
    Retrieve all pier data from the database, excluding Pier 1.
    Parses point coordinates from WKT format to (latitude, longitude) tuples.
    Returns:
        piers (list): A list of dictionaries containing pier data.
    """
    print("Fetching pier data from the database...")
    # Exclude Pier 1 (id = 1) in the SQL query
    query = """
        SELECT id, name,
               ST_AsText(bottom_left_point) AS bottom_left,
               ST_AsText(bottom_right_point) AS bottom_right,
               ST_AsText(top_right_point) AS top_right,
               ST_AsText(top_left_point) AS top_left
        FROM pier
        WHERE id != 1
    """
    piers = fetch_data(query)  # Fetch pier data
    if piers:
        # Parse point strings into coordinate tuples for each pier
        for pier in piers:
            pier['bottom_left'] = parse_point(pier['bottom_left'])
            pier['bottom_right'] = parse_point(pier['bottom_right'])
            pier['top_right'] = parse_point(pier['top_right'])
            pier['top_left'] = parse_point(pier['top_left'])
        print(f"Fetched and parsed {len(piers)} piers from the database.")
    return piers  # Return the list of piers

# --------------------------------------------
# Helper Functions
# --------------------------------------------

def parse_point(point_str):
    """
    Parse a POINT string from the database into a (latitude, longitude) tuple.
    Args:
        point_str (str): The POINT string in WKT format (e.g., 'POINT(9.9 57.0)').
    Returns:
        coordinate (tuple): A tuple containing (latitude, longitude) as floats.
    """
    if point_str and point_str.startswith("POINT"):
        # Remove 'POINT(' from the start and ')' from the end
        point_str = point_str.replace("POINT(", "").replace(")", "")
        # Split the string into longitude and latitude components
        lon_str, lat_str = point_str.split()
        try:
            # Convert longitude and latitude strings to floats
            lon = float(lon_str)
            lat = float(lat_str)
            return (lat, lon)  # Return the coordinate as a tuple (latitude, longitude)
        except ValueError as e:
            # Print an error message if conversion fails
            print(f"Error parsing point '{point_str}': {e}")
    return None  # Return None if parsing was unsuccessful

def calculate_bearing(pointA, pointB):
    """
    Calculate the compass bearing from pointA to pointB.
    Args:
        pointA (tuple): The starting point as (latitude, longitude).
        pointB (tuple): The destination point as (latitude, longitude).
    Returns:
        compass_bearing (float): The bearing in degrees from North.
    """
    # Convert latitude and longitude from degrees to radians
    lat1 = math.radians(pointA[0])
    lat2 = math.radians(pointB[0])
    diff_long = math.radians(pointB[1] - pointA[1])

    # Calculate the components of the bearing
    x = math.sin(diff_long) * math.cos(lat2)
    y = (math.cos(lat1) * math.sin(lat2) -
         (math.sin(lat1) * math.cos(lat2) * math.cos(diff_long)))

    # Calculate the initial bearing
    initial_bearing = math.atan2(x, y)

    # Normalize the bearing to 0-360 degrees
    compass_bearing = (math.degrees(initial_bearing) + 360) % 360
    return compass_bearing  # Return the compass bearing

def calculate_new_coordinate(starting_point, distance, bearing):
    """
    Calculate a new coordinate given a starting point, distance (in meters), and bearing.
    Args:
        starting_point (tuple): The starting coordinate as (latitude, longitude).
        distance (float): The distance to travel from the starting point in meters.
        bearing (float): The bearing in degrees from North.
    Returns:
        new_point (tuple): The new coordinate as (latitude, longitude).
    """
    # Use geodesic calculation to find the destination point
    destination = geodesic(meters=distance).destination(starting_point, bearing)
    return (destination.latitude, destination.longitude)  # Return the new coordinate

# --------------------------------------------
# Data Processing Functions
# --------------------------------------------

def create_piers_list(piers_data, berths_data):
    """
    Create a list of piers with their associated berths in a structured format.
    Args:
        piers_data (list): The list of piers fetched from the database.
        berths_data (list): The list of berths fetched from the database.
    Returns:
        piers_list (list): A list of piers with associated berths and coordinates.
    """
    print("Processing pier and berth data...")
    piers_list = []  # Initialize an empty list to hold processed piers

    for pier in piers_data:
        # Ensure all coordinates are available and valid
        coordinates = [
            pier['bottom_left'],   # Bottom left corner of the pier
            pier['bottom_right'],  # Bottom right corner of the pier
            pier['top_right'],     # Top right corner of the pier
            pier['top_left'],      # Top left corner of the pier
            pier['bottom_left']    # Close the polygon by returning to the first point
        ]

        if None in coordinates:
            # Skip this pier if any of the coordinates are invalid
            print(f"Pier ID {pier['id']} has invalid coordinates and will be skipped.")
            continue  # Move to the next pier

        # Find berths associated with the current pier
        pier_berths = [berth for berth in berths_data if berth['pier_id'] == pier['id']]

        # Format berths data
        formatted_berths = []
        for berth in pier_berths:
            # Create a berth dictionary with necessary details
            formatted_berths.append({
                "nummer": berth['name'],
                "længde": berth['length'],
                "bredde": berth['width']
            })

        # Create pier entry with all necessary details
        pier_entry = {
            "coordinates": coordinates,              # Coordinates of the pier
            "id": f"pier-{pier['id']}",              # Unique identifier for the pier
            "name": pier['name'],                    # Name of the pier
            "side": "both",                          # Side(s) of the pier with berths
            "berths": formatted_berths               # List of berths associated with the pier
        }

        piers_list.append(pier_entry)  # Add the pier entry to the piers list

    print(f"Processed {len(piers_list)} piers.")
    return piers_list  # Return the list of processed piers

def generate_geojson(piers):
    """
    Generate a GeoJSON file from the piers data, including detailed berth polygons.
    Args:
        piers (list): The list of processed piers with berths.
    """
    print("Generating GeoJSON...")
    features = []  # Initialize an empty list to hold GeoJSON features

    for pier in piers:
        # Swap coordinates for GeoJSON format (longitude, latitude)
        pier_geojson_coordinates = [[
            [coord[1], coord[0]] for coord in pier['coordinates']
        ]]

        # Add pier as a GeoJSON feature (Polygon)
        pier_feature = {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": pier_geojson_coordinates  # Coordinates in GeoJSON format
            },
            "properties": {
                "id": pier['id'],
                "name": pier['name'],
                "side": pier['side']
            }
        }
        features.append(pier_feature)  # Add the pier feature to the list

        # Calculate bearings along the sides of the pier for berth placement
        bearing_along_pier_left = calculate_bearing(pier['coordinates'][0], pier['coordinates'][3])
        bearing_along_pier_right = calculate_bearing(pier['coordinates'][1], pier['coordinates'][2])

        # Place berths on the pier
        place_berths(
            pier_coordinates=pier['coordinates'],
            bearing_along_pier_left=bearing_along_pier_left,
            bearing_along_pier_right=bearing_along_pier_right,
            berths=pier['berths'],
            side=pier['side'],
            features=features  # Pass the features list to add berth features
        )

    # Construct the final GeoJSON structure
    geojson = {
        "type": "FeatureCollection",
        "features": features  # List of all features (piers and berths)
    }

    # Write the GeoJSON data to a file
    with open('berths.geojson', 'w') as geojson_file:
        json.dump(geojson, geojson_file, indent=2)  # Indent for readability

    print("GeoJSON file 'berths.geojson' has been created.")

def place_berths(pier_coordinates, bearing_along_pier_left, bearing_along_pier_right, berths, side, features):
    """
    Place berths along the sides of a pier and add them to the GeoJSON features.
    Args:
        pier_coordinates (list): The coordinates of the pier.
        bearing_along_pier_left (float): Bearing along the left side of the pier.
        bearing_along_pier_right (float): Bearing along the right side of the pier.
        berths (list): List of berths to place.
        side (str): Side(s) of the pier where berths can be placed ('left', 'right', or 'both').
        features (list): The list of GeoJSON features to which berth features will be added.
    """
    # Initialize starting positions for berth placement
    current_position_left = pier_coordinates[0]   # Start at bottom left corner
    current_position_right = pier_coordinates[1]  # Start at bottom right corner
    berths_on_left_side = []   # List to hold berths on the left side
    berths_on_right_side = []  # List to hold berths on the right side

    # Place berths on the left side of the pier
    if side in ["left", "both"]:
        for berth in berths:
            length = berth["længde"]  # Length of the berth
            width = berth["bredde"]   # Width of the berth

            # Place a single berth and update the current position
            current_position_left = place_single_berth(
                current_position=current_position_left,
                length=length,
                width=width,
                bearing_along_pier=bearing_along_pier_left,
                side="left",
                berth_number=berth["nummer"],
                berths_list=berths_on_left_side
            )

    # Place berths on the right side of the pier
    if side in ["right", "both"]:
        for berth in berths[len(berths_on_left_side):]:  # Continue with remaining berths
            length = berth["længde"]
            width = berth["bredde"]

            # Place a single berth and update the current position
            current_position_right = place_single_berth(
                current_position=current_position_right,
                length=length,
                width=width,
                bearing_along_pier=bearing_along_pier_right,
                side="right",
                berth_number=berth["nummer"],
                berths_list=berths_on_right_side
            )

    # Add berth features to the GeoJSON features list
    for berth_data in berths_on_left_side + berths_on_right_side:
        point1, point2, point3, point4, berth_nummer = berth_data
        # Create a polygon for the berth
        polygon = Polygon([point1, point2, point3, point4, point1])  # Ensure the polygon is closed

        # Add the berth as a GeoJSON feature
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [coord[1], coord[0]] for coord in polygon.exterior.coords  # Swap to GeoJSON format
                ]]
            },
            "properties": {
                "id": berth_nummer,
                "name": f"Berth {berth_nummer}",
                "status": "Available"  # Default status for the berth
            }
        }
        features.append(feature)  # Add the berth feature to the features list

def place_single_berth(current_position, length, width, bearing_along_pier, side, berth_number, berths_list):
    """
    Place a single berth along a pier and add it to the berths list.
    Args:
        current_position (tuple): The starting coordinate for the berth.
        length (float): The length of the berth.
        width (float): The width of the berth.
        bearing_along_pier (float): The bearing along the pier side.
        side (str): The side of the pier ('left' or 'right').
        berth_number (str): The identifier for the berth.
        berths_list (list): The list to which the berth's coordinates will be added.
    Returns:
        next_position (tuple): The updated current position after placing the berth.
    """
    # Determine the perpendicular bearing based on the side
    if side == "left":
        perpendicular_bearing = (bearing_along_pier - 90 + 360) % 360
    elif side == "right":
        perpendicular_bearing = (bearing_along_pier + 90) % 360

    # Calculate the four corners of the berth polygon
    next_position = calculate_new_coordinate(current_position, width, bearing_along_pier)
    point1 = calculate_new_coordinate(current_position, length, perpendicular_bearing)
    point2 = calculate_new_coordinate(next_position, length, perpendicular_bearing)
    point3 = next_position
    point4 = current_position

    # Add the berth's coordinates to the berths list
    berths_list.append((point1, point2, point3, point4, berth_number))

    return next_position  # Return the updated current position for the next berth

# --------------------------------------------
# Main Execution
# --------------------------------------------

def main():
    """
    Main function to execute the script.
    """
    # Fetch data from the database
    piers_data = get_pier_data()  # Fetch piers excluding Pier 1
    berths_data = get_berth_data()  # Fetch all berths

    if not piers_data or not berths_data:
        # Exit if there is no data to process
        print("No data available to process.")
        return

    # Create piers list with associated berths
    piers = create_piers_list(piers_data, berths_data)

    # Generate GeoJSON file from the piers list
    generate_geojson(piers)

if __name__ == "__main__":
    main()  # Execute the main function when the script is run directly
