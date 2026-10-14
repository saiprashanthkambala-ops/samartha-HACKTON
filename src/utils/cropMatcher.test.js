import { describe, expect, it } from 'vitest';
import { getStorageProfileId, getSafeThresholds } from './cropMatcher.js';

describe('cropMatcher adapter', () => {
  it('maps common crop IDs to ICAR storage profile IDs', () => {
    expect(getStorageProfileId('paddy')).toBe('paddy_grain_ambient');
    expect(getStorageProfileId('wheat')).toBe('wheat_grain_ambient');
    expect(getStorageProfileId('onion')).toBe('onion_bulb_ambient_ventilated');
    expect(getStorageProfileId('potato')).toBe('potato_ware_cold_storage');
    expect(getStorageProfileId('tomato')).toBe('tomato_fresh_cool_storage');
    expect(getStorageProfileId('mango')).toBe('mango_fresh_cold_storage');
    expect(getStorageProfileId('banana')).toBe('banana_green_cool_storage');
    expect(getStorageProfileId('maize')).toBe('maize_grain_ambient');
    expect(getStorageProfileId('groundnut')).toBe('groundnut_pod_ambient');
  });

  it('handles case-insensitive and partial names gracefully', () => {
    expect(getStorageProfileId('Paddy Rice')).toBe('paddy_grain_ambient');
    expect(getStorageProfileId('Red Onion')).toBe('onion_bulb_ambient_ventilated');
    expect(getStorageProfileId('WHEAT')).toBe('wheat_grain_ambient');
    expect(getStorageProfileId('unknown_crop_name')).toBe('paddy_grain_ambient');
  });

  it('returns valid scientific safe threshold bounds', () => {
    const paddyLimits = getSafeThresholds('paddy_grain_ambient');
    expect(paddyLimits.tempMin).toBe(15);
    expect(paddyLimits.tempMax).toBe(25);
    expect(paddyLimits.rhMin).toBe(55);
    expect(paddyLimits.rhMax).toBe(68);
    expect(paddyLimits.moistureMax).toBe(13);

    const onionLimits = getSafeThresholds('onion_bulb_ambient_ventilated');
    expect(onionLimits.tempMin).toBe(25);
    expect(onionLimits.tempMax).toBe(30);
    expect(onionLimits.rhMax).toBe(72);
  });
});
