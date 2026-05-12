/**
 * Estimate delivery time based on distance.
 *
 * Assumes average delivery speed of 30 km/h in urban areas.
 * Adds a 10-minute buffer per stop for pickup/dropoff.
 *
 * @param {number} totalDistanceKm
 * @param {number} numberOfStops
 * @returns {{ estimatedMinutes: number, estimatedTimeFormatted: string }}
 */

const AVERAGE_SPEED_KMH = 30;
const STOP_BUFFER_MINUTES = 10;

const calculateETA = (totalDistanceKm, numberOfStops) => {
  const travelMinutes = (totalDistanceKm / AVERAGE_SPEED_KMH) * 60;
  const stopMinutes = numberOfStops * STOP_BUFFER_MINUTES;
  const totalMinutes = Math.ceil(travelMinutes + stopMinutes);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let formatted;
  if (hours > 0) {
    formatted = `${hours}h ${minutes}m`;
  } else {
    formatted = `${minutes}m`;
  }

  return {
    estimatedMinutes: totalMinutes,
    estimatedTimeFormatted: formatted,
  };
};

module.exports = calculateETA;
