/**
 * TERRALIGN — Planetary Scientific Datasets Catalog
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 */

import type { DatasetSpecification, ScientificProviderMetadata } from '@/types/science';

export const SCIENTIFIC_PROVIDERS: ScientificProviderMetadata[] = [
  {
    id: 'USGS',
    name: 'U.S. Geological Survey (USGS)',
    agency: 'United States Department of the Interior',
    description: 'National 3D Elevation Program (3DEP) airborne LiDAR and seamless high-resolution elevation products across terrestrial analog testing sites.',
    supportedBodies: ['earth'],
    primaryEndpoints: [
      'https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer',
      'https://api.opentopodata.org/v1/ned10m',
    ],
    status: 'ONLINE',
    authRequired: false,
    termsUrl: 'https://www.usgs.gov/information-policies-and-instructions/copyrights-and-credits',
  },
  {
    id: 'NASA_PDS_LOLA',
    name: 'NASA Planetary Data System (LRO LOLA Science Team)',
    agency: 'NASA Goddard Space Flight Center / Washington University RSL',
    description: 'Lunar Orbiter Laser Altimeter (LOLA) onboard the Lunar Reconnaissance Orbiter (LRO). Provides multi-beam laser pulse return topography, polar shadow depths, and roughness parameters.',
    supportedBodies: ['moon'],
    primaryEndpoints: [
      'https://oderest.rsl.wustl.edu/live2/',
      'https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/',
    ],
    status: 'ONLINE',
    authRequired: false,
    termsUrl: 'https://pds.nasa.gov/home/users/cite.shtml',
  },
  {
    id: 'NASA_PDS_MOLA',
    name: 'NASA Planetary Data System (MGS MOLA Science Team)',
    agency: 'NASA Goddard Space Flight Center / MIT / Washington University RSL',
    description: 'Mars Orbiter Laser Altimeter (MOLA) onboard Mars Global Surveyor (MGS). Provides global gridded topographic datums (MEGDR) and precision orbital altimeter profiles.',
    supportedBodies: ['mars'],
    primaryEndpoints: [
      'https://oderest.rsl.wustl.edu/live2/',
      'https://pds-geosciences.wustl.edu/mgs/mgs-m-mola-5-megdr-l3-v1/',
    ],
    status: 'ONLINE',
    authRequired: false,
    termsUrl: 'https://pds.nasa.gov/home/users/cite.shtml',
  },
];

