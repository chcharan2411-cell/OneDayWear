import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";
import { Search } from "lucide-react";
import { getProducts } from "../services/productService";
import "./Products.css";

// =========================================================
// SEARCH ALIASES
// =========================================================

const SEARCH_ALIASES = {

  // T-SHIRTS
  tshirt: [
    "tshirt",
    "t-shirt",
    "t shirt",
    "tee",
    "tees",
    "t shirts",
    "t-shirts",
  ],

  "t-shirt": [
    "tshirt",
    "t-shirt",
    "t shirt",
    "tee",
    "tees",
    "t shirts",
    "t-shirts",
  ],

  "t shirt": [
    "tshirt",
    "t-shirt",
    "t shirt",
    "tee",
    "tees",
    "t shirts",
    "t-shirts",
  ],

  tee: [
    "tshirt",
    "t-shirt",
    "t shirt",
    "tee",
    "tees",
  ],

  // SHIRTS
  shirt: [
    "shirt",
    "shirts",
  ],

  // SHOES
  shoe: [
    "shoe",
    "shoes",
    "sneaker",
    "sneakers",
    "footwear",
    "running shoe",
    "sports shoe",
  ],

  shoes: [
    "shoe",
    "shoes",
    "sneaker",
    "sneakers",
    "footwear",
    "running shoe",
    "sports shoe",
  ],

  sneaker: [
    "shoe",
    "shoes",
    "sneaker",
    "sneakers",
    "footwear",
    "running shoe",
    "sports shoe",
  ],

  sneakers: [
    "shoe",
    "shoes",
    "sneaker",
    "sneakers",
    "footwear",
    "running shoe",
    "sports shoe",
  ],

  footwear: [
    "shoe",
    "shoes",
    "sneaker",
    "sneakers",
    "footwear",
  ],

  // PANTS
  pant: [
    "pant",
    "pants",
    "trouser",
    "trousers",
  ],

  pants: [
    "pant",
    "pants",
    "trouser",
    "trousers",
  ],

  trouser: [
    "pant",
    "pants",
    "trouser",
    "trousers",
  ],

  trousers: [
    "pant",
    "pants",
    "trouser",
    "trousers",
  ],

  // JEANS
  jean: [
    "jean",
    "jeans",
    "denim",
  ],

  jeans: [
    "jean",
    "jeans",
    "denim",
  ],

  denim: [
    "jean",
    "jeans",
    "denim",
  ],

  // JACKETS
  jacket: [
    "jacket",
    "jackets",
    "coat",
    "coats",
  ],

  jackets: [
    "jacket",
    "jackets",
    "coat",
    "coats",
  ],

  coat: [
    "jacket",
    "jackets",
    "coat",
    "coats",
  ],

  // HOODIES
  hoodie: [
    "hoodie",
    "hoodies",
    "sweatshirt",
    "sweatshirts",
  ],

  hoodies: [
    "hoodie",
    "hoodies",
    "sweatshirt",
    "sweatshirts",
  ],

  sweatshirt: [
    "hoodie",
    "hoodies",
    "sweatshirt",
    "sweatshirts",
  ],

  // DRESSES
  dress: [
    "dress",
    "dresses",
    "one-piece",
    "one piece",
    "one_pieces",
  ],

  dresses: [
    "dress",
    "dresses",
    "one-piece",
    "one piece",
    "one_pieces",
  ],

  // SHORTS
  short: [
    "short",
    "shorts",
  ],

  shorts: [
    "short",
    "shorts",
  ],

  // BLAZER
  blazer: [
    "blazer",
    "blazers",
    "coat",
    "formal jacket",
  ],

  blazers: [
    "blazer",
    "blazers",
    "coat",
    "formal jacket",
  ],

  // SUIT
  suit: [
    "suit",
    "suits",
    "formal suit",
    "business suit",
  ],

  suits: [
    "suit",
    "suits",
    "formal suit",
    "business suit",
  ],

  // KURTA
  kurta: [
    "kurta",
    "kurtas",
    "ethnic",
    "traditional",
  ],

  kurtas: [
    "kurta",
    "kurtas",
    "ethnic",
    "traditional",
  ],
};

// =========================================================
// NORMALIZE SEARCH
// =========================================================

const normalizeSearch = (value) => {

  return value
    .toLowerCase()
    .trim()
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ");
};

