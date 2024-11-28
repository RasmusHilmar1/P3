# Import necessary modules for the script
import json
import math
import os
from shapely.geometry import Polygon
from shapely import wkt
from geopy.distance import geodesic
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
from typing import Optional, List, Dict, Tuple
from collections import defaultdict

# Load environment variables from the .env file
script_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(script_dir, '..', '..', '..', '.env')
load_dotenv(dotenv_path=env_path)

# --------------------------------------------
# Database Connection Functions
# --------------------------------------------

def connect_to_database() -> Optional[mysql.connector.connection_cext.CMySQLConnection]:
    """Establish a connection to the MySQL database."""
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            database=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD')
        )
        if connection.is_connected():
            print("Connected to the database")
            return connection
    except Error as e:
        print(f"Error connecting to database: {e}")
    return None

def fetch_data(query: str) -> List[Dict]:
    """Execute a SQL query and return the fetched data as a list of dictionaries."""
    connection = connect_to_database()
    if connection:
        try:
            cursor = connection.cursor(dictionary=True)
            cursor.execute(query)
            data = cursor.fetchall()
            return data
        except Error as e:
            print(f"Error fetching data: {e}")
            return []
        finally:
            cursor.close()
            connection.close()
    else:
        print("No database connection available.")
    return []

# --------------------------------------------
# Helper Functions
# --------------------------------------------

def parse_point(point_str: str) -> Optional[Tuple[float, float]]:
    """Parse a POINT string from the database into a (latitude, longitude) tuple."""
    try:
        point = wkt.loads(point_str)
        return (point.y, point.x)
    except Exception as e:
        print(f"Error parsing point '{point_str}': {e}")
        return None

# --------------------------------------------
# Data Retrieval Functions
# --------------------------------------------

def get_pier_data() -> List[Dict]:
    """Retrieve all pier data from the database, excluding Pier 1."""
    print("Fetching pier data from the database...")
    query = """
        SELECT id, name, side,
               ST_AsText(bottom_left_point) AS bottom_left,
               ST_AsText(bottom_right_point) AS bottom_right,
               ST_AsText(top_right_point) AS top_right,
               ST_AsText(top_left_point) AS top_left
        FROM pier
        WHERE id != 1
    """
    piers = fetch_data(query)
    if piers:
        for pier in piers:
            pier['bottom_left'] = parse_point(pier['bottom_left'])
            pier['bottom_right'] = parse_point(pier['bottom_right'])
            pier['top_right'] = parse_point(pier['top_right'])
            pier['top_left'] = parse_point(pier['top_left'])
        print(f"Fetched and parsed {len(piers)} piers from the database.")
    else:
        print("No pier data fetched.")
    return piers

def get_berth_data() -> List[Dict]:
    """Retrieve all berth data from the database."""
    print("Fetching berth data from the database...")
    query = "SELECT berthId, name, length, width, pier_id FROM berth"
    berths = fetch_data(query)
    print(f"Fetched {len(berths)} berths from the database.")
    return berths

# --------------------------------------------
# Helper Functions
# --------------------------------------------

def calculate_bearing(pointA: Tuple[float, float], pointB: Tuple[float, float]) -> float:
    """Calculate the compass bearing from pointA to pointB."""
    lat1 = math.radians(pointA[0])
    lat2 = math.radians(pointB[0])
    diff_long = math.radians(pointB[1] - pointA[1])

    x = math.sin(diff_long) * math.cos(lat2)
    y = (math.cos(lat1) * math.sin(lat2) -
         math.sin(lat1) * math.cos(lat2) * math.cos(diff_long))

    initial_bearing = math.atan2(x, y)
    compass_bearing = (math.degrees(initial_bearing) + 360) % 360
    return compass_bearing

def calculate_new_coordinate(starting_point: Tuple[float, float], distance: float, bearing: float) -> Tuple[float, float]:
    """Calculate a new coordinate given a starting point, distance (in meters), and bearing."""
    destination = geodesic(meters=distance).destination(starting_point, bearing)
    return (destination.latitude, destination.longitude)

# --------------------------------------------
# Data Processing Functions
# --------------------------------------------

def place_single_berth(current_position: Tuple[float, float], length: float, width: float, bearing_along_pier: float, side: str, berth_id: int, berth_name: str, berths_list: List[Tuple]):
    """Place a single berth along a pier and add it to the berths list."""
    if side == "left":
        perpendicular_bearing = (bearing_along_pier - 90 + 360) % 360
    elif side == "right":
        perpendicular_bearing = (bearing_along_pier + 90) % 360
    else:
        raise ValueError(f"Invalid side: {side}")

    next_position = calculate_new_coordinate(current_position, width, bearing_along_pier)
    point1 = calculate_new_coordinate(current_position, length, perpendicular_bearing)
    point2 = calculate_new_coordinate(next_position, length, perpendicular_bearing)
    point3 = next_position
    point4 = current_position

    berths_list.append((point1, point2, point3, point4, berth_id, berth_name))

    return {'next_position': next_position}

