import json

with open('data/rvm.json', 'r', encoding='utf-8') as f:
    rvm = json.load(f)

print(f"Total RVM requirements: {len(rvm)}")

# Check invariant gaps
invariant_gaps = [r for r in rvm if r.get('isInvariantGap')]
gap_ids = [r['id'] for r in invariant_gaps]
print(f"Invariant gaps ({len(invariant_gaps)}): {gap_ids}")

# Check RVM-OPR-005 specifically
opr05 = next(r for r in rvm if r['id'] == 'RVM-OPR-005')
print(f"RVM-OPR-005 scores: {opr05['fidelityScoresBySite']}")

# Canonical flagship candidate pool: Cinder Lake (AZ), Askja (IS), Atacama (CL)
all_sites = ['cinder-lake', 'askja-caldera', 'atacama-desert']

# Run greedy algorithm for k=3
covered = set()
selected = []
marginals = []

for step in range(3):
    best_site = None
    best_new = []
    for site in all_sites:
        if site in selected:
            continue
        new_cov = []
        for r in rvm:
            if r['id'] not in covered and not r.get('isInvariantGap'):
                score = r['fidelityScoresBySite'].get(site, 0)
                if score >= 0.70:
                    new_cov.append(r['id'])
        if len(new_cov) > len(best_new):
            best_new = new_cov
            best_site = site
    selected.append(best_site)
    for rid in best_new:
        covered.add(rid)
    marginals.append((best_site, len(best_new), best_new))

print("\n--- GREEDY k=3 SELECTION ---")
for s, count, ids in marginals:
    print(f"  Site: {s:15} Marginal: +{count:2} -> {ids}")

print(f"\nTotal binary covered count: {len(covered)} / {len(rvm)}")
binary_pct = len(covered) / len(rvm) * 100
print(f"Binary coverage: {binary_pct:.4f}% -> rounded: {round(binary_pct, 1)}%")

# Check classifications for k=3
full_criteria = []
partial_criteria = []
uncovered_criteria = []

for r in rvm:
    if r.get('isInvariantGap'):
        continue
    max_score = max(r['fidelityScoresBySite'].get(s, 0) for s in selected)
    if max_score >= 0.70:
        full_criteria.append((r['id'], max_score))
    elif max_score >= 0.50:
        partial_criteria.append((r['id'], max_score))
    else:
        uncovered_criteria.append((r['id'], max_score))

print(f"\nClassification Breakdown:")
print(f"  Full criteria (>= 0.70): {len(full_criteria)}")
for fid, fscore in full_criteria:
    print(f"    [FULL] {fid}: {fscore}")

print(f"  Partial criteria (0.50 <= s < 0.70): {len(partial_criteria)}")
for pid, pscore in partial_criteria:
    print(f"    [PARTIAL] {pid}: {pscore}")

print(f"  Uncovered terrestrial (< 0.50): {len(uncovered_criteria)}")
for uid, uscore in uncovered_criteria:
    print(f"    [UNCOVERED] {uid}: {uscore}")

print(f"  Invariant physics gaps: {len(invariant_gaps)}")
for gid in gap_ids:
    print(f"    [INVARIANT GAP] {gid}")

weighted_score = len(full_criteria) * 1.0 + len(partial_criteria) * 0.5
weighted_pct = weighted_score / 30 * 100
print(f"\nWeighted total: {len(full_criteria)}*1.0 + {len(partial_criteria)}*0.5 = {weighted_score}")
print(f"Weighted coverage %: {weighted_pct:.4f}% -> rounded: {round(weighted_pct, 1)}%")

ceiling_pct = (30 - len(invariant_gaps)) / 30 * 100
print(f"Maximum terrestrial ceiling: 26/30 = {ceiling_pct:.4f}% -> rounded: {round(ceiling_pct, 1)}%")

gap_pct = len(invariant_gaps) / 30 * 100
print(f"Invariant gap %: 4/30 = {gap_pct:.4f}% -> rounded: {round(gap_pct, 1)}%")

# Run for k=1
covered1 = set()
selected1 = []
marginals1 = []
for step in range(1):
    best_site = None
    best_new = []
    for site in all_sites:
        if site in selected1:
            continue
        new_cov = []
        for r in rvm:
            if r['id'] not in covered1 and not r.get('isInvariantGap'):
                score = r['fidelityScoresBySite'].get(site, 0)
                if score >= 0.70:
                    new_cov.append(r['id'])
        if len(new_cov) > len(best_new):
            best_new = new_cov
            best_site = site
    selected1.append(best_site)
    for rid in best_new:
        covered1.add(rid)
    marginals1.append((best_site, len(best_new)))

print("\n--- GREEDY k=1 SELECTION ---")
for s, count in marginals1:
    print(f"  Site: {s:15} Marginal: +{count:2}")
print(f"k=1 Total binary covered count: {len(covered1)} / {len(rvm)} ({len(covered1)/30*100:.1f}%)")
full_k1 = [r['id'] for r in rvm if not r.get('isInvariantGap') and max(r['fidelityScoresBySite'].get(s, 0) for s in selected1) >= 0.70]
part_k1 = [r['id'] for r in rvm if not r.get('isInvariantGap') and 0.50 <= max(r['fidelityScoresBySite'].get(s, 0) for s in selected1) < 0.70]
weighted_k1 = len(full_k1) * 1.0 + len(part_k1) * 0.5
print(f"k=1 Full: {len(full_k1)}, Partial: {len(part_k1)}, Weighted: {weighted_k1}/30 ({weighted_k1/30*100:.1f}%)")

# Run for k=2
covered2 = set()
selected2 = []
marginals2 = []
for step in range(2):
    best_site = None
    best_new = []
    for site in all_sites:
        if site in selected2:
            continue
        new_cov = []
        for r in rvm:
            if r['id'] not in covered2 and not r.get('isInvariantGap'):
                score = r['fidelityScoresBySite'].get(site, 0)
                if score >= 0.70:
                    new_cov.append(r['id'])
        if len(new_cov) > len(best_new):
            best_new = new_cov
            best_site = site
    selected2.append(best_site)
    for rid in best_new:
        covered2.add(rid)
    marginals2.append((best_site, len(best_new)))

print("\n--- GREEDY k=2 SELECTION ---")
for s, count in marginals2:
    print(f"  Site: {s:15} Marginal: +{count:2}")
print(f"k=2 Total binary covered count: {len(covered2)} / {len(rvm)} ({len(covered2)/30*100:.1f}%)")

full_k2 = []
part_k2 = []
for r in rvm:
    if r.get('isInvariantGap'):
        continue
    max_score = max(r['fidelityScoresBySite'].get(s, 0) for s in selected2)
    if max_score >= 0.70:
        full_k2.append(r['id'])
    elif max_score >= 0.50:
        part_k2.append(r['id'])
weighted_k2 = len(full_k2) * 1.0 + len(part_k2) * 0.5
print(f"k=2 Full: {len(full_k2)}, Partial: {len(part_k2)}, Weighted: {weighted_k2}/30 ({weighted_k2/30*100:.1f}%)")
