from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.nlp_engine import StylometryEngine
from backend.database import db_manager
import os

app = FastAPI(title="Dark Web Threat Intel API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allows Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

nlp_engine = StylometryEngine()

@app.on_event("startup")
def startup_event():
    print("Starting Threat Intel Platform...")
    # 1. Analyze the dark web data
    data_path = os.path.join(os.path.dirname(__file__), "..", "darkweb_mock_data.json")
    matches, entities = nlp_engine.analyze_posts(data_path)
    
    # 2. Feed entities into Graph Database
    for entity in entities:
        db_manager.create_entity(
            handle=entity["handle"],
            pgp_key=entity["pgp_key"],
            wallet_address=entity["wallet_address"]
        )
        
    # 3. Feed AI matches into Graph Database
    for match in matches:
        db_manager.link_actors_by_style(
            handle1=match["handle_1"],
            handle2=match["handle_2"],
            confidence=match["confidence_score"]
        )
    print("Graph Database populated successfully.")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Dark Web Threat Intel API (SIH 26151)"}

@app.get("/api/graph-data")
def get_graph():
    """Returns nodes and edges for the Next.js Frontend to render"""
    return db_manager.get_graph_data()

@app.get("/api/analysis-results")
def get_analysis_results():
    """Returns the raw NLP matching results"""
    data_path = os.path.join(os.path.dirname(__file__), "..", "darkweb_mock_data.json")
    matches, _ = nlp_engine.analyze_posts(data_path)
    return {"stylometric_matches": matches}

# To run: uvicorn backend.main:app --reload
