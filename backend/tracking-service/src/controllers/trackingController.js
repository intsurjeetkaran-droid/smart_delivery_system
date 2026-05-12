const Tracking = require("../models/Tracking");



/*
|--------------------------------------------------------------------------
| POST /api/tracking
| Save a driver location update to DB
|--------------------------------------------------------------------------
*/

exports.saveLocation = async (req, res) => {
  try {
    const { orderId, driverId, latitude, longitude, status } = req.body;

    const record = await Tracking.create({
      orderId,
      driverId,
      latitude,
      longitude,
      status: status || "moving",
    });

    res.status(201).json({
      success: true,
      message: "Location saved successfully",
      tracking: record,
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
| GET /api/tracking/:orderId
| Get full location history for an order
|--------------------------------------------------------------------------
*/

exports.getTrackingHistory = async (req, res) => {
  try {
    const { orderId } = req.params;

    const history = await Tracking.find({ orderId }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: history.length,
      history,
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
| GET /api/tracking/:orderId/latest
| Get the most recent location for an order
|--------------------------------------------------------------------------
*/

exports.getLatestLocation = async (req, res) => {
  try {
    const { orderId } = req.params;

    const latest = await Tracking.findOne({ orderId }).sort({ createdAt: -1 });

    if (!latest) {
      return res.status(404).json({
        success: false,
        message: "No tracking data found for this order",
      });
    }

    res.status(200).json({
      success: true,
      tracking: latest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
