const Order = require("../models/order");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const {
      customer,
      products,
      totalAmount,
      paymentMethod,
    } = req.body;

    // Check required details
    if (
      !customer ||
      !customer.name ||
      !customer.phone ||
      !customer.address ||
      !customer.city ||
      !customer.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide complete customer details",
      });
    }

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    // Generate unique order ID
    const orderId =
      "SOLEA-" +
      Date.now().toString().slice(-8);

      const trackingId =
  "TRK-" +
  Math.random().toString(36).substring(2, 10).toUpperCase();

    // Create order
    const order = new Order({
      orderId,
      trackingId,
      customer,
      products,
      totalAmount,
      paymentMethod,
      status: "Order Placed",
    });

    // Save order to MongoDB
    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  }
};


// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};
// Track order by Tracking ID
const trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      trackingId: req.params.trackingId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Tracking ID not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Track Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to track order",
    });
  }
};


// Get one order by Order ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      orderId: req.params.orderId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};


// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};


module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  trackOrder,
  updateOrderStatus,
};