const nearestNeighbourTSP = require("../utils/tsp");
const calculateETA = require("../utils/eta");
const haversineDistance = require("../utils/haversine");



/*
|--------------------------------------------------------------------------
| POST /api/routes/optimize
|
| Optimizes a multi-stop delivery route using nearest-neighbour TSP.
|
| Request body:
| {
|   "start": { "lat": 28.6139, "lon": 77.2090 },   ← driver/warehouse origin
|   "stops": [
|     { "id": "order1", "lat": 28.7041, "lon": 77.1025, "address": "Stop A" },
|     { "id": "order2", "lat": 28.5355, "lon": 77.3910, "address": "Stop B" }
|   ]
| }
|--------------------------------------------------------------------------
*/

exports.optimizeRoute = (req, res) => {
  try {
    const { start, stops } = req.body;

    // ── Validation ──────────────────────────────────────────────────────────

    if (!start || typeof start.lat !== "number" || typeof start.lon !== "number") {
      return res.status(400).json({
        success: false,
        message: "start must have numeric lat and lon fields",
      });
    }

    if (!Array.isArray(stops) || stops.length === 0) {
      return res.status(400).json({
        success: false,
        message: "stops must be a non-empty array",
      });
    }

    for (let i = 0; i < stops.length; i++) {
      const s = stops[i];
      if (typeof s.lat !== "number" || typeof s.lon !== "number") {
        return res.status(400).json({
          success: false,
          message: `Stop at index ${i} must have numeric lat and lon fields`,
        });
      }
    }

    // ── Optimize ─────────────────────────────────────────────────────────────

    const { orderedStops, totalDistanceKm, segments } = nearestNeighbourTSP(start, stops);

    const { estimatedMinutes, estimatedTimeFormatted } = calculateETA(
      totalDistanceKm,
      orderedStops.length
    );

    res.status(200).json({
      success: true,
      message: "Route optimized successfully",
      result: {
        start,
        orderedStops,
        segments,
        totalDistanceKm,
        estimatedMinutes,
        estimatedTimeFormatted,
        totalStops: orderedStops.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



/*
|--------------------------------------------------------------------------
| POST /api/routes/distance
|
| Calculate straight-line distance between two coordinates.
|
| Request body:
| {
|   "from": { "lat": 28.6139, "lon": 77.2090 },
|   "to":   { "lat": 28.7041, "lon": 77.1025 }
| }
|--------------------------------------------------------------------------
*/

exports.calculateDistance = (req, res) => {
  try {
    const { from, to } = req.body;

    if (
      !from || typeof from.lat !== "number" || typeof from.lon !== "number" ||
      !to   || typeof to.lat   !== "number" || typeof to.lon   !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message: "from and to must each have numeric lat and lon fields",
      });
    }

    const distanceKm = haversineDistance(from.lat, from.lon, to.lat, to.lon);

    const { estimatedMinutes, estimatedTimeFormatted } = calculateETA(distanceKm, 1);

    res.status(200).json({
      success: true,
      result: {
        from,
        to,
        distanceKm: parseFloat(distanceKm.toFixed(2)),
        estimatedMinutes,
        estimatedTimeFormatted,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
