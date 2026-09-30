# Anvaya (LandGov AI) — National Land Governance Research & Policy Innovation Platform

[![CI Pipeline](https://github.com/mohitkumaarr/Anvaya/actions/workflows/ci.yml/badge.svg)](https://github.com/mohitkumaarr/Anvaya/actions/workflows/ci.yml)
[![Repository](https://img.shields.io/badge/GitHub-mohitkumaarr%2FAnvaya-blue.svg)](https://github.com/mohitkumaarr/Anvaya)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

An AI-enabled national digital public infrastructure platform concept designed for India, connecting statutory land revenue data, academic research, geospatial intelligence, and policy experimentation into an interconnected evidence-based governance ecosystem.

```
DATA ──▶ RESEARCH ──▶ AI ANALYSIS ──▶ GEOSPATIAL INSIGHT ──▶ RESEARCH GAP ──▶ POLICY SCENARIO ──▶ EVIDENCE GRAPH ──▶ POLICY BRIEF
```

> **Detailed Production Deployment Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md) for Docker Compose, Cloud (Render, Railway, AWS), and on-premises server configuration.

---

## 🏛️ Executive Platform Overview

**LandGov AI** addresses the structural fragmentation between statutory land revenue administration, spatial town planning, academic research, and policy formulation. It serves as a unified digital public infrastructure (DPI) concept where researchers, town planners, and policymakers can:
* Discover peer-reviewed empirical evidence and legislative acts across 15+ Indian states.
* Interrogate land issues using a domain-calibrated **AI Research Copilot** with source attribution.
* Inspect multi-layer **GIS Spatial Intelligence** (satellite LULC, urban sprawl velocity, flood risk, and climate vulnerability indices).
* Identify structural research blindspots using the **Research Gap Finder**.
* Model multi-sector impacts of zoning laws and capital outlays in the **Policy Lab Simulator** (Hero Feature).
* Trace causal policy-to-outcome connections via an interactive **Evidence Graph**.
* Generate structured, ministerial-grade **Policy Briefs** ready for legislative and executive review.

---

## 🛠️ Architecture & Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Recharts, React Flow / GIS Canvas |
| **Backend** | Python 3.12+, FastAPI, Pydantic v2, SQLAlchemy ORM, Uvicorn |
| **Database** | SQLite (Default for zero-setup demo mode) / PostgreSQL + pgvector (Production ready) |
| **AI / NLP** | Google Gemini API integration layer + Local Scikit-Learn TF-IDF/SVD Vector Search & Domain Synthesizer Fallback |
| **Document Processing** | PyMuPDF (fitz) for PDF metadata extraction, text parsing, and chunking |
| **Geospatial (GIS)** | GeoJSON state & district boundaries, WGS84 coordinates, multi-layer thematic scaling |
| **Authentication** | JWT (PyJWT), Bcrypt password hashing, Role-Based Access Control (RBAC) |

---

## 🚀 Quick Start Setup

### Method 1: Docker Compose (Full Stack with PostgreSQL & pgvector)
Run the entire production stack with a single command:

```bash
# 1. Clone repository
git clone https://github.com/mohitkumaarr/Anvaya.git
cd Anvaya

# 2. Launch all services (PostgreSQL 16 + FastAPI + React Nginx)
docker compose up -d --build
```
* **Web Application Portal**: [http://localhost](http://localhost) (or [http://localhost:3000](http://localhost:3000))
* **FastAPI Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **System Health Endpoint**: [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

### Method 2: Zero-Dependency Local Run (SQLite + Vite)

The platform is also designed to be runnable locally on any standard computer out of the box without requiring external database servers or proprietary API keys.

#### Prerequisites
* **Python**: 3.10 or higher
* **Node.js**: v18.0 or higher (npm v9+)

### 2. Backend Installation & Database Seeding

Open a terminal in the project root:

```bash
# 1. Install backend requirements (if not already installed)
pip install -r backend/requirements.txt

# 2. Seed database with realistic pan-India demonstration data
python backend/seed.py

# 3. Launch FastAPI backend server
python scripts/start_backend.py
```
* The backend API server will run at: **`http://127.0.0.1:8000`**
* Interactive Swagger API documentation: **`http://127.0.0.1:8000/docs`**

### 3. Frontend Installation & Launch

Open a second terminal window:

```bash
# Navigate to frontend folder
cd frontend

# Install frontend dependencies
npm install

# Start Vite development server
npm run dev
```
* The web application will launch at: **`http://localhost:5173`**

*(On Windows, you can also launch both frontend and backend using `powershell -ExecutionPolicy Bypass -File scripts/run_dev.ps1`)*

---

## 🔑 Demo Credentials & Role Privileges

The platform comes pre-seeded with four dedicated role profiles. You can log in using these credentials or switch between them instantly in the top bar using the **Role Switcher**:

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@landgov.gov.in` | `admin123` | Moderate documents, administer users, inspect platform system health |
| **RESEARCHER** (Default) | `researcher@landgov.gov.in` | `research123` | Upload & vectorize PDFs, AI copilot inquiries, collaborative project workspaces |
| **POLICYMAKER** | `policymaker@landgov.gov.in` | `policy123` | Run Policy Lab simulations, compare policies, generate ministerial briefs |
| **PUBLIC USER** | `citizen@landgov.gov.in` | `public123` | Browse public research documents, open datasets, and GIS spatial layers |

---

## 📋 End-to-End Demo Scenario Walkthrough

The platform features an automated top walkthrough guide banner following this exact workflow:

1. **AI Research Copilot**:
   * Question: *"What are the major challenges associated with rapid peri-urban land conversion?"*
   * The copilot executes semantic vector retrieval against the repository, returning:
     * **AI Synthesis** with clear demarcation of source evidence.
     * **Key Finding**: Highlights 18.4% watershed buffering loss and 42% escalation in tenure disputes.
     * **Empirical Evidence Points**: Citing specific state spatial audits.
     * **Research & Policy Citations**: Interactive links to documents and datasets.
     * Action: Click **`[Explore on Map]`**.
2. **GIS Spatial Intelligence**:
   * Automatically centers on Karnataka / Maharashtra peri-urban zones.
   * Toggle between layers (*Urban Expansion Velocity*, *Agricultural Land*, *Climate Vulnerability*, *Forest Canopy*).
   * Click any state to open the **Region Profile Drawer** with historical 6-year transition charts and district hotspots.
   * Action: Click **`[Analyze in Policy Lab]`** or click **`Research Gap`** in the top walkthrough banner.
3. **Research Gap Finder**:
   * Inspects the *"Climate-Resilient Peri-Urban Land Governance"* deficit.
   * Visualizes the dimensional imbalance (Urban Sprawl 82% vs Social Displacement Safeguards 21%).
   * Reviews the AI-generated **Potential Research Opportunity Plan** (Problem, Objectives, Questions, Required Data, Methodology).
   * Action: Click **`[Create Research Project]`** to initialize an active workspace, then navigate to **`Policy Lab`**.
4. **Policy Lab (Hero Feature)**:
   * Adjust policy levers:
     * *Protected Green-Zone Target*: **25%** (from 18% baseline)
     * *Urban Sprawl Containment Limit*: **18%**
     * *Agricultural Land Protection*: **70%**
     * *Infrastructure Capital Outlay*: **₹ 6,500 Cr**
     * *Climate Adaptation Budget*: **₹ 3,800 Cr**
     * *NA Conversion Approval Fee Surcharge*: **4.0%**
   * Click **`RUN SCENARIO`**:
     * Calculates before-vs-scenario outputs using empirical elasticities.
     * Evaluates four multi-sector impact modules: *Environmental*, *Urban*, *Infrastructure*, and *Socio-Economic*.
     * Includes mandatory analytical disclaimer.
   * Action: Click **`[View in Evidence Graph]`**.
5. **Evidence Graph**:
   * Explores the relational chain: `Policy (SVAMITVA / Draft NLUP)` ➔ `Research Study` ➔ `Spatial Dataset` ➔ `Region` ➔ `Land Issue` ➔ `Outcome`.
   * Click any node to inspect direct causal connections in the inspector drawer.
   * Action: Click **`[Generate Policy Brief]`**.
6. **Ministerial Policy Brief Generator**:
   * Selects topic, region, and simulated scenario outputs.
   * Click **`GENERATE POLICY BRIEF`**:
     * Generates a ministerial document layout with Executive Summary, Problem Statement, Evidence, Findings, 3 Policy Options with Feasibility/Timeline/Fiscal impact, and References.
     * Click **`Print / Export PDF`** to generate printable documentation.

---

## ⚙️ Environment Configuration (`.env`)

A default `.env` file is generated automatically from `.env.example`:

```bash
# Database: SQLite by default for zero-setup demo; or PostgreSQL for production
DATABASE_URL=sqlite:///./landgov.db

# Security & JWT
JWT_SECRET=national-land-governance-ai-platform-secret-key-2026
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# AI Provider Configuration (Optional)
# If left empty, platform automatically runs high-fidelity local semantic search and analytical synthesis
GEMINI_API_KEY=
OPENAI_API_KEY=

# Platform Environment
DEMO_MODE=true
ENVIRONMENT=development
UPLOAD_DIR=./uploads
DATA_DIR=./data
```

---

## 🛡️ Future National-Scale Integrations (Roadmap)

To maintain absolute academic and government integrity, the current MVP utilizes clearly labeled **Demonstration Data** calibrated against published literature and sample GIS layers. The platform architecture is modularized to support the following national-scale production integrations:

1. **National Remote Sensing Centre (NRSC) / Bhuvan API**:
   * Real-time automated satellite ingestion of 10m LULC raster grids and seasonal flood inundation vectors.
2. **State Land Revenue & Registration (DILRMP) Gateway**:
   * Direct API synchronization with state land registries (e.g., Dharani in Telangana, Bhoomi in Karnataka, Mahabhulekh in Maharashtra) for live mutation monitoring.
3. **National Judicial Data Grid (NJDG) Ingestion**:
   * Automated NLP clustering of district revenue court litigation dockets to predict high-dispute geographic clusters.
4. **Survey of India Drone Orthophoto Data Pipeline**:
   * Automated computer vision models for edge extraction and village abadi cadastral polygon generation.

---

## 📄 License & Attribution

Designed and developed as an institutional digital public infrastructure MVP demonstrating the concept of a **National Digital Research and Policy Innovation Ecosystem for Evidence-Based Land Governance**.
