import { Link } from "react-router-dom";
import "./OrderSuccess.css";

function OrderSuccess() {
  return (
    <main className="order-success-page">

      <section className="order-success-container">

        <div className="success-icon">
          ✓
        </div>

        <p className="success-label">
          ONE DAY WEAR
        </p>

        <h1>ORDER CONFIRMED</h1>

        <p className="success-message">
          Your rental order has been successfully placed.
          A confirmation email has been sent to your account.
        </p>

        <div className="success-actions">

          <Link
            to="/products"
            className="success-button primary"
          >
            CONTINUE SHOPPING
          </Link>

          <Link
            to="/"
            className="success-button secondary"
          >
            BACK TO HOME
          </Link>

        </div>

      </section>

    </main>
  );
}

export default OrderSuccess;