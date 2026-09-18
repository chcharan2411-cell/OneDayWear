import { useEffect, useState } from "react";
import axios from "axios";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your orders.");
        return;
      }

      const response = await axios.get(
        "http://localhost:8080/orders/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data);
    } catch (err) {
      console.error("Error loading orders:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Your session has expired. Please login again.");
      } else {
        setError("Unable to load your orders.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="orders-page">

      <section className="orders-header">
        <p>ONE DAY WEAR</p>
        <h1>MY ORDERS</h1>
        <span>View your rental history and current orders.</span>
      </section>

      <section className="orders-section">

        {loading && (
          <div className="orders-message">
            Loading your orders...
          </div>
        )}

        {!loading && error && (
          <div className="orders-message error">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="orders-empty">
            <h2>NO ORDERS YET</h2>
            <p>
              You haven't placed any rental orders yet.
            </p>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="orders-list">

            {orders.map((order) => (
              <article
                className="order-card"
                key={order.id}
              >

                <div className="order-top">

                  <div>
                    <p className="order-label">
                      ORDER
                    </p>

                    <h2>
                      #{order.id}
                    </h2>
                  </div>

                  <span
                    className={`order-status ${order.status?.toLowerCase()}`}
                  >
                    {order.status}
                  </span>

                </div>

                <div className="order-details">

                  <div>
                    <span>PRODUCT ID</span>
                    <strong>{order.productId}</strong>
                  </div>

                  <div>
                    <span>QUANTITY</span>
                    <strong>{order.quantity}</strong>
                  </div>

                  <div>
                    <span>RENTAL START</span>
                    <strong>{order.rentalStartDate}</strong>
                  </div>

                  <div>
                    <span>RENTAL END</span>
                    <strong>{order.rentalEndDate}</strong>
                  </div>

                  <div>
                    <span>RENTAL AMOUNT</span>
                    <strong>
                      ₹{order.totalAmount}
                    </strong>
                  </div>

                  <div>
                    <span>SECURITY DEPOSIT</span>
                    <strong>
                      ₹{order.securityDeposit}
                    </strong>
                  </div>

                </div>

                <div className="order-created">
                  Order placed on{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "—"}
                </div>

              </article>
            ))}

          </div>
        )}

      </section>

    </main>
  );
}

export default MyOrders;