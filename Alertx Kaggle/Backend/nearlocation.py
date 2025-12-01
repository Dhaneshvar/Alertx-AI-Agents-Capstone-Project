import requests

# ------------------------------------------
# 1. Define your categories + their amenities
# ------------------------------------------
CATEGORY_MAP = {
    "food": ["restaurant", "fast_food", "cafe", "bar"],
    "healthcare": ["hospital", "clinic", "pharmacy"],
    "emergency": ["police", "fire_station", "ambulance_station"],
    "finance": ["bank", "atm"],
    "education": ["school", "college", "university"],
    "transport": ["bus_station", "train_station", "airport"],
    "shopping": ["supermarket", "convenience", "mall"],
}

def get_nearby_places_grouped(lat: float, lon: float, radius: int = 5000):
    """Return nearby places grouped by categories."""

    # Build regex from all amenities across categories
    all_amenities = []
    for a_list in CATEGORY_MAP.values():
        all_amenities.extend(a_list)

    amenity_regex = "|".join(all_amenities)
    overpass_url = "https://overpass-api.de/api/interpreter"

    query = f"""
    [out:json][timeout:15];
    (
      node["amenity"~"{amenity_regex}"](around:{radius},{lat},{lon});
      way["amenity"~"{amenity_regex}"](around:{radius},{lat},{lon});
      relation["amenity"~"{amenity_regex}"](around:{radius},{lat},{lon});
    );
    out center;
    """

    try:
        res = requests.post(overpass_url, data={"data": query}, timeout=20)
        data = res.json()

        # Category-wise result container
        grouped = {category: [] for category in CATEGORY_MAP.keys()}

        for el in data.get("elements", []):
            tags = el.get("tags", {})
            amenity = tags.get("amenity")

            # Determine which category this amenity belongs to
            category = None
            for cat_name, items in CATEGORY_MAP.items():
                if amenity in items:
                    category = cat_name
                    break
            if not category:
                continue  # ignore unmatched

            # Extract coordinates
            lat_val = el.get("lat") or el.get("center", {}).get("lat")
            lon_val = el.get("lon") or el.get("center", {}).get("lon")

            # Build place object
            place = {
                "name": tags.get("name", "Unnamed"),
                "type": amenity,
                "lat": lat_val,
                "lon": lon_val,
                "address": {
                    "street": tags.get("addr:street"),
                    "housenumber": tags.get("addr:housenumber"),
                    "city": tags.get("addr:city"),
                },
                "raw_tags": tags
            }

            grouped[category].append(place)

        return grouped

    except Exception as e:
        return {"error": str(e)}


print(get_nearby_places_grouped(12.8936556,77.7108574))