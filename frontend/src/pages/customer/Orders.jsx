import { useEffect, useState } from "react"
import api from "../../api/axios"
import { useAuth } from "../../auth/AuthContext"
import Notification from "../../components/Notification"

const Orders = () => {
  const { token } = useAuth()

  const [orders, setOrders] = useState([])
  const [notification, setNotification] = useState("")
  const [notifType, setNotifType] = useState("success")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setOrders(response.data)

    } catch (err) {
      console.error("Failed to fetch orders")
    }
  }

  const handleMarkReceived = async (orderId) => {
    try {

      await api.patch(
        `/orders/mark-received/${orderId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setNotifType("success")
      setNotification("Order marked as received")

      fetchOrders()

    } catch (err) {

      setNotifType("error")
      setNotification("Payment not completed yet")

    }
  }

  return (
    <div>

      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (

        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Payment Status</th>
              <th>Received Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {orders.map(order =>
              order.items.map(item => (

                <tr
                  key={item.id}
                  style={{
                    opacity:
                      order.received_status === "received" ? 0.5 : 1
                  }}
                >

                  <td>{item.product_name}</td>

                  <td>{item.quantity}</td>

                  <td>{order.payment_status}</td>

                  <td>{order.received_status}</td>

                  <td>

                    {order.payment_status === "paid" &&
                    order.received_status !== "received" ? (

                      <button
                        onClick={() =>
                          handleMarkReceived(order.id)
                        }
                      >
                        Mark Received
                      </button>

                    ) : (
                      "-"
                    )}

                  </td>

                </tr>

              ))
            )}

          </tbody>
        </table>

      )}

      <Notification
        message={notification}
        type={notifType}
        onClose={() => setNotification("")}
      />

    </div>
  )
}

export default Orders