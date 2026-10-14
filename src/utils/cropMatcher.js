/**
 * FarmShield Crop Matching Adapter.
 *
 * Bridges the frontend 37-crop catalogue identifiers with the backend ICAR
 * scientific post-harvest storage profiles from crop_storage_profiles.json.
 */

export const CROP_ID_TO_STORAGE_ID = {
  paddy: 'paddy_grain_ambient',
  wheat: 'wheat_grain_ambient',
  maize: 'maize_grain_ambient',
  groundnut: 'groundnut_pod_ambient',
  onion: 'onion_bulb_ambient_ventilated',
  potato: 'potato_ware_cold_storage',
  tomato: 'tomato_fresh_cool_storage',
  mango: 'mango_fresh_cold_storage',
  banana: 'banana_green_cool_storage',
};

export const DEFAULT_STORAGE_THRESHOLDS = {
  paddy_grain_ambient: { tempMin: 15, tempMax: 25, rhMin: 55, rhMax: 68, moistureMax: 13 },
  wheat_grain_ambient: { tempMin: 15, tempMax: 22, rhMin: 50, rhMax: 65, moistureMax: 12 },
  maize_grain_ambient: { tempMin: 15, tempMax: 25, rhMin: 55, rhMax: 65, moistureMax: 13.5 },
  groundnut_pod_ambient: { tempMin: 18, tempMax: 26, rhMin: 50, rhMax: 65, moistureMax: 9 },
  onion_bulb_ambient_ventilated: { tempMin: 25, tempMax: 30, rhMin: 65, rhMax: 72, moistureMax: null },
  potato_ware_cold_storage: { tempMin: 8, tempMax: 12, rhMin: 85, rhMax: 90, moistureMax: null },
  tomato_fresh_cool_storage: { tempMin: 10, tempMax: 15, rhMin: 85, rhMax: 92, moistureMax: null },
  mango_fresh_cold_storage: { tempMin: 11, tempMax: 13, rhMin: 85, rhMax: 90, moistureMax: null },
  banana_green_cool_storage: { tempMin: 13, tempMax: 15, rhMin: 85, rhMax: 90, moistureMax: null },
};

/**
 * Returns the backend storage profile ID for a given frontend crop ID or name.
 */
export function getStorageProfileId(cropIdOrName) {
  if (!cropIdOrName) return 'paddy_grain_ambient';
  const clean = String(cropIdOrName).toLowerCase().trim();
  if (CROP_ID_TO_STORAGE_ID[clean]) {
    return CROP_ID_TO_STORAGE_ID[clean];
  }
  for (const [key, val] of Object.entries(CROP_ID_TO_STORAGE_ID)) {
    if (clean.includes(key)) return val;
  }
  return 'paddy_grain_ambient';
}

/**
 * Returns safe thresholds for a crop profile.
 */
export function getSafeThresholds(storageCropId) {
  return (
    DEFAULT_STORAGE_THRESHOLDS[storageCropId] || {
      tempMin: 15,
      tempMax: 25,
      rhMin: 50,
      rhMax: 70,
      moistureMax: 14,
    }
  );
}
