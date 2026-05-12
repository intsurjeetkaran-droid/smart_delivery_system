const mongoose = require("mongoose");

const trackingSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },

    driverId: {
      type: String,
      required: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "moving",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tracking", trackingSchema);