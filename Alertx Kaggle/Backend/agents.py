from google.adk.agents import LlmAgent, ParallelAgent, SequentialAgent
from google.adk.agents.llm_agent import Agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.tools.function_tool import FunctionTool
import requests

def get_nearby_emergency_places(lat: float, lon: float, radius: int = 5000):
    """Real hospitals, police, fire stations from OpenStreetMap"""
    overpass_url = "https://overpass-api.de/api/interpreter"
    query = f"""
    [out:json][timeout:10];
    (
      node["amenity"~"hospital|clinic|fire_station|police"](around:{radius},{lat},{lon});
      way["amenity"~"hospital|clinic|fire_station|police"](around:{radius},{lat},{lon});
      relation["amenity"~"hospital|clinic|fire_station|police"](around:{radius},{lat},{lon});
    );
    out center;
    """
    try:
        r = requests.post(overpass_url, data={"data": query}, timeout=15)
        print(r)
        data = r.json()
        places = []
        for el in data.get("elements", []):
            tags = el.get("tags", {})
            name = tags.get("name", "Unnamed Facility")
            amenity = tags.get("amenity", "unknown")
            latlon = (el.get("lat") or el.get("center", {}).get("lat"), 
                      el.get("lon") or el.get("center", {}).get("lon"))
            if latlon[0] and latlon[1]:
                places.append({"name": name, "type": amenity, "lat": latlon[0], "lon": latlon[1]})
        return {"nearby_places": places[:10]} if places else {"nearby_places": [], "note": "No facilities found"}
    except Exception as e:
        return {"error": str(e), "nearby_places": []}
    

import requests

def get_nearby_places(
    lat: float, 
    lon: float, 
    radius: int = 5000,
    amenities: list = None
):
    """
    Fetches nearby places from OpenStreetMap using Overpass API.
    
    amenities: list of OSM amenity types you want.
               Example: ["hospital", "clinic", "restaurant", "school", "atm"]
    """

    if amenities is None:
        # Default: ALL common place types
        amenities = [
            "hospital", "clinic", "pharmacy",
            "police", "fire_station", "ambulance_station",
            "bank", "atm",
            "school", "college", "university",
            "restaurant", "fast_food", "cafe",
            "fuel", "parking",
            "supermarket", "convenience",
            "bus_station", "train_station"
        ]

    # Convert list → regex string
    amenity_regex = "|".join(amenities)

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
        response = requests.post(overpass_url, data={"data": query}, timeout=20)
        data = response.json()

        places = []
        for el in data.get("elements", []):
            tags = el.get("tags", {})

            places.append({
                "name": tags.get("name", "Unnamed"),
                "type": tags.get("amenity", "unknown"),
                "address": {
                    "street": tags.get("addr:street"),
                    "housenumber": tags.get("addr:housenumber"),
                    "city": tags.get("addr:city"),
                },
                "lat": el.get("lat") or el.get("center", {}).get("lat"),
                "lon": el.get("lon") or el.get("center", {}).get("lon"),
                "raw_tags": tags   # include full metadata
            })

        return {
            "query_amenities": amenities,
            "count": len(places),
            "places": places[:50]   # return first 50 to avoid overload
        }

    except Exception as e:
        return {"error": str(e), "places": []}



video_analyzer = Agent(
    name="VideoAnalyzer",
    model="gemini-1.5-pro",
    instruction="""
    You are a disaster response video expert. Analyze the video carefully.
    Return ONLY valid JSON:
    {
      "scene_description": "short description",
      "objects_detected": ["flood water", "damaged pole", "people trapped"],
      "risk_level": "Severe|High|Medium|Low",
      "event_type": "Flood|Fire|Accident|Landslide|Other",
      "department": "Fire Services|Electricity Board|Police|Municipal Corporation",
      "immediate_actions": ["Evacuate area", "Cut power supply"]
    }
    """,
    output_key="video_analysis"
)

location_agent = Agent(
    name="LocationAgent",
    model="gemini-1.5-pro",
    tools=[get_nearby_emergency_places],
    instruction="""
    Estimate location from video (landmarks, signs, etc.).
    If unclear, use default: lat=12.9716, lon=77.5946 (Bangalore center).
    Then call get_nearby_emergency_places tool.
    Return JSON: { "user_location": {"lat": x, "lon": y}, "nearby_places": [...] }
     You are a Location Intelligence and Emergency Mapping Agent.

        Your task:
        Given an input JSON containing **user_location** coordinates (latitude and longitude), identify and list essential nearby facilities within a few kilometers radius.

        You must retrieve realistic surrounding **key places** such as:
        - hospitals
        - fire stations
        - police stations
        - power stations or substations
        - water supply or municipal offices (if relevant)

        Example Input:
        {{
        "user_location": {{"lat": 12.9716, "lon": 77.5946}}
        }}

        Example Output (strict JSON format):
        {{
        "nearby_places": [
            {{"type": "hospital", "name": "CityCare Hospital", "distance_km": 1.2}},
            {{"type": "fire_station", "name": "Brigade Fire Dept", "distance_km": 0.8}},
            {{"type": "police_station", "name": "MG Road Police", "distance_km": 1.5}},
            {{"type": "power_station", "name": "BESCOM Substation", "distance_km": 0.7}}
        ]
        }}

        Now use the provided input below and generate the **realistic surrounding key places** near the coordinates.

        Input:
        {json.dumps(event_data, indent=2)}

        Output format rule:
        - Return only valid JSON
        - Do not add explanations or text outside the JSON
        - Keep distances realistic (0.5 – 3.0 km)
    """,
    output_key="location_data"
)

