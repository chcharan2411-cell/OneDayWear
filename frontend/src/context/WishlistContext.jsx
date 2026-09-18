import { createContext, useContext, useEffect, useState } from "react";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlistService";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const userEmail = localStorage.getItem("userEmail");

  const loadWishlist = async () => {
    if (!userEmail) {
      setWishlistItems([]);
      return;
    }

    try {
      setLoading(true);

      const data = await getWishlist(userEmail);

      setWishlistItems(data);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) => Number(item.productId) === Number(productId)
    );
  };

  const toggleWishlist = async (product) => {
    if (!userEmail) {
      return;
    }

    try {
      if (isInWishlist(product.id)) {
  const wishlistItem = wishlistItems.find(
    (item) => Number(item.productId) === Number(product.id)
  );

  if (!wishlistItem) {
    return;
  }

  await removeFromWishlist(wishlistItem.wishlistId);

  setWishlistItems((currentItems) =>
    currentItems.filter(
      (item) => Number(item.productId) !== Number(product.id)
    )
  );
} else {
        const response = await addToWishlist(userEmail, product.id);

        setWishlistItems((currentItems) => [
          ...currentItems,
          response,
        ]);
      }
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        loading,
        isInWishlist,
        toggleWishlist,
        loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}