// =========================================================
// GET SEARCH TERMS
// =========================================================

const getSearchTerms = (value) => {

  const normalized =
    normalizeSearch(value);

  const compact =
    normalized.replace(/\s/g, "");

  const aliases =
    SEARCH_ALIASES[normalized] ||
    SEARCH_ALIASES[compact];

  if (aliases) {

    return [
      normalized,
      compact,
      ...aliases,
    ];
  }

  return [
    normalized,
    compact,
  ];
};

// =========================================================
// PRODUCTS COMPONENT
// =========================================================

function Products() {

  const [products, setProducts] =
    useState([]);

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const urlSearch =
    searchParams.get("search") || "";

  // =========================================================
  // CATEGORY FROM URL
  // =========================================================

  const urlCategory =
    searchParams.get("category") || "all";

  const normalizedUrlCategory =
    urlCategory.toLowerCase();

  const validCategories = [
    "all",
    "men",
    "women",
  ];

  const initialCategory =
    validCategories.includes(
      normalizedUrlCategory
    )
      ? normalizedUrlCategory
      : "all";

  const [search, setSearch] =
    useState(urlSearch);

  const [category, setCategory] =
    useState(initialCategory);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================================
  // LOAD PRODUCTS
  // =========================================================

  useEffect(() => {

    loadProducts();

  }, []);

  const loadProducts = async () => {

    try {

      setLoading(true);

      setError("");

      const data =
        await getProducts();

      setProducts(data);

    } catch (err) {

      console.error(
        "Error loading products:",
        err
      );

      setError(
        "Unable to load products."
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================================================
  // SYNC URL SEARCH
  // =========================================================

  useEffect(() => {

    setSearch(urlSearch);

  }, [urlSearch]);

  // =========================================================
  // SYNC URL CATEGORY
  // =========================================================

  useEffect(() => {

    const currentCategory =
      searchParams.get("category") ||
      "all";

    const normalizedCategory =
      currentCategory.toLowerCase();

    if (
      validCategories.includes(
        normalizedCategory
      )
    ) {

      setCategory(normalizedCategory);

    } else {

      setCategory("all");

    }

  }, [searchParams]);

  // =========================================================
  // CHANGE CATEGORY
  // =========================================================

  const handleCategoryChange = (
    selectedCategory
  ) => {

    setCategory(selectedCategory);

    const params = {};

    if (search.trim()) {
      params.search =
        search.trim();
    }

    if (selectedCategory !== "all") {
      params.category =
        selectedCategory;
    }

    setSearchParams(
      params,
      {
        replace: true,
      }
    );
  };

  // =========================================================
  // SMART SEARCH + CATEGORY FILTER
  // =========================================================

  const filteredProducts =
    products.filter((product) => {

      const searchTerm =
        normalizeSearch(search);

      // ---------------------------------------------
      // CATEGORY FILTER
      // ---------------------------------------------

      const matchesCategory =
        category === "all" ||
        product.category
          ?.toLowerCase() ===
          category.toLowerCase();

      if (!matchesCategory) {
        return false;
      }

      // No search text
      if (!searchTerm) {
        return true;
      }

      // ---------------------------------------------
      // GET ALL PRODUCT INFORMATION
      // ---------------------------------------------

      const productText = [

        product.productName,

        product.brand,

        product.category,

        product.productType,

        product.description,

      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .replace(/[-_]/g, " ");

      // ---------------------------------------------
      // GET SEARCH VARIATIONS
      // ---------------------------------------------

      const searchTerms =
        getSearchTerms(search);

      // ---------------------------------------------
      // MATCH ANY SEARCH TERM
      // ---------------------------------------------

      return searchTerms.some((term) => {

        const normalizedTerm =
          normalizeSearch(term);

        const compactTerm =
          normalizedTerm.replace(/\s/g, "");

        const normalizedProductText =
          productText;

        const compactProductText =
          productText.replace(/\s/g, "");

        return (
          normalizedProductText.includes(
            normalizedTerm
          ) ||
          compactProductText.includes(
            compactTerm
          )
        );
      });
    });

  // =========================================================
  // SEARCH INPUT
  // =========================================================

  const handleSearchChange = (e) => {

    const value =
      e.target.value;

    setSearch(value);

    const trimmedValue =
      value.trim();

    const params = {};

    // Preserve category
    if (category !== "all") {
      params.category =
        category;
    }

    // Add search
    if (trimmedValue) {
      params.search =
        trimmedValue;
    }

    setSearchParams(
      params,
      {
        replace: true,
      }
    );
  };

  // =========================================================
  // CLEAR SEARCH
  // =========================================================

  const handleClearSearch = () => {

    setSearch("");

    const params = {};

    // Preserve selected category
    if (category !== "all") {
      params.category =
        category;
    }

    setSearchParams(
      params,
      {
        replace: true,
      }
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (

    <main className="products-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="products-header">

        <p className="products-label">
          ONE DAY WEAR
        </p>

        <h1>
          SHOP COLLECTION
        </h1>

        <p className="products-description">
          Discover premium styles made
          for your special moments.
          Rent your favorite look for
          one day.
        </p>

      </section>

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <section className="products-toolbar">

        {/* CATEGORY FILTERS */}

        <div className="category-filters">

          {/* ALL */}

          <button
            className={
              category === "all"
                ? "active"
                : ""
            }
            onClick={() =>
              handleCategoryChange("all")
            }
          >
            ALL
          </button>

          {/* MEN */}

          <button
            className={
              category === "men"
                ? "active"
                : ""
            }
            onClick={() =>
              handleCategoryChange("men")
            }
          >
            MEN
          </button>

          {/* WOMEN */}

          <button
            className={
              category === "women"
                ? "active"
                : ""
            }
            onClick={() =>
              handleCategoryChange("women")
            }
          >
            WOMEN
          </button>

        </div>

        {/* SEARCH */}

        <div className="product-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search shirts, shoes, pants..."
            value={search}
            onChange={
              handleSearchChange
            }
          />

          {search && (

            <button
              type="button"
              className="search-clear-button"
              onClick={
                handleClearSearch
              }
              aria-label="Clear search"
            >
              ×
            </button>

          )}

        </div>

      </section>

      {/* =================================================
          PRODUCTS
      ================================================= */}

      <section className="products-section">

        {/* LOADING */}

        {loading && (

          <div className="products-message">
            Loading products...
          </div>

        )}

        {/* ERROR */}

        {error && (

          <div className="products-message error">
            {error}
          </div>

        )}

        {/* NO PRODUCTS */}

        {!loading &&
          !error &&
          filteredProducts.length === 0 && (

            <div className="products-message">

              {search ? (

                <>
                  No products found for{" "}

                  <strong>
                    "{search}"
                  </strong>

                  .
                </>

              ) : (

                "No products found."

              )}

            </div>
          )}

        {/* PRODUCT GRID */}

        {!loading &&
          !error &&
          filteredProducts.length > 0 && (

            <div className="products-grid">

              {filteredProducts.map(
                (product) => (

                  <Link
                    to={`/products/${product.id}`}
                    className="product-card"
                    key={product.id}
                  >

                    {/* PRODUCT IMAGE */}

                    <div className="product-image">

                      {product.imageUrl ? (

                        <img
                          src={
                            product.imageUrl
                          }
                          alt={
                            product.productName
                          }
                        />

                      ) : (

                        <div className="no-image">
                          NO IMAGE
                        </div>

                      )}

                      {/* AVAILABILITY */}

                      {product.available ? (

                        <span className="available-badge">
                          AVAILABLE
                        </span>

                      ) : (

                        <span className="unavailable">
                          OUT OF STOCK
                        </span>

                      )}

                    </div>

                    {/* PRODUCT INFORMATION */}

                    <div className="product-info">

                      {/* BRAND */}

                      <p className="product-brand">
                        {product.brand}
                      </p>

                      {/* PRODUCT NAME */}

                      <h3>
                        {product.productName}
                      </h3>

                      {/* PRODUCT TYPE */}

                      {product.productType && (

                        <p className="product-category">

                          {product.productType
                            .replace(
                              /_/g,
                              " "
                            )}

                        </p>

                      )}

                      {/* CATEGORY */}

                      <p className="product-category">

                        {product.category ===
                        "ONE_PIECES"

                          ? "ONE-PIECE"

                          : product.category}

                      </p>

                      {/* PRICE */}

                      <p className="product-price">

                        ₹
                        {
                          product.rentalPrice
                        }{" "}
                        / day

                      </p>

                    </div>

                  </Link>
                )
              )}

            </div>
          )}

      </section>

    </main>
  );
}

export default Products;