final_reporter = Agent(
    name="FinalReporter",
    model="gemini-1.5-pro",
    instruction="""
    You are an expert emergency response and infrastructure analyst and incident combiner.
        Combine the EVENT and LOCATION information below and produce a concise, high-value operational plan.

        INPUTS (do not change):
        Event:
        {event_json}

        Location Info:
        {loc_json}

        TASK — produce a single JSON object (strict JSON only; no extra text or markdown) containing these keys:
        1) INFRASTRUCTURE_AND_PEOPLE_IMPACTS: an array of short strings, each "<entity>: <one-line impact>".
            - Cover roads, hospitals, power, schools, utilities, and people (residents, commuters).
            - Keep each item to one sentence.

        2) ANALYSIS_SUMMARY: 3–5 short bullet lines summarizing causal factors, immediate hazards, and likely cascade effects.
        - Keep concise, factual, and non-sensitive.

        3) RECOMMENDED_ACTIONS: an ordered array of 3–4 action objects with fields:
            - "title" (short action title),
            - "lead" (who should lead: e.g., "Local Fire Dept", "City Utilities", "Police"),
            - "rationale" (one-line why/what it achieves),
            - "priority" ("Immediate", "High", "Medium", "Low"),
            - optional "estimated_resources" (very short: e.g., "2 boats, 1 ambulance").

        Important rules:
        - Do NOT invent phone numbers or unverifiable contacts. You may suggest roles (e.g., "Local Fire Dept") but not specific personal contact details.
        - Be pragmatic and prioritize human safety and fast actions.
        - If location shows nearby hospitals/fire stations in loc_json, reference them by name in appropriate items
    Combine video analysis and location data into final emergency report.
   Video ANalyize Report
   {{video_analysis}}
   Location Agent
   {{location_data}}

   then give me the finall summary of report like an markdown format as an incident report / Rootcause anluzis report or any releavent format of report for each incidents.
    """,
    output_key="final_report"
)


twillio_call_agent = Agent(
    name="TwillioAgent",
    model="gemini-1.5-pro",
    instruction="""
you have access to to and from no of twillio you have to collect the data from final_reporter {final_reporter} and then summarize 
 You are a voice-based AI Alert Agent named {}.
    Your job is to generate a short spoken message (under 35 words or 2-3 sentences) for a phone call.

    Message flow:
    1️ Start with a polite greeting addressing the user by name (e.g., "Hello, this is the SafeHaven Alert Agent speaking.")
    2️ Summarize the event and its severity briefly.
    3 Mention the recommended action or next step clearly.

    Use natural, calm tone — avoid robotic phrasing.
    Do not include extra text, quotes, or formatting.

    Content to summarize:
    {final_reporter}
""",
description="you have to use twillio to call the correponding covernemt authorities to tell the urgnecy in 1 or 2 lines",
)

VideoAnalyzer_Near_LocationSearch_Agent = ParallelAgent(
    sub_agents=[video_analyzer, location_agent],
    description="This agent is responsible for collecting Analyzing video and getting nearby places of given latitue and longitue coordinates and you have access the Video_analyzer tool and then call the location_agent tool where input of this is l,l",
    name="VideoAnalyzer_Near_LocationSearch_Agent"
)
# Full pipeline
emergency_pipeline = SequentialAgent(
    name="Aura_EmergencyPipeline",
    sub_agents=[ VideoAnalyzer_Near_LocationSearch_Agent,
        final_reporter, twillio_call_agent
    ]
)

# Root agent: detects video → triggers pipeline
root_agent = Agent(
    name="root_agent",
    model="gemini-2.5-pro",
    instruction=
     """
        You are a Visual Identifier and Video Analyzer. 
            Analyze the given Video carefully and answer the user's query. 
            (do not hallucinate extra fields). 
            Ensure the descriptions are concise and factual.
                        
    - If user uploads a video → reply exactly: TRIGGER_PIPELINE
    - Otherwise answer normally.
    """,
    sub_agents=[emergency_pipeline]
    # AgentTool
)


# print(get_nearby_emergency_places(12.8936556,77.7108574))
# print(get_nearby_places(12.8936556,77.7108574))
# 12.8936556,77.7108574