import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  X,
} from "lucide-react";

import "./Navbar.css";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    setIsLoggedIn(false);

    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const query = searchText.trim();

    if (!query) {
      navigate("/products");
      return;
    }

    navigate(`/products?search=${encodeURIComponent(query)}`);

    setSearchOpen(false);
  };

  const handleSearchClick = () => {
    setSearchOpen((current) => !current);
  };

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="logo">
          OneDayWear
        </Link>

        {/* Main Navigation */}
        <div className="nav-links">
          <Link to="/men">MEN</Link>
          <Link to="/women">WOMEN</Link>
          <Link to="/collections">COLLECTIONS</Link>
          <Link to="/new-arrivals">NEW ARRIVALS</Link>
        </div>

        {/* Right Side */}
        <div className="nav-actions">

          {isLoggedIn && (
            <Link to="/my-orders" className="orders-link">
              MY ORDERS
            </Link>
          )}

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="nav-icon wishlist-nav-icon"
            title="Wishlist"
          >
            <Heart size={21} />

            {wishlistCount > 0 && (
              <span className="wishlist-count">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Search */}
          <button
            type="button"
            className="nav-icon search-nav-button"
            onClick={handleSearchClick}
            title="Search"
          >
            {searchOpen ? (
              <X size={21} />
            ) : (
              <Search size={21} />
            )}
          </button>

          {/* Login / Logout */}
          {isLoggedIn ? (
            <button
              className="nav-icon"
              onClick={handleLogout}
              title="Logout"
            >
              <User size={21} />
            </button>
          ) : (
            <Link
              to="/login"
              className="nav-icon"
              title="Login"
            >
              <User size={21} />
            </Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="nav-icon cart-icon"
            title="Cart"
          >
            <ShoppingBag size={21} />

            <span className="cart-count">
              {cartCount}
            </span>
          </Link>

        </div>
      </div>

      {/* Search Box */}
      {searchOpen && (
        <div className="navbar-search-container">
          <form
            className="navbar-search-form"
            onSubmit={handleSearchSubmit}
          >
            <Search size={20} />

            <input
              type="text"
              autoFocus
              placeholder="Search shirts, jackets, pants..."
              value={searchText}
              onChange={(e) =>
                setSearchText(e.target.value)
              }
            />

            {searchText && (
              <button
                type="button"
                className="navbar-search-clear"
                onClick={() => setSearchText("")}
              >
                <X size={18} />
              </button>
            )}

            <button
              type="submit"
              className="navbar-search-submit"
            >
              SEARCH
            </button>
          </form>
        </div>
      )}
    </nav>
  );
}

export default Navbar;