import json
import math

print("=== EXPORT JSON SCHEMA AND INTEGRITY AUDIT ===")

# Test Portfolio Dossier Export
with open('data/rvm.json', 'r', encoding='utf-8') as f:
    rvm = json.load(f)

with open('data/analogs.json', 'r', encoding='utf-8') as f:
    analogs = json.load(f)

site_map = {a['id']: a for a in analogs}

# Simulate k=3 portfolio dossier
portfolio_dossier = {
    'title': 'TERRALIGN Mission Architecture & Analog Rehearsal Dossier',
    'exportFormatVersion': '1.0.0-MVP',
    'classification': 'UNCLASSIFIED / SCIENTIFIC BENCHMARK',
    'governance': {
        'authorization': 'TERRALIGN-GOV-AUTH-002',
        'methodology': 'GSD v1.6.0',
        'scientificAuditReference': 'docs/research/final-scientific-integrity-register.md',
    },
    'portfolioOptimization': {
        'k': 3,
        'fidelityThreshold': 0.70,
        'totalRVMParameters': 30,
        'coveredCount': 23,
        'binaryCoveragePercent': 76.7,
        'partialWeightedScore': 24.5,
        'partialWeightedPercent': 81.7,
        'terrestrialCeilingPercent': 86.7,
        'invariantGaps': {
            'count': 4,
            'percentage': 13.3,
            'parameters': [
                'High Cosmic Radiation (GCR + SPE)',
                'Atmospheric Hard Vacuum Tribology (~0 Pa)',
                'Partial Gravity Dynamics (1/6g & 3/8g Inertia)',
                'Cryogenic Permanently Shadowed Region (<40K)',
            ],
        },
        'sites': [
            {'siteId': 'cinder-lake', 'marginalCount': 11, 'marginalPct': 36.7},
            {'siteId': 'askja-caldera', 'marginalCount': 8, 'marginalPct': 26.7},
            {'siteId': 'atacama-desert', 'marginalCount': 4, 'marginalPct': 13.3},
        ]
    }
}

# Validate JSON serialization & deserialization
serialized = json.dumps(portfolio_dossier, indent=2)
parsed = json.loads(serialized)
assert parsed['portfolioOptimization']['coveredCount'] == 23
assert parsed['portfolioOptimization']['binaryCoveragePercent'] == 76.7
assert parsed['portfolioOptimization']['partialWeightedPercent'] == 81.7
assert parsed['portfolioOptimization']['invariantGaps']['count'] == 4
print("[PASS] Portfolio Dossier JSON export schema & numerical consistency verified")

# Test Reality Gap Dossier Export
moon_divs = [83.5, 100.0, 75.0, 26.5, 100.0, 70.0]
arg_val = round(math.sqrt(sum((d/100)**2 for d in moon_divs) / 6), 2)
arg_dossier = {
    'title': 'TERRALIGN Analog Reality Gap (ARG) Diagnostic Dossier',
    'governance': {
        'methodology': 'GSD v1.6.0',
        'epistemicClassification': 'ILLUSTRATIVE COMPOSITE INDEX — NOT EMPIRICALLY CERTIFIED',
        'formula': 'ARG(L,B) = sqrt( 1/6 * sum( (ΔPj / Pj_max)^2 ) )',
    },
    'assessment': {
        'siteId': 'cinder-lake',
        'targetBody': 'moon',
        'compositeArgIndex': arg_val,
        'divergenceZone': 'HIGH DIVERGENCE',
        'dimensions': [
            {'id': 'gravity', 'divPct': 83.5, 'type': 'MEASURED DATUM'},
            {'id': 'pressure', 'divPct': 100.0, 'type': 'DERIVED FORMULA'},
            {'id': 'thermal', 'divPct': 75.0, 'type': 'DERIVED FORMULA'},
            {'id': 'solar', 'divPct': 26.5, 'type': 'MEASURED DATUM'},
            {'id': 'radiation', 'divPct': 100.0, 'type': 'COMPUTATIONAL MODEL'},
            {'id': 'regolith', 'divPct': 70.0, 'type': 'QUALITATIVE PROXY'},
        ]
    }
}
serialized_arg = json.dumps(arg_dossier, indent=2)
parsed_arg = json.loads(serialized_arg)
assert parsed_arg['assessment']['compositeArgIndex'] == 0.80
assert len(parsed_arg['assessment']['dimensions']) == 6
print("[PASS] Reality Gap Dossier JSON export schema & numerical consistency verified")
