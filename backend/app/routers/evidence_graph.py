from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app import models

router = APIRouter(prefix="/api/evidence-graph", tags=["Evidence Graph"])

@router.get("/")
def get_evidence_graph(filter_type: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Generates an interconnected knowledge graph connecting:
    Policy -> Research -> Dataset -> Region -> Land Issue -> Outcome
    """
    # Nodes representation
    nodes = [
        # Policies
        {
            "id": "pol-1",
            "type": "policy",
            "label": "SVAMITVA Scheme",
            "category": "Policy",
            "description": "National drone surveying and legal Property Card issuance in rural inhabited (Abadi) areas.",
            "status": "Active National Programme",
            "ministry": "Ministry of Panchayati Raj",
            "related": {"research": ["res-1", "res-2"], "datasets": ["data-1"], "regions": ["reg-up", "reg-mh"]}
        },
        {
            "id": "pol-2",
            "type": "policy",
            "label": "LARR Act 2013",
            "category": "Policy",
            "description": "Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act.",
            "status": "Statutory Legislation",
            "ministry": "Ministry of Rural Development",
            "related": {"research": ["res-3"], "datasets": ["data-2"], "regions": ["reg-ka", "reg-gj"]}
        },
        {
            "id": "pol-3",
            "type": "policy",
            "label": "Draft National Land Use Policy",
            "category": "Policy",
            "description": "Framework guiding states in scientific spatial planning and agricultural conservation zoning.",
            "status": "National Policy Directive",
            "ministry": "Ministry of Rural Development",
            "related": {"research": ["res-4"], "datasets": ["data-1", "data-3"], "regions": ["reg-mh", "reg-ka"]}
        },
        {
            "id": "pol-4",
            "type": "policy",
            "label": "Forest Rights Act 2006",
            "category": "Policy",
            "description": "Recognition of Scheduled Tribes and Other Traditional Forest Dwellers forest tenure and CFR rights.",
            "status": "Statutory Legislation",
            "ministry": "Ministry of Tribal Affairs",
            "related": {"research": ["res-5"], "datasets": ["data-4"], "regions": ["reg-od", "reg-mp"]}
        },

        # Research Papers
        {
            "id": "res-1",
            "type": "research",
            "label": "Cadastral Drone Mapping & Tenure Security",
            "category": "Research",
            "description": "Empirical study on property rights formalization across 400 villages in Western UP.",
            "authors": "Dr. S. K. Sharma et al., IIT Roorkee",
            "year": 2024,
            "related": {"policies": ["pol-1"], "datasets": ["data-1"], "issues": ["issue-disputes"]}
        },
        {
            "id": "res-2",
            "type": "research",
            "label": "Peri-Urban Agricultural Land Fragmentation",
            "category": "Research",
            "description": "Spatial analysis of uncoordinated conversion along the Bengaluru-Hosur growth corridor.",
            "authors": "Dr. Ananya Roy, National Institute of Urban Affairs",
            "year": 2023,
            "related": {"policies": ["pol-3"], "datasets": ["data-2"], "issues": ["issue-sprawl"]}
        },
        {
            "id": "res-3",
            "type": "research",
            "label": "Land Pooling vs Compulsory Acquisition",
            "category": "Research",
            "description": "Comparative fiscal and livelihood impact of Town Planning Schemes in Ahmedabad and Amaravati.",
            "authors": "Prof. R. Deshmukh, CEPT University",
            "year": 2024,
            "related": {"policies": ["pol-2"], "datasets": ["data-2"], "issues": ["issue-compensation"]}
        },
        {
            "id": "res-4",
            "type": "research",
            "label": "Climate Inundation & Urban Wetland Loss",
            "category": "Research",
            "description": "Hydrological modeling of buffer zone encroachment in the Chennai and Mumbai suburban catchments.",
            "authors": "Climate Resilience Consortium",
            "year": 2024,
            "related": {"policies": ["pol-3"], "datasets": ["data-3"], "issues": ["issue-flooding"]}
        },
        {
            "id": "res-5",
            "type": "research",
            "label": "Community Forest Rights & Livelihood Stability",
            "category": "Research",
            "description": "Assessment of gram sabha title recognition on tribal household income and forest conservation.",
            "authors": "Tata Institute of Social Sciences",
            "year": 2023,
            "related": {"policies": ["pol-4"], "datasets": ["data-4"], "issues": ["issue-tribal"]}
        },

        # Datasets
        {
            "id": "data-1",
            "type": "dataset",
            "label": "National Land Use & Land Cover Spatial Grid",
            "category": "Dataset",
            "description": "High-resolution satellite-derived 10m LULC raster database spanning 2018–2024.",
            "records": 482000,
            "source": "NRSC / ISRO",
            "related": {"regions": ["reg-up", "reg-mh", "reg-ka"], "outcomes": ["out-zoning"]}
        },
        {
            "id": "data-2",
            "type": "dataset",
            "label": "Peri-Urban Conversion & Land Transaction Ledger",
            "category": "Dataset",
            "description": "State registration transaction logs and Non-Agricultural (NA) conversion authorizations.",
            "records": 125000,
            "source": "State Revenue Portals",
            "related": {"regions": ["reg-ka", "reg-mh"], "outcomes": ["out-tax"]}
        },
        {
            "id": "data-3",
            "type": "dataset",
            "label": "District Climate Vulnerability & Flood Basin Index",
            "category": "Dataset",
            "description": "Composite CVI metrics and annual monsoon inundation footprints.",
            "records": 740,
            "source": "Ministry of Jal Shakti / IMD",
            "related": {"regions": ["reg-tn", "reg-mh", "reg-od"], "outcomes": ["out-resilience"]}
        },
        {
            "id": "data-4",
            "type": "dataset",
            "label": "Cadastral Titling & Forest Rights Claims Registry",
            "category": "Dataset",
            "description": "Gram sabha claim submissions, approved titles, and rejected appeal statistics.",
            "records": 92000,
            "source": "Ministry of Tribal Affairs",
            "related": {"regions": ["reg-od", "reg-mp"], "outcomes": ["out-tenure"]}
        },

        # Regions
        {
            "id": "reg-mh",
            "type": "region",
            "label": "Maharashtra (Pune-MMR Corridor)",
            "category": "Region",
            "description": "Western industrial and metropolitan core experiencing high peri-urban conversion pressures.",
            "expansion_rate": "5.1%/yr",
            "cvi": 0.62,
            "related": {"issues": ["issue-sprawl", "issue-disputes"]}
        },
        {
            "id": "reg-ka",
            "type": "region",
            "label": "Karnataka (Bengaluru Periphery)",
            "category": "Region",
            "description": "Rapidly expanding tech and industrial corridor with significant agrarian land pressure.",
            "expansion_rate": "6.3%/yr",
            "cvi": 0.58,
            "related": {"issues": ["issue-sprawl", "issue-compensation"]}
        },
        {
            "id": "reg-up",
            "type": "region",
            "label": "Uttar Pradesh (NCR & Gangetic Belt)",
            "category": "Region",
            "description": "Densely populated agricultural plain leading national SVAMITVA drone survey coverage.",
            "expansion_rate": "4.2%/yr",
            "cvi": 0.74,
            "related": {"issues": ["issue-disputes", "issue-flooding"]}
        },
        {
            "id": "reg-tn",
            "type": "region",
            "label": "Tamil Nadu (Chennai Coastal Basin)",
            "category": "Region",
            "description": "Coastal economic zone vulnerable to sea-level rise and wetland reduction.",
            "expansion_rate": "4.8%/yr",
            "cvi": 0.64,
            "related": {"issues": ["issue-flooding"]}
        },
        {
            "id": "reg-od",
            "type": "region",
            "label": "Odisha (Coastal & Forest Belt)",
            "category": "Region",
            "description": "Eastern mineral-rich and coastal state with prominent tribal forest tenures.",
            "expansion_rate": "3.6%/yr",
            "cvi": 0.83,
            "related": {"issues": ["issue-tribal", "issue-flooding"]}
        },

        # Land Issues
        {
            "id": "issue-sprawl",
            "type": "land_issue",
            "label": "Unplanned Peri-Urban Sprawl",
            "category": "Land Issue",
            "description": "Fragmented low-density developments encroaching onto prime agricultural belts.",
            "severity": "Critical",
            "related": {"outcomes": ["out-zoning", "out-dispute-drop"]}
        },
        {
            "id": "issue-disputes",
            "type": "land_issue",
            "label": "Boundary Ambiguity & Civil Litigation",
            "category": "Land Issue",
            "description": "Unregistered mutations and outdated hand-drawn maps clogging subordinate courts.",
            "severity": "High",
            "related": {"outcomes": ["out-dispute-drop", "out-tenure"]}
        },
        {
            "id": "issue-flooding",
            "type": "land_issue",
            "label": "Wetland Infill & Drainage Severance",
            "category": "Land Issue",
            "description": "Loss of seasonal natural retention ponds causing recurrent flash urban floods.",
            "severity": "Critical",
            "related": {"outcomes": ["out-resilience"]}
        },
        {
            "id": "issue-compensation",
            "type": "land_issue",
            "label": "Acquisition Friction & Displacement",
            "category": "Land Issue",
            "description": "Prolonged stalemates between landowners and infrastructure agencies over valuations.",
            "severity": "High",
            "related": {"outcomes": ["out-tenure", "out-tax"]}
        },
        {
            "id": "issue-tribal",
            "type": "land_issue",
            "label": "Traditional Forest Tenure Insecurity",
            "category": "Land Issue",
            "description": "Delays in titling forest commons weakening indigenous community stewardship.",
            "severity": "High",
            "related": {"outcomes": ["out-tenure"]}
        },

        # Outcomes
        {
            "id": "out-zoning",
            "type": "outcome",
            "label": "Harmonized Spatial Master Zoning",
            "category": "Outcome",
            "description": "Statutory coordination between municipal and rural development bodies protecting green zones.",
            "impact": "+35% Agricultural retention"
        },
        {
            "id": "out-dispute-drop",
            "type": "outcome",
            "label": "42% Reduction in Revenue Disputes",
            "category": "Outcome",
            "description": "Digital cadastral coordinates eliminate boundary disputes and accelerate property transactions.",
            "impact": "Average dispute pendency drops to 1.8 years"
        },
        {
            "id": "out-resilience",
            "type": "outcome",
            "label": "Climate-Resilient Buffer Corridors",
            "category": "Outcome",
            "description": "Protected wetland zones reduce peak monsoon flood volumes by 34%.",
            "impact": "INR 450 Cr averted disaster losses"
        },
        {
            "id": "out-tenure",
            "type": "outcome",
            "label": "Guaranteed Tenure & Asset Monetization",
            "category": "Outcome",
            "description": "Clear property cards allow rural families to secure formalized institutional credit.",
            "impact": "INR 12,000 Cr in formalized collateral"
        },
        {
            "id": "out-tax",
            "type": "outcome",
            "label": "Equitable Land Value Capture",
            "category": "Outcome",
            "description": "Municipal infrastructure funded transparently via land reconstitution schemes.",
            "impact": "28% Increase in local fiscal autonomy"
        }
    ]

    # Edges representation connecting the nodes
    edges = [
        # Policies -> Research
        {"id": "e-p1-r1", "source": "pol-1", "target": "res-1", "label": "Evaluated By"},
        {"id": "e-p3-r2", "source": "pol-3", "target": "res-2", "label": "Informs"},
        {"id": "e-p2-r3", "source": "pol-2", "target": "res-3", "label": "Compared With"},
        {"id": "e-p3-r4", "source": "pol-3", "target": "res-4", "label": "Mandates"},
        {"id": "e-p4-r5", "source": "pol-4", "target": "res-5", "label": "Operationalizes"},

        # Research -> Datasets
        {"id": "e-r1-d1", "source": "res-1", "target": "data-1", "label": "Validates"},
        {"id": "e-r2-d2", "source": "res-2", "target": "data-2", "label": "Analyzes"},
        {"id": "e-r3-d2", "source": "res-3", "target": "data-2", "label": "Quantifies"},
        {"id": "e-r4-d3", "source": "res-4", "target": "data-3", "label": "Models"},
        {"id": "e-r5-d4", "source": "res-5", "target": "data-4", "label": "Maps"},

        # Datasets -> Regions
        {"id": "e-d1-r-up", "source": "data-1", "target": "reg-up", "label": "Covers"},
        {"id": "e-d1-r-mh", "source": "data-1", "target": "reg-mh", "label": "Covers"},
        {"id": "e-d2-r-ka", "source": "data-2", "target": "reg-ka", "label": "Tracks"},
        {"id": "e-d3-r-tn", "source": "data-3", "target": "reg-tn", "label": "Monitors"},
        {"id": "e-d4-r-od", "source": "data-4", "target": "reg-od", "label": "Audits"},

        # Regions -> Land Issues
        {"id": "e-rmh-isprawl", "source": "reg-mh", "target": "issue-sprawl", "label": "Exhibits"},
        {"id": "e-rka-isprawl", "source": "reg-ka", "target": "issue-sprawl", "label": "Exhibits"},
        {"id": "e-rup-idispute", "source": "reg-up", "target": "issue-disputes", "label": "Experiences"},
        {"id": "e-rtn-iflood", "source": "reg-tn", "target": "issue-flooding", "label": "Faces"},
        {"id": "e-rod-itribal", "source": "reg-od", "target": "issue-tribal", "label": "Addresses"},

        # Land Issues -> Outcomes
        {"id": "e-isprawl-ozoning", "source": "issue-sprawl", "target": "out-zoning", "label": "Resolved By"},
        {"id": "e-idispute-odispute", "source": "issue-disputes", "target": "out-dispute-drop", "label": "Mitigated By"},
        {"id": "e-iflood-oresilience", "source": "issue-flooding", "target": "out-resilience", "label": "Countered By"},
        {"id": "e-icomp-otax", "source": "issue-compensation", "target": "out-tax", "label": "Replaced By"},
        {"id": "e-itribal-otenure", "source": "issue-tribal", "target": "out-tenure", "label": "Secured By"}
    ]

    return {
        "nodes": nodes,
        "edges": edges,
        "total_nodes": len(nodes),
        "total_edges": len(edges)
    }

@router.get("/node/{node_id}")
def get_node_details(node_id: str, db: Session = Depends(get_db)):
    graph = get_evidence_graph()
    node = next((n for n in graph["nodes"] if n["id"] == node_id), None)
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
        
    # Find adjacent edges and nodes
    connected_edges = [e for e in graph["edges"] if e["source"] == node_id or e["target"] == node_id]
    connected_node_ids = set()
    for e in connected_edges:
        connected_node_ids.add(e["source"])
        connected_node_ids.add(e["target"])
    connected_node_ids.discard(node_id)
    
    connected_nodes = [n for n in graph["nodes"] if n["id"] in connected_node_ids]
    
    return {
        "node": node,
        "connected_nodes": connected_nodes,
        "relationships": connected_edges
    }
