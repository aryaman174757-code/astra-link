/**
 * ASTRA-LINK — Timing & Conventional Light-Time Calculations
 * 
 * Formula:
 * light_time_seconds = distance_km / 299792.458
 * where distance is in kilometres and speed of light is 299,792.458 km/s in vacuum.
 */

import { SPEED_OF_LIGHT_KMS } from './simulationConstants.js';

/**
 * Calculates conventional one-way light-time in seconds.
 * @param {number} distanceKm Distance between Earth and Mars in kilometers.
 * @returns {number|null} Time in seconds, or null if input is invalid.
 */
export function calculateOneWayLightTime(distanceKm) {
  if (distanceKm === null || distanceKm === undefined || typeof distanceKm !== 'number' || isNaN(distanceKm)) {
    return null;
  }
  if (distanceKm < 0) {
    return null;
  }
  if (distanceKm === 0) {
    return 0;
  }
  return distanceKm / SPEED_OF_LIGHT_KMS;
}

/**
 * Calculates conventional round-trip light-time in seconds.
 * @param {number} distanceKm Distance between Earth and Mars in kilometers.
 * @returns {number|null} Round trip time in seconds, or null if input is invalid.
 */
export function calculateRoundTripLightTime(distanceKm) {
  const oneWay = calculateOneWayLightTime(distanceKm);
  if (oneWay === null) return null;
  return oneWay * 2;
}

/**
 * Formats a duration in seconds into a clean human-readable string.
 * @param {number|null} seconds 
 * @returns {string} Formatted string, e.g. "18m 13.9s" or "3.1s"
 */
export function formatDurationHuman(seconds) {
  if (seconds === null || seconds === undefined || isNaN(seconds) || seconds < 0) {
    return 'N/A';
  }
  if (seconds === 0) {
    return '0.00s';
  }
  if (seconds < 60) {
    return `${seconds.toFixed(2)}s`;
  }
  
  const totalSeconds = Math.floor(seconds);
  const frac = (seconds - totalSeconds).toFixed(1).substring(1); // e.g. ".9"
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSecs = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSecs}s`;
  }
  return `${minutes}m ${remainingSecs}${frac}s`;
}

/**
 * Compares conventional electromagnetic light-time against configured illustrative ASTRA shortcut duration.
 * @param {number} distanceKm 
 * @param {number} astraShortcutSeconds 
 * @returns {object} Comparison telemetry object.
 */
export function compareLightTimeVsAstra(distanceKm, astraShortcutSeconds = 2.4) {
  const oneWaySeconds = calculateOneWayLightTime(distanceKm);
  const roundTripSeconds = calculateRoundTripLightTime(distanceKm);

  if (oneWaySeconds === null) {
    return {
      isValid: false,
      distanceKm: 0,
      oneWaySeconds: null,
      roundTripSeconds: null,
      astraShortcutSeconds,
      timeDifferenceSeconds: null,
      ratio: null,
      disclaimer: 'Invalid distance parameters provided.'
    };
  }

  const timeDiff = Math.max(0, oneWaySeconds - astraShortcutSeconds);
  const ratio = astraShortcutSeconds > 0 ? (oneWaySeconds / astraShortcutSeconds) : null;

  return {
    isValid: true,
    distanceKm,
    oneWaySeconds,
    roundTripSeconds,
    astraShortcutSeconds,
    timeDifferenceSeconds: timeDiff,
    ratio: ratio,
    formattedOneWay: formatDurationHuman(oneWaySeconds),
    formattedRoundTrip: formatDurationHuman(roundTripSeconds),
    formattedAstra: formatDurationHuman(astraShortcutSeconds),
    formattedDifference: formatDurationHuman(timeDiff),
    disclaimer: 'Shortcut duration is a software simulation parameter, not a measured physical quantity.'
  };
}
