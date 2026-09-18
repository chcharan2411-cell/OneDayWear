import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();
const securityDepositTotal = cartItems.reduce(
  (total, item) =>
    total + Number(item.securityDeposit || 0) * item.quantity,
  0
);
  if (cartItems.length === 0) {
    return (
      <main className="cart-page">

        <section className="empty-cart">
          <p className="cart-label">YOUR BAG</p>

          <h1>Your bag is empty.</h1>

          <p>
            Discover something special for your next moment.
          </p>

          <Link to="/products" className="continue-shopping">
            EXPLORE COLLECTION
          </Link>
        </section>

      </main>
    );
  }

  return (
    <main className="cart-page">

      <section className="cart-header">
        <p className="cart-label">ONE DAY WEAR</p>
        <h1>YOUR BAG</h1>
      </section>

      <section className="cart-content">

        {/* Cart Items */}
        <div className="cart-items">

          {cartItems.map((item) => (

            <div className="cart-item" key={item.id}>

              <div className="cart-item-image">

                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                  />
                ) : (
                  <span>NO IMAGE</span>
                )}

              </div>

              <div className="cart-item-info">

                <p className="cart-item-brand">
                  {item.brand}
                </p>

                <h2>
                  {item.productName}
                </h2>

                <p className="cart-item-category">
  {item.category === "ONE_PIECES"
    ? "ONE-PIECE"
    : item.category}
</p>

                <p className="cart-item-size">
                  Size: {item.size}
                </p>

                <p className="cart-item-price">
                  ₹{item.rentalPrice} / day
                </p>

                <div className="cart-item-actions">

                  <div className="quantity-control">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
  onClick={() => {
    if (
      item.availableQuantity &&
      item.quantity >= item.availableQuantity
    ) {
      return;
    }

    updateQuantity(
      item.id,
      item.quantity + 1
    );
  }}
  disabled={
    item.availableQuantity &&
    item.quantity >= item.availableQuantity
  }
>
  +
</button>

                  </div>

                  <button
                    className="remove-button"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                  >
                    REMOVE
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* Summary */}
        <aside className="cart-summary">

          <h2>SUMMARY</h2>

          <div className="summary-row">
            <span>Rental total</span>
            <strong>₹{cartTotal}</strong>
          </div>

          <div className="summary-row">
  <span>Security deposit</span>
  <strong>₹{securityDepositTotal}</strong>
</div>

          <div className="summary-divider" />

          <div className="summary-row total">
            <span>Subtotal</span>
            <strong>₹{cartTotal}</strong>
          </div>

          <Link to="/checkout" className="checkout-button">
  CHECKOUT
</Link>

          <Link
            to="/products"
            className="continue-shopping-link"
          >
            CONTINUE SHOPPING
          </Link>

        </aside>

      </section>

    </main>
  );
}

export default Cart;