export const SCIENTIFIC_DATASETS: DatasetSpecification[] = [
  // ── Earth Datasets ──────────────────────────────────────────────
  {
    id: 'usgs_3dep_1m',
    name: 'USGS 3DEP 1-Meter Bare Earth LiDAR DEM',
    body: 'earth',
    provider: 'U.S. Geological Survey (USGS)',
    productId: 'USGS_3DEP_1M_LIDAR',
    description: 'High-density airborne LiDAR point cloud interpolated to bare-earth 1.0-meter digital elevation grids across US terrestrial analog sites (e.g. Cinder Lake, AZ).',
    resolutionNominal: '1.0 meter horizontal grid spacing',
    spatialCoverage: 'Continental United States, Hawaii, Alaska (Coverage at US Analog Sites)',
    units: 'Meters above NAVD88 vertical datum',
    crs: 'EPSG:4326 (WGS84) / UTM Projected',
    availability: 'ONLINE',
    citation: 'USGS National Geospatial Program, 3D Elevation Program (3DEP), Fact Sheet 2020-3027.',
    sourceUrl: 'https://www.usgs.gov/3d-elevation-program',
  },
  {
    id: 'usgs_ned_10m',
    name: 'USGS National Elevation Dataset (NED) 10-Meter Grid',
    body: 'earth',
    provider: 'U.S. Geological Survey (USGS) / OpenTopoData',
    productId: 'USGS_NED_10M_3DEP',
    description: 'Seamless 1/3 arc-second (~10-meter) digital elevation model derived from photogrammetry and LiDAR surveys, providing rapid live elevation querying.',
    resolutionNominal: '10.0 meters (~1/3 arc-sec)',
    spatialCoverage: 'United States & US Territories',
    units: 'Meters above sea level',
    crs: 'EPSG:4326 (WGS84)',
    availability: 'ONLINE',
    citation: 'Gesch, D.B., et al. (2002). The National Elevation Dataset. Photogrammetric Engineering and Remote Sensing.',
    sourceUrl: 'https://api.opentopodata.org/v1/ned10m',
  },
  {
    id: 'nasa_srtm_30m',
    name: 'NASA SRTM 1 Arc-Second Global Elevation (SRTM-GL1)',
    body: 'earth',
    provider: 'NASA / NGA / USGS',
    productId: 'SRTM_GL1_30M',
    description: 'Radar interferometric digital elevation model acquired during Space Shuttle Endeavour STS-99, providing global coverage (56°S to 60°N) for volcanic highlands and deserts.',
    resolutionNominal: '30.0 meters (1 arc-sec)',
    spatialCoverage: 'Global terrestrial (56°S to 60°N)',
    units: 'Meters (EGM96 geoid)',
    crs: 'EPSG:4326 (WGS84)',
    availability: 'ONLINE',
    citation: 'Farr, T.G., et al. (2007). The Shuttle Radar Topography Mission. Reviews of Geophysics, 45, RG2004.',
    sourceUrl: 'https://api.opentopodata.org/v1/srtm30m',
  },

  // ── Moon Datasets ───────────────────────────────────────────────
  {
    id: 'nasa_lola_ldem_875s',
    name: 'NASA LRO LOLA Polar Digital Elevation Model (LDEM_875S)',
    body: 'moon',
    provider: 'NASA Planetary Data System / LRO LOLA Team',
    productId: 'LDEM_875S_5M',
    description: 'High-resolution polar digital elevation model centered at the Lunar South Pole (87.5°S to 90°S), mapping Shackleton Crater, Shoemaker, and the Peak of Eternal Light.',
    resolutionNominal: '5.0 to 20.0 meters per pixel (interpolated polar stereographic)',
    spatialCoverage: 'Lunar South Pole: 87.5°S to 90.0°S, 0° to 360°E',
    units: 'Meters relative to lunar reference sphere (1,737,400 m)',
    crs: 'Lunar Polar Stereographic (Center: 90°S, 0°E)',
    availability: 'ONLINE',
    citation: 'Smith, D.E., et al. (2010). The Lunar Orbiter Laser Altimeter Investigation on the Lunar Reconnaissance Orbiter Mission. Space Science Reviews, 150(1-4), 209-241.',
    sourceUrl: 'https://oderest.rsl.wustl.edu/live2/?target=moon&query=product&ihid=LRO&iid=LOLA&pt=GDRDEM',
  },
  {
    id: 'nasa_lola_global_gdrdem',
    name: 'NASA LRO LOLA Global Gridded Altimetry Map (GDRDEM)',
    body: 'moon',
    provider: 'NASA Planetary Data System / LRO LOLA Team',
    productId: 'LOLA_GDRDEM_PDS4',
    description: 'PDS4 standardized shape map of the Moon derived from over 6.5 billion individual laser altimeter pulses, covering equatorial and polar regions.',
    resolutionNominal: '236.9 meters per pixel (128 pixels per degree)',
    spatialCoverage: 'Global Lunar Sphere (-90° to +90° Lat, 0° to 360° Lon)',
    units: 'Kilometers / Meters radial distance from center of mass',
    crs: 'Lunar Mean Earth / Polar Axis (ME) Reference Frame',
    availability: 'ONLINE',
    citation: 'Barker, M.K., et al. (2016). A new lunar digital elevation model from the Lunar Orbiter Laser Altimeter and SELENE Terrain Camera. Icarus, 273, 346-355.',
    sourceUrl: 'https://oderest.rsl.wustl.edu/live2/',
  },

  // ── Mars Datasets ───────────────────────────────────────────────
  {
    id: 'nasa_mola_megdr_128',
    name: 'NASA MGS MOLA Mission Experiment Gridded Data Record (MEGDR_128)',
    body: 'mars',
    provider: 'NASA Planetary Data System / MGS MOLA Science Team',
    productId: 'MOLA_MEGDR_128_GMM3',
    description: 'Mars Global Surveyor MOLA global topographic map evaluated against the Goddard Mars Gravity Model (GMM3). Referenced to the equipotential areoid datum.',
    resolutionNominal: '463.0 meters per pixel (128 pixels per degree)',
    spatialCoverage: 'Global Mars (-88° to +88° Lat, 0° to 360°E Lon)',
    units: 'Meters above MOLA aeroid datum',
    crs: 'Mars IAU 2000 Planetocentric / Planetographic coordinates',
    availability: 'ONLINE',
    citation: 'Smith, D.E., et al. (2001). Mars Orbiter Laser Altimeter: Experiment summary after the first nominal mapping mission. J. Geophys. Res., 106(E10), 23689-23722.',
    sourceUrl: 'https://oderest.rsl.wustl.edu/live2/?target=mars&query=product&ihid=MGS&iid=MOLA&pt=MEGDR',
  },
  {
    id: 'hirise_dtm_jezero',
    name: 'NASA MRO HiRISE Digital Terrain Model (Jezero Crater Delta)',
    body: 'mars',
    provider: 'NASA / University of Arizona / USGS Astrogeology',
    productId: 'HIRISE_DTM_JEZERO_DELTA_1M',
    description: 'Sub-meter stereo photogrammetric digital terrain model mapping the western fan deposit and river delta within Jezero Crater (Perseverance landing ellipse).',
    resolutionNominal: '1.0 meter horizontal grid spacing',
    spatialCoverage: 'Jezero Crater Delta (18.38°N, 77.58°E)',
    units: 'Meters relative to MOLA areoid',
    crs: 'Equirectangular Mars Sphere (R = 3,396,190 m)',
    availability: 'ONLINE',
    citation: 'McEwen, A.S., et al. (2007). Mars Reconnaissance Orbiter\'s High Resolution Imaging Science Experiment (HiRISE). J. Geophys. Res., 112, E05S02.',
    sourceUrl: 'https://www.uahirise.org/dtm/',
  },
];

export function getAllDatasets(): DatasetSpecification[] {
  return SCIENTIFIC_DATASETS;
}

export function getDatasetsByBody(body: string): DatasetSpecification[] {
  return SCIENTIFIC_DATASETS.filter((d) => d.body === body);
}

export function getDatasetById(id: string): DatasetSpecification | undefined {
  return SCIENTIFIC_DATASETS.find((d) => d.id === id);
}
