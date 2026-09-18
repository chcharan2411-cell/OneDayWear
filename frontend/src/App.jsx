import { Routes, Route } from "react-router-dom";

import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import Navbar from "./components/Navbar";
import Wishlist from "./pages/Wishlist";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import Admin from "./pages/Admin";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import AdminPayments from "./pages/AdminPayments";
import AdminUsers from "./pages/AdminUsers";
import AdminReviews from "./pages/AdminReviews";
import AdminInventory from "./pages/AdminInventory";
import MusicPlayer from "./components/MusicPlayer";

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <MusicPlayer />
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/products" element={<AdminProducts />}/>
          <Route path="/admin/orders" element={<AdminOrders />}/>
          <Route path="/admin/payments" element={<AdminPayments />}/>
          <Route path="/admin/users" element={<AdminUsers />}/>
          <Route path="/admin/reviews" element={<AdminReviews />}/>
          <Route path="/admin/inventory" element={<AdminInventory />}/>
        </Routes>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;