import { useEffect, useState } from "react";
import "./Admin.css";

function Admin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/orders"
      );

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Fetch Orders Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId
              ? { ...order, status }
              : order
          )
        );
      }
    } catch (error) {
      console.error("Status Update Error:", error);
    }
  };

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) =>
      order.status !== "Delivered" &&
      order.status !== "Cancelled"
  ).length;

  const confirmedOrders = orders.filter(
    (order) => order.status === "Order Confirmed"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="admin-header">
        <div>
          <p className="admin-label">SOLEA MANAGEMENT</p>
          <h1>Admin Dashboard</h1>
          <p>Manage customer orders and delivery status.</p>
        </div>

        <button
          className="refresh-btn"
          onClick={() => {
            setLoading(true);
            fetchOrders();
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="admin-stats">

        <div className="stat-card">
          <p>Total Orders</p>
          <h2>{totalOrders}</h2>
        </div>

        <div className="stat-card">
          <p>Pending</p>
          <h2>{pendingOrders}</h2>
        </div>

        <div className="stat-card">
          <p>Confirmed</p>
          <h2>{confirmedOrders}</h2>
        </div>

        <div className="stat-card">
          <p>Delivered</p>
          <h2>{deliveredOrders}</h2>
        </div>

      </div>

      {/* ORDERS */}
      <div className="orders-section">

        <div className="orders-heading">
          <div>
            <p className="admin-label">ORDER MANAGEMENT</p>
            <h2>All Orders</h2>
          </div>

          <span className="order-count">
            {orders.length} Orders
          </span>
        </div>

        {loading ? (
          <p className="admin-message">
            Loading orders...
          </p>
        ) : orders.length === 0 ? (
          <p className="admin-message">
            No orders found.
          </p>
        ) : (
          <div className="orders-table-wrapper">

            <table className="orders-table">

              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>CUSTOMER</th>
                  <th>TRACKING</th>
                  <th>AMOUNT</th>
                  <th>PAYMENT</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>

                {orders.map((order) => (

                  <tr key={order._id}>

                    <td>
                      <strong>
                        {order.orderId}
                      </strong>
                    </td>

                    <td>
                      <strong>
                        {order.customer?.name}
                      </strong>

                      <br />

                      <small>
                        {order.customer?.phone}
                      </small>
                    </td>

                    <td>
                      <span className="tracking-id">
                        {order.trackingId}
                      </span>
                    </td>

                    <td>
                      <strong>
                        ₹{order.totalAmount}
                      </strong>
                    </td>

                    <td>
                      {order.paymentMethod}
                    </td>

                    <td>

  <button
    className="view-details-btn"
    onClick={() => setSelectedOrder(order)}
  >
    VIEW DETAILS
  </button>

                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(
                            order.orderId,
                            e.target.value
                          )
                        }
                      >

                        <option value="Order Placed">
                          Order Placed
                        </option>

                        <option value="Order Confirmed">
                          Order Confirmed
                        </option>

                        <option value="Shipped">
                          Shipped
                        </option>

                        <option value="Out for Delivery">
                          Out for Delivery
                        </option>

                        <option value="Delivered">
                          Delivered
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>

                      </select>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
 );
 
}

export default Admin;