# Dark Web Threat Actor De-Anonymization (SIH 26151)

![Smart India Hackathon](https://img.shields.io/badge/Smart_India_Hackathon-2026-orange.svg)
![Python](https://img.shields.io/badge/Backend-FastAPI-blue.svg)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-black.svg)
![AI/ML](https://img.shields.io/badge/AI_Stylometry-Scikit_Learn-yellow.svg)

An AI-powered intelligence platform designed for the **National Technical Research Organisation (NTRO)** to de-anonymize dark web threat actors across Tor hidden services. 

This solution fuses **Infrastructure Misconfiguration Discovery**, **NLP-based Stylometric Profiling**, and **Graph-based Identity Correlation** to trace multiple anonymous aliases back to real-world individuals.

## 🚀 Core Features

1. **AI Stylometric Profiling (NLP Engine):** Analyzes unique author writing patterns (sentence length, syntax trees, slang) to unmask rebranded or migrated personas.
2. **Graph Correlation Engine:** Unifies fragmented handles, PGP keys, and cryptocurrency wallets into a single relationship graph (via Neo4j / NetworkX).
3. **Infrastructure Discovery:** Correlates OpSec errors and server misconfigurations to clearnet IP addresses.
4. **Interactive Dashboard:** A Next.js UI for investigators to explore node relationships and AI attribution confidence scores in real-time.

## 💻 Tech Stack

- **Backend:** Python, FastAPI
- **AI / ML:** Scikit-Learn (TF-IDF & Cosine Similarity)
- **Database:** Neo4j (Graph Database), Fallback: NetworkX
- **Frontend:** Next.js, React Force Graph 2D, Tailwind CSS

## 🛠️ How to Run Locally

### 1. Backend Setup (FastAPI & AI Engine)
```bash
# Install dependencies
pip install -r requirements.txt

# Generate synthetic dark web threat data
python data_generator.py

# Start the FastAPI server
python -m uvicorn backend.main:app --reload
```
The backend API will be running at `http://127.0.0.1:8000`

### 2. Frontend Setup (Next.js Dashboard)
Open a new terminal window:
```bash
# Navigate to the frontend directory
cd threat-intel-ui

# Run the Next.js development server
npm run dev
```
The Threat Intel Dashboard will be running at `http://localhost:3000`

## 🛡️ Project Context
Developed for **Smart India Hackathon (SIH 26151)** under the theme of Blockchain & Cybersecurity. 
*Note: This repository uses generated synthetic dark web data for demonstration and safety purposes.*
