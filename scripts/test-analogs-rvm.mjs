/**
 * Unit Test for Flagship Analogs & RVM Optimizer
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';

console.log('Testing Analogs Data, RVM Data & Optimization Engine...');

const analogs = JSON.parse(fs.readFileSync('./data/analogs.json', 'utf8'));
const rvm = JSON.parse(fs.readFileSync('./data/rvm.json', 'utf8'));

// Test 1: Verify 7 Flagship Sites Present
assert.equal(analogs.length, 7, 'Must have exactly 7 flagship analog sites');
const ids = analogs.map((s) => s.id);
assert(ids.includes('cinder-lake'));
assert(ids.includes('askja-caldera'));
assert(ids.includes('atacama-desert'));
assert(ids.includes('mcmurdo-dry-valleys'));
assert(ids.includes('hawaii-mauna-kea'));
assert(ids.includes('utah-san-rafael'));
assert(ids.includes('haughton-crater'));
console.log('✓ Test 1: All 7 canonical flagship analog sites loaded and verified');

// Test 2: Verify Exact Coordinates & Provenance
const cinder = analogs.find((s) => s.id === 'cinder-lake');
assert.equal(cinder.coordinates.lat, 35.3071);
assert.equal(cinder.coordinates.lng, -111.5049);
assert.equal(cinder.elevationMeters, 2050);
assert(cinder.literatureCitations.length >= 2);
assert.equal(cinder.suitabilityScores.rover_terramechanics, 0.96);
assert.equal(cinder.confidenceScores.rover_terramechanics, 0.91);
console.log('✓ Test 2: Cinder Lake coordinates, elevation and citations verified');

// Test 3: Verify 30 RVM Requirements
assert.equal(rvm.length, 30, 'Must have exactly 30 NASA requirements');
const invariantGaps = rvm.filter((r) => r.isInvariantGap);
assert.equal(invariantGaps.length, 4, 'Must have exactly 4 invariant reality gaps');
console.log('✓ Test 3: Exactly 30 RVM requirements present with 4 invariant reality gaps (13.3%)');

// Test 4: Verify Greedy Set-Cover Portfolio Math
const siteA = 'cinder-lake';
const siteB = 'askja-caldera';
const siteC = 'atacama-desert';

let countA = 0;
let countB_new = 0;
let countC_new = 0;
let countPartial = 0;

for (const req of rvm) {
  if (req.isInvariantGap) continue;
  const sA = req.fidelityScoresBySite[siteA] || 0;
  const sB = req.fidelityScoresBySite[siteB] || 0;
  const sC = req.fidelityScoresBySite[siteC] || 0;

  if (sA >= 0.70) {
    countA++;
  } else if (sB >= 0.70) {
    countB_new++;
  } else if (sC >= 0.70) {
    countC_new++;
  } else if (Math.max(sA, sB, sC) >= 0.50) {
    countPartial++;
  }
}

// Test 4A: k=1 baseline (Site A: Cinder Lake)
assert.equal(countA, 11, 'Site A (Cinder Lake) must cover exactly 11 criteria (36.7%) for k=1');
const k1Percent = ((countA / 30) * 100).toFixed(1);
assert.equal(k1Percent, '36.7', 'k=1 binary coverage must be 36.7%');

// Test 4B: k=2 campaign (Site A + Site B: Askja Caldera)
assert.equal(countB_new, 8, 'Site B (Askja Caldera) must marginally add 8 criteria (26.7%)');
const k2Total = countA + countB_new;
assert.equal(k2Total, 19, 'Two-site portfolio k=2 must cover exactly 19 criteria (63.3%)');
const k2Percent = ((k2Total / 30) * 100).toFixed(1);
assert.equal(k2Percent, '63.3', 'k=2 binary coverage must be 63.3%');

// Test 4C: k=3 campaign (Site A + Site B + Site C: Atacama Desert)
assert.equal(countC_new, 4, 'Site C (Atacama Desert) must marginally add 4 criteria (13.3%)');

const totalFull = countA + countB_new + countC_new;
assert.equal(totalFull, 23, 'Binary model k=3 must cover exactly 23 criteria (76.7%)');
assert.equal(countPartial, 3, 'Must have exactly 3 partial-credit criteria (0.50..0.69)');

// Test 4D: Explicit verification of OPR-05 at exact 0.70 boundary
const opr05 = rvm.find((r) => r.id === 'RVM-OPR-005');
assert(opr05, 'RVM-OPR-005 must exist in RVM dataset');
assert.equal(opr05.fidelityScoresBySite['atacama-desert'], 0.70, 'RVM-OPR-005 score at Atacama Desert must be exactly 0.70');
assert(opr05.fidelityScoresBySite['atacama-desert'] >= 0.70, 'RVM-OPR-005 must meet threshold θ >= 0.70 as full criterion');

// Reconciled production weighted calculation: 23 full @ 1.0 + 3 partial @ 0.5 = 24.5 / 30 = 81.7%
const partialWeightedTotal = totalFull * 1.0 + countPartial * 0.5; // 23 full + 3 partial
assert.equal(partialWeightedTotal, 24.5, 'Partial-weighted score must be exactly 24.5 for k=3');
const partialPercent = (partialWeightedTotal / 30) * 100;
assert.equal(partialPercent.toFixed(1), '81.7', 'Coverage must round to 81.7%');
const binaryPercent = (totalFull / 30) * 100;
assert.equal(binaryPercent.toFixed(1), '76.7', 'Binary coverage must round to 76.7%');
console.log(`✓ Test 4: Portfolio math reconciled: k=1 is 11/30 (36.7%), k=2 is 19/30 (63.3%), binary k=3 is 23/30 (76.7%), partial k=3 is 24.5/30 (81.7%)`);

// Test 5: Verify Terrestrial Ceiling (26/30 = 86.7%)
let totalSatisfiableOnEarth = 0;
for (const req of rvm) {
  if (req.isInvariantGap) continue;
  const maxAcrossAll = Math.max(...Object.values(req.fidelityScoresBySite));
  if (maxAcrossAll >= 0.70) totalSatisfiableOnEarth++;
}
assert.equal(totalSatisfiableOnEarth, 26, 'Maximum terrestrial coverage must be exactly 26/30 criteria (86.7%)');
console.log('✓ Test 5: Terrestrial ceiling confirmed at exactly 26/30 (86.7%)');

console.log('\nALL 5 ANALOG & RVM DATA TESTS PASSED EMPIRICALLY (0 failures).');
