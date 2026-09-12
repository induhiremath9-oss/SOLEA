const express = require("express");

const {
  createOrder,
  getAllOrders,
  getOrderById,
  trackOrder,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

// Place a new order
router.post("/", createOrder);

// Get all orders
router.get("/", getAllOrders);

// Track order by Tracking ID
router.get("/track/:trackingId", trackOrder);

// Get one order by Order ID
router.get("/:orderId", getOrderById);

// Update order status
router.put("/:orderId/status", updateOrderStatus);

module.exports = router;