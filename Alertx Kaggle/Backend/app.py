# backend/app.py
from flask import Flask, request, Response
from flask_cors import CORS
import json
import os
import tempfile
from google.adk.agents import LlmAgent, ParallelAgent, SequentialAgent
from google.adk.agents.llm_agent import Agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService


from google.genai.types import Content, Part, Blob
import requests
from dotenv import load_dotenv

session_service = InMemorySessionService()
# === PUT YOUR KEY HERE SAFELY ===
load_dotenv()  # This reads .env file if exists
os.environ["GEMINI_API_KEY"] = ""
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])  # Your React app

# ==================== REAL TOOL: Nearby Emergency Facilities ====================
# @Tool
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


# ==================== AGENTS ====================
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
    """,
    output_key="location_data"
)

final_reporter = Agent(
    name="FinalReporter",
    model="gemini-1.5-pro",
    instruction="""
    Combine video analysis and location data into final emergency report.
    Return strict JSON:
    {
      "alert_level": "RED|ORANGE|YELLOW|GREEN",
      "summary": "3-4 sentence summary of incident",
      "threats": ["Electrocution risk", "Traffic blocked"],
      "actions": [
        {"priority": "Immediate", "action": "Deploy rescue boats", "lead": "Fire Services", "nearest": "Brigade Fire Station (1.2km)"}
      ]
    }
    """,
    output_key="final_report"
)


p_agent = ParallelAgent(sub_agents=[video_analyzer, location_agent],
                        description="Agent",
                        name="parallel")
# Full pipeline
emergency_pipeline = SequentialAgent(
    name="EmergencyPipeline",
    sub_agents=[ p_agent
        ,
        final_reporter
    ]
)

# Root agent: detects video → triggers pipeline
root_agent = Agent(
    name="root_agent",
    model="gemini-1.5-pro",
    instruction="""
    - If user uploads a video → reply exactly: TRIGGER_PIPELINE
    - Otherwise answer normally.
    """,
    sub_agents=[emergency_pipeline]
    # AgentTool
)

runner = Runner(agent=root_agent,
    session_service=session_service,
     app_name='APP_NAME',
     )


# # ==================== STREAMING ENDPOINT ====================
# def generate_stream(contents):
#     try:
#         yield json.dumps({"type": "log", "message": "Starting analysis..."}) + "\n"

#         for chunk in root_agent.stream(contents):
#             if chunk.type == "text":
#                 yield json.dumps({"type": "text", "content": chunk.text}) + "\n"
#             elif chunk.type == "state":
#                 state = chunk.state
#                 if "final_report" in state:
#                     yield json.dumps({"type": "final", "report": state["final_report"]}) + "\n"
#                 elif "video_analysis" in state:
#                     yield json.dumps({"type": "state", "data": state["video_analysis"], "agent": "VideoAnalyzer"}) + "\n"
#                 elif "location_data" in state:
#                     yield json.dumps({"type": "state", "data": state["location_data"], "agent": "LocationAgent"}) + "\n"
#             elif chunk.type == "log":
#                 yield json.dumps({"type": "log", "message": chunk.message}) + "\n"
#     except Exception as e:
#         yield json.dumps({"type": "error", "message": str(e)}) + "\n"


# @app.route("/analyze", methods=["POST"])
# def analyze():
#     text = request.form.get("text", "Analyze this video")
#     video_file = request.files.get("video")


#     # Build contents with video if uploaded
#     parts = [Part(text=text)]
#     temp_path = None

#     if video_file and video_file.filename.lower().endswith(('.mp4', '.mov', '.avi')):
#         temp_path = tempfile.mktemp(suffix=".mp4")
#         video_file.save(temp_path)
#         video_bytes = open(temp_path, "rb").read()
#         parts.append(Part(inline_data=Blob(mime_type="video/mp4", data=video_bytes)))

#     contents = [Content(role="user", parts=parts)]

#     def stream():
#         for line in generate_stream(contents):
#             yield f"data: {line}\n\n"
#         if temp_path and os.path.exists(temp_path):
#             os.remove(temp_path)

#     return Response(stream(), mimetype="text/event-stream")


@app.route("/analyze", methods=["POST"])
def analyze():
    text = request.form.get("text", "Analyze this video")
    video_file = request.files.get("video")

    parts = [text]
    temp_path = None

    if video_file and video_file.filename:
        temp_path = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4").name
        video_file.save(temp_path)
        video_bytes = open(temp_path, "rb").read()
        parts.append(Part(inline_data=Blob(mime_type="video/mp4", data=video_bytes)))

    message = {"role": "user", "parts": parts}

    def stream():
        yield "data: " + json.dumps({"type": "log", "message": "🚨 Analysis started..."}) + "\n\n"

        try:
            # NEW CORRECT WAY: root_agent.stream() NOT runner.stream()
            for chunk in root_agent.stream([message]):
                if chunk.type == "text":
                    yield f"data: {json.dumps({'type': 'text', 'content': chunk.text})}\n\n"
                elif chunk.type == "state":
                    state = chunk.state or {}
                    if "final_report" in state:
                        yield f"data: {json.dumps({'type': 'final', 'report': state['final_report']})}\n\n"
                    elif "video_analysis" in state:
                        yield f"data: {json.dumps({'type': 'state', 'agent': 'Video', 'data': state['video_analysis']})}\n\n"
                    elif "location_data" in state:
                        yield f"data: {json.dumps({'type': 'state', 'agent': 'Location', 'data': state['location_data']})}\n\n"
                    else:
                        yield f"data: {json.dumps({'type': 'state', 'data': state})}\n\n"
                elif chunk.type == "log":
                    yield f"data: {json.dumps({'type': 'log', 'message': chunk.message})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

        # Cleanup
        if temp_path and os.path.exists(temp_path):
            os.unlink(temp_path)

    return Response(stream(), mimetype="text/event-stream")

if __name__ == "__main__":
    print("Backend running → http://localhost:5000")
    print("React frontend → http://localhost:5173")
    # app.run(host="0.0.0.0", threaded=True)
    app.run()