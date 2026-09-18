import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { getProducts } from "../services/productService";
import "./Wishlist.css";

function Wishlist() {
  const {
    wishlistItems,
    loading,
    toggleWishlist,
    loadWishlist,
  } = useWishlist();

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const getProduct = (productId) => {
    return products.find(
      (product) => Number(product.id) === Number(productId)
    );
  };

  const handleRemove = async (item) => {
    const product = getProduct(item.productId) || {
      id: item.productId,
    };

    await toggleWishlist(product);
  };

  const isLoading = loading || productsLoading;

  if (isLoading) {
    return (
      <main className="wishlist-page">
        <div className="wishlist-message">
          Loading your wishlist...
        </div>
      </main>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <main className="wishlist-page">
        <section className="wishlist-header">
          <p>ONE DAY WEAR</p>
          <h1>WISHLIST</h1>
        </section>

        <section className="wishlist-empty">
          <Heart size={42} strokeWidth={1.2} />

          <h2>YOUR WISHLIST IS EMPTY</h2>

          <p>
            Save the styles you love and come back to them
            whenever you're ready.
          </p>

          <Link to="/products" className="wishlist-shop-button">
            EXPLORE COLLECTION
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="wishlist-page">
      <section className="wishlist-header">
        <p>ONE DAY WEAR</p>
        <h1>WISHLIST</h1>
        <span>
          {wishlistItems.length}{" "}
          {wishlistItems.length === 1 ? "ITEM" : "ITEMS"}
        </span>
      </section>

      <section className="wishlist-section">
        <div className="wishlist-grid">
          {wishlistItems.map((item) => {
            const product = getProduct(item.productId);

            return (
              <article className="wishlist-card" key={item.wishlistId}>
                <Link
                  to={`/products/${item.productId}`}
                  className="wishlist-image"
                >
                  {product?.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={item.productName}
                    />
                  ) : (
                    <div className="wishlist-no-image">
                      NO IMAGE
                    </div>
                  )}

                  {!item.available && (
                    <span className="wishlist-unavailable">
                      OUT OF STOCK
                    </span>
                  )}
                </Link>

                <div className="wishlist-info">
                  <div>
                    <p className="wishlist-brand">
                      ONE DAY WEAR
                    </p>

                    <Link
                      to={`/products/${item.productId}`}
                      className="wishlist-product-name"
                    >
                      {item.productName}
                    </Link>

                    <p className="wishlist-price">
                      ₹{item.rentalPrice} / day
                    </p>
                  </div>

                  <div className="wishlist-actions">
                    <Link
                      to={`/products/${item.productId}`}
                      className="wishlist-view-button"
                    >
                      <ShoppingBag size={17} />
                      VIEW PRODUCT
                    </Link>

                    <button
                      className="wishlist-remove-button"
                      onClick={() => handleRemove(item)}
                      title="Remove from wishlist"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default Wishlist;