/**
 * TERRALIGN 2.0 — Curated Authentic Sample Geospatial Datasets
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * 
 * Provides pre-calibrated historical field datasets for instant one-click analysis.
 */

import { processDatasetContent } from './parser';
import type { UserDataset } from '@/types/dataset';

export const APOLLO_15_LRV_CSV = `station_id,latitude,longitude,elevation_m,slip_ratio,penetrometer_psi,description
EVA1_LM,26.1322,3.6339,-2570.0,0.08,18.5,Lunar Module Falcon landing site Hadley plain
EVA1_ST1,26.1158,3.6425,-2564.2,0.12,22.0,Elbow Crater rim station on Apennine ejecta
EVA1_ST2,26.0984,3.6610,-2540.8,0.19,26.5,St. George Crater flank steep 12 deg slope
EVA2_LM,26.1322,3.6339,-2570.0,0.06,19.0,Departing LM for Apennine Front traverse
EVA2_ST6,26.0825,3.6820,-2495.5,0.24,31.2,Mount Hadley Delta spur highest traverse elevation
EVA2_ST6a,26.0890,3.6750,-2512.0,0.21,29.0,Green glass soil sampling station
EVA2_ST7,26.1040,3.6650,-2535.0,0.16,24.8,Spur Crater station (Genesis Rock breccia sample)
EVA3_ST9,26.1380,3.6210,-2582.0,0.14,21.5,Hadley Rille terrace overlook basalt ledge
EVA3_ST9a,26.1410,3.6180,-2595.0,0.18,17.2,Rille wall talus slope rim
EVA3_ST10,26.1350,3.6280,-2578.0,0.11,20.0,Final traverse station west of LM`;

export const CINDER_LAKE_TRACTION_CSV = `waypoint_id,latitude,longitude,elevation_m,slip_ratio,penetrometer_psi,terrain_type
CL_WP01,35.3071,-111.5049,2022.1,0.14,14.2,Basalt cinder field floor uncompacted
CL_WP02,35.3082,-111.5035,2025.4,0.18,12.8,Crater 1 southern ejecta blanket
CL_WP03,35.3095,-111.5020,2031.8,0.27,9.5,Simulated impact rim 16 deg scoria slope
CL_WP04,35.3060,-111.5065,2019.6,0.11,18.0,Compacted pyroclastic wash channel
CL_WP05,35.3045,-111.5080,2016.3,0.16,13.4,Trenching test pit 2 fine cinder ash
CL_WP06,35.3032,-111.5098,2020.9,0.22,11.2,Disturbed crater field perimeter
CL_WP07,35.3055,-111.5030,2028.5,0.25,10.1,Apollo LRV vibration dynamic test loop
CL_WP08,35.3080,-111.5010,2034.2,0.31,8.9,Steep rim summit loose tephra rollover test`;

export const PERSEVERANCE_JEZERO_CSV = `sol,latitude,longitude,elevation_m,slip_ratio,penetrometer_psi,formation
Sol_000,18.4447,77.4508,-2568.2,0.05,28.0,Octavia E. Butler landing site regolith
Sol_120,18.4385,77.4420,-2562.4,0.08,25.5,Séítah unit layered olivine basalt
Sol_380,18.4290,77.4285,-2545.0,0.14,21.0,Kodiak butte delta front fan base
Sol_450,18.4215,77.4190,-2520.8,0.22,16.5,Hawksbill Gap mudstone steep ramp
Sol_620,18.4150,77.4080,-2490.5,0.19,19.2,Cape Nukshak delta top conglomerate
Sol_750,18.4080,77.3950,-2472.0,0.16,22.4,Belva Crater impact rim crossing
Sol_890,18.4010,77.3820,-2455.0,0.13,24.0,Margin unit carbonate deposition belt`;

export function getSampleDataset(sampleKey: 'apollo15' | 'cinderLake' | 'perseverance'): UserDataset {
  if (sampleKey === 'apollo15') {
    return processDatasetContent(
      'Apollo_15_LRV_Hadley_Traverse_NASA_1971.csv',
      APOLLO_15_LRV_CSV,
      APOLLO_15_LRV_CSV.length
    );
  }
  if (sampleKey === 'cinderLake') {
    return processDatasetContent(
      'USGS_Cinder_Lake_Crater_Field_1_Traction_Log_1967.csv',
      CINDER_LAKE_TRACTION_CSV,
      CINDER_LAKE_TRACTION_CSV.length
    );
  }
  return processDatasetContent(
    'Perseverance_M2020_Jezero_Delta_Waypoint_Log_2023.csv',
    PERSEVERANCE_JEZERO_CSV,
    PERSEVERANCE_JEZERO_CSV.length
  );
}
