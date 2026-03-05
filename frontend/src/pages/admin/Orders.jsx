import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

const Orders = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);
  const filteredOrders = orders.filter((order) => {
    if (filter === "unpaid") {
      return order.payment_status === "unpaid";
    }

    if (filter === "completed") {
      return order.received_status === "received";
    }

    return true;
  });
  const totalOrders = orders.length;

  const unpaidOrders = orders.filter(
    (order) => order.payment_status === "unpaid",
  ).length;

  const completedOrders = orders.filter(
    (order) => order.received_status === "received",
  ).length;

  const todayOrders = orders.filter((order) => {
    const orderDate = new Date(order.created_at).toDateString();
    const today = new Date().toDateString();

    return orderDate === today;
  }).length;

  const toggleOrder = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/admin/all/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders");
    }
  };

  const markPaid = async (orderId) => {
    try {
      await api.patch(
        `/orders/admin/mark-paid/${orderId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchOrders();
    } catch (err) {
      console.error("Failed to mark paid");
    }
  };

  return (
    <div>
      <h2>Order Management</h2>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={{ border: "1px solid #ccc", padding: "10px" }}>
          <strong>Total Orders</strong>
          <p>{totalOrders}</p>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "10px" }}>
          <strong>Unpaid Orders</strong>
          <p>{unpaidOrders}</p>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "10px" }}>
          <strong>Completed Orders</strong>
          <p>{completedOrders}</p>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "10px" }}>
          <strong>Today's Orders</strong>
          <p>{todayOrders}</p>
        </div>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <button onClick={() => setFilter("all")}>All Orders</button>

        <button
          onClick={() => setFilter("unpaid")}
          style={{ marginLeft: "10px" }}
        >
          Unpaid Orders
        </button>

        <button
          onClick={() => setFilter("completed")}
          style={{ marginLeft: "10px" }}
        >
          Completed Orders
        </button>
      </div>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>User</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Order Type</th>
              <th>Delivery Method</th>
              <th>Payment Method</th>
              <th>Payment Status</th>
              <th>Received</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) =>
              order.items.map((item) => (
                <>
                  {/* Main Order Row */}

                  <tr key={item.id}>
                    <td>{order.user_email}</td>

                    <td
                      style={{
                        cursor: "pointer",
                        color: "#007bff",
                        fontWeight: "500",
                      }}
                      onClick={() => toggleOrder(order.id)}
                    >
                      {item.product_name}
                    </td>

                    <td>{item.quantity}</td>

                    <td>{order.order_type}</td>

                    <td>{order.delivery_method}</td>

                    <td>{order.payment_method}</td>

                    <td>{order.payment_status}</td>

                    <td>{order.received_status}</td>

                    <td>
                      {order.payment_status === "unpaid" && (
                        <button onClick={() => markPaid(order.id)}>
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Expandable Details Row */}

                  {expandedOrder === order.id && (
                    <tr>
                      <td colSpan="9">
                        <div style={{ padding: "10px", background: "#f5f5f5" }}>
                          <p>
                            <strong>Order Type:</strong> {order.order_type}
                          </p>

                          <p>
                            <strong>Installation:</strong>{" "}
                            {order.installation_type}
                          </p>

                          <p>
                            <strong>Delivery Method:</strong>{" "}
                            {order.delivery_method}
                          </p>

                          {order.delivery_method === "home_delivery" && (
                            <p>
                              <strong>Delivery Address:</strong>{" "}
                              {order.delivery_address}
                            </p>
                          )}

                          <p>
                            <strong>Payment Method:</strong>{" "}
                            {order.payment_method}
                          </p>

                          <p>
                            <strong>Order Time:</strong> {order.created_at}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )),
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
