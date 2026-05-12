const haversineDistance = require("./haversine");

/**
 * Nearest-Neighbour TSP heuristic.
 *
 * Given a start point and an array of stops, returns the stops reordered
 * so that each next stop is the closest unvisited one from the current position.
 *
 * This is O(n²) — perfectly fine for delivery route sizes (< 100 stops).
 *
 * @param {{ lat: number, lon: number }} start  - Driver / warehouse origin
 * @param {Array<{ id, lat, lon, address }>} stops - Delivery stops
 * @returns {{ orderedStops, totalDistanceKm, segments }}
 */

const nearestNeighbourTSP = (start, stops) => {
  const unvisited = [...stops];
  const ordered = [];
  const segments = [];

  let current = start;
  let totalDistance = 0;

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let nearestDist = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = haversineDistance(
        current.lat,
        current.lon,
        unvisited[i].lat,
        unvisited[i].lon
      );
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    }

    const nearest = unvisited.splice(nearestIdx, 1)[0];

    segments.push({
      from: { lat: current.lat, lon: current.lon },
      to: { lat: nearest.lat, lon: nearest.lon, address: nearest.address },
      distanceKm: parseFloat(nearestDist.toFixed(2)),
    });

    totalDistance += nearestDist;
    ordered.push(nearest);
    current = nearest;
  }

  return {
    orderedStops: ordered,
    totalDistanceKm: parseFloat(totalDistance.toFixed(2)),
    segments,
  };
};

module.exports = nearestNeighbourTSP;