def place_berths(pier: Dict, bearing_along_pier_left: float, bearing_along_pier_right: float, features: List[Dict]):
    """Place berths along the sides of a pier and add them to the GeoJSON features."""
    pier_coordinates = pier['coordinates']
    berths = pier['berths']
    side = pier['side']
    pier_name = pier['name']

    if not berths:
        print(f"No berths to place for pier '{pier_name}'.")
        return

    current_position_left = pier_coordinates[0]
    current_position_right = pier_coordinates[1]

    berths_on_left_side = []
    berths_on_right_side = []

    sides_to_use = ['left', 'right'] if side == 'both' else [side]

    total_berths = len(berths)
    berth_index = 0

    left_side_full = False
    right_side_full = False

    max_distance_left = geodesic(pier_coordinates[0], pier_coordinates[3]).meters
    max_distance_right = geodesic(pier_coordinates[1], pier_coordinates[2]).meters

    distance_along_left = 0
    distance_along_right = 0

    while berth_index < total_berths:
        berth = berths[berth_index]
        length = berth["length"]
        width = berth["width"]

        berth_placed = False

        if 'left' in sides_to_use and not left_side_full:
            remaining_distance_left = max_distance_left - distance_along_left

            if width <= remaining_distance_left:
                result = place_single_berth(
                    current_position=current_position_left,
                    length=length,
                    width=width,
                    bearing_along_pier=bearing_along_pier_left,
                    side="left",
                    berth_id=berth["id"],
                    berth_name=berth["number"],
                    berths_list=berths_on_left_side
                )
                current_position_left = result['next_position']
                distance_along_left += width
                berth_placed = True
            else:
                left_side_full = True

        if not berth_placed and 'right' in sides_to_use and not right_side_full:
            remaining_distance_right = max_distance_right - distance_along_right

            if width <= remaining_distance_right:
                result = place_single_berth(
                    current_position=current_position_right,
                    length=length,
                    width=width,
                    bearing_along_pier=bearing_along_pier_right,
                    side="right",
                    berth_id=berth["id"],
                    berth_name=berth["number"],
                    berths_list=berths_on_right_side
                )
                current_position_right = result['next_position']
                distance_along_right += width
                berth_placed = True
            else:
                right_side_full = True

        if not berth_placed:
            print(f"Not enough space to place berth {berth['number']} on pier '{pier_name}'.")
            berth_index += 1
            continue

        berth_index += 1

        if left_side_full and right_side_full:
            print(f"No more space on pier '{pier_name}'. Remaining berths will not be placed.")
            break

    for berth_data in berths_on_left_side + berths_on_right_side:
        point1, point2, point3, point4, berth_id, berth_name = berth_data
        polygon = Polygon([point1, point2, point3, point4, point1])

        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [coord[1], coord[0]] for coord in polygon.exterior.coords
                ]]
            },
            "properties": {
                "id": berth_id,
                "name": berth_name
            }
        }
        features.append(feature)

def create_piers_list(piers_data: List[Dict], berths_data: List[Dict]) -> List[Dict]:
    """Create a list of piers with their associated berths."""
    print("Processing pier and berth data...")
    piers_list = []
    berths_by_pier = defaultdict(list)
    for berth in berths_data:
        berths_by_pier[berth['pier_id']].append(berth)

    for pier in piers_data:
        coordinates = [
            pier['bottom_left'],
            pier['bottom_right'],
            pier['top_right'],
            pier['top_left'],
            pier['bottom_left']
        ]

        if None in coordinates:
            print(f"Pier ID {pier['id']} has invalid coordinates and will be skipped.")
            continue

        pier_berths = berths_by_pier.get(pier['id'], [])
        formatted_berths = []
        for berth in pier_berths:
            try:
                length = float(berth['length'])
                width = float(berth['width'])
                if length <= 0 or width <= 0:
                    print(f"Invalid dimensions for berth {berth['name']}. Skipping.")
                    continue
            except (ValueError, TypeError):
                print(f"Invalid length or width for berth {berth['name']}. Skipping.")
                continue
            formatted_berths.append({
                "id": berth['berthId'],
                "number": berth['name'],
                "length": length,
                "width": width
            })

        side = pier.get('side', 'both').lower()
        pier_entry = {
            "coordinates": coordinates,
            "id": pier['id'],
            "name": pier['name'],
            "side": side,
            "berths": formatted_berths
        }

        piers_list.append(pier_entry)

    print(f"Processed {len(piers_list)} piers.")
    return piers_list

def generate_geojson(piers: List[Dict]):
    """Generate a GeoJSON file from the piers data, including berth polygons."""
    print("Generating GeoJSON...")
    features = []

    for pier in piers:
        pier_geojson_coordinates = [[
            [coord[1], coord[0]] for coord in pier['coordinates']
        ]]

        pier_feature = {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": pier_geojson_coordinates
            },
            "properties": {
                "id": pier['id'],
                "name": pier['name'],
                "side": pier['side']
            }
        }
        features.append(pier_feature)

        bearing_along_pier_left = calculate_bearing(pier['coordinates'][0], pier['coordinates'][3])
        bearing_along_pier_right = calculate_bearing(pier['coordinates'][1], pier['coordinates'][2])

        place_berths(
            pier=pier,
            bearing_along_pier_left=bearing_along_pier_left,
            bearing_along_pier_right=bearing_along_pier_right,
            features=features
        )

    geojson = {
        "type": "FeatureCollection",
        "features": features
    }

    static_folder_path = os.path.join(script_dir, '..', 'static')
    os.makedirs(static_folder_path, exist_ok=True)
    geojson_file_path = os.path.join(static_folder_path, 'berths.geojson')

    with open(geojson_file_path, 'w') as geojson_file:
        json.dump(geojson, geojson_file, indent=2)

    print(f"GeoJSON file 'berths.geojson' has been created at {geojson_file_path}.")

# --------------------------------------------
# Main Execution
# --------------------------------------------

def main():
    """Main function to execute the script."""
    piers_data = get_pier_data()
    berths_data = get_berth_data()

    if not piers_data or not berths_data:
        print("No data available to process.")
        return

    piers = create_piers_list(piers_data, berths_data)

    if not piers:
        print("No valid piers to process.")
        return

    generate_geojson(piers)

if __name__ == "__main__":
    main()
