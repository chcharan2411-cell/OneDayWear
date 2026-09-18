import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Package,
} from "lucide-react";

import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  increaseStock,
} from "../services/adminProductService";

import "./AdminProducts.css";

const emptyForm = {
  productName: "",
  brand: "OneDayWear",
  category: "MEN",
  productType: "T_SHIRT",
  size: "M",
  rentalPrice: "",
  securityDeposit: "",
  availableQuantity: "",
  imageUrl: "",
  description: "",
};

/* =========================
   SIZE OPTIONS
========================= */

const CLOTHING_SIZES = [
  {
    value: "XS",
    label: "XS",
  },
  {
    value: "S",
    label: "S",
  },
  {
    value: "M",
    label: "M",
  },
  {
    value: "L",
    label: "L",
  },
  {
    value: "XL",
    label: "XL",
  },
  {
    value: "XXL",
    label: "XXL",
  },
];

const SHOE_SIZES = [
  {
    value: "SHOE_6",
    label: "Shoe 6",
  },
  {
    value: "SHOE_7",
    label: "Shoe 7",
  },
  {
    value: "SHOE_8",
    label: "Shoe 8",
  },
  {
    value: "SHOE_9",
    label: "Shoe 9",
  },
  {
    value: "SHOE_10",
    label: "Shoe 10",
  },
  {
    value: "SHOE_11",
    label: "Shoe 11",
  },
  {
    value: "SHOE_12",
    label: "Shoe 12",
  },
];

const PRODUCT_TYPES = [
  { value: "T_SHIRT", label: "T-Shirt" },
  { value: "SHIRT", label: "Shirt" },
  { value: "PANTS", label: "Pants" },
  { value: "JEANS", label: "Jeans" },
  { value: "TROUSERS", label: "Trousers" },
  { value: "JACKET", label: "Jacket" },
  { value: "HOODIE", label: "Hoodie" },
  { value: "SWEATSHIRT", label: "Sweatshirt" },
  { value: "SHOES", label: "Shoes" },
  { value: "SNEAKERS", label: "Sneakers" },
  { value: "DRESS", label: "Dress" },
  { value: "ONE_PIECE", label: "One Piece" },
  { value: "SKIRT", label: "Skirt" },
  { value: "SHORTS", label: "Shorts" },
  { value: "BLAZER", label: "Blazer" },
  { value: "KURTA", label: "Kurta" },
  { value: "SUIT", label: "Suit" },
  { value: "ACCESSORIES", label: "Accessories" },
];

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [showModal, setShowModal] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [saving, setSaving] = useState(false);

  /* =========================
     LOAD PRODUCTS
  ========================= */

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminProducts();

      setProducts(data || []);
    } catch (err) {
      console.error("Error loading products:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* =========================
     HANDLE FORM CHANGE
  ========================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  /* =========================
     OPEN ADD MODAL
  ========================= */

  const openAddModal = () => {
    setEditingProduct(null);

    setForm({
      ...emptyForm,
    });

    setShowModal(true);
  };

  /* =========================
     OPEN EDIT MODAL
  ========================= */

  const openEditModal = (product) => {
    setEditingProduct(product);

    setForm({
  productName: product.productName || "",
  brand: product.brand || "OneDayWear",
  category: product.category || "MEN",
  productType: product.productType || "T_SHIRT",
  size: product.size || "M",
  rentalPrice: product.rentalPrice ?? "",
  securityDeposit: product.securityDeposit ?? "",
  availableQuantity: product.availableQuantity ?? "",
  imageUrl: product.imageUrl || "",
  description: product.description || "",
});

    setShowModal(true);
  };

  /* =========================
     CLOSE MODAL
  ========================= */

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);

    setEditingProduct(null);

    setForm({
      ...emptyForm,
    });
  };

  /* =========================
     SAVE PRODUCT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      setError("");

      const productData = {
  productName: form.productName.trim(),

  brand: form.brand.trim(),

  category: form.category,

  productType: form.productType,

  size: form.size,

  rentalPrice: Number(form.rentalPrice),

  securityDeposit: Number(
    form.securityDeposit
  ),

  availableQuantity: Number(
    form.availableQuantity
  ),

  imageUrl: form.imageUrl.trim(),

  description: form.description.trim(),
};

      if (editingProduct) {
        await updateProduct(
          editingProduct.id,
          productData
        );
      } else {
        await createProduct(productData);
      }

      closeModal();

      await loadProducts();
    } catch (err) {
      console.error(
        "Error saving product:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  };
/* =========================
   INCREASE STOCK
========================= */

const handleIncreaseStock = async (id) => {
  try {
    setError("");

    await increaseStock(id, 1);

    await loadProducts();
  } catch (err) {
    console.error(
      "Error increasing stock:",
      err
    );

    setError(
      err.response?.data?.message ||
        "Unable to increase stock."
    );
  }
};
  /* =========================
     DELETE PRODUCT
  ========================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteProduct(id);

      await loadProducts();
    } catch (err) {
      console.error(
        "Error deleting product:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete product."
      );
    }
  };

  /* =========================
     SEARCH + FILTER
  ========================= */

  const filteredProducts = products.filter(
    (product) => {
      const search = searchTerm
        .toLowerCase()
        .trim();

      const matchesSearch =
        !search ||
        product.productName
          ?.toLowerCase()
          .includes(search) ||
        product.brand
          ?.toLowerCase()
          .includes(search);

      const matchesCategory =
        categoryFilter === "ALL" ||
        product.category === categoryFilter;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );
{/* PRODUCT TYPE */}

<label>
  PRODUCT TYPE

  <select
    name="productType"
    value={form.productType}
    onChange={handleChange}
    required
  >
    {PRODUCT_TYPES.map((type) => (
      <option
        key={type.value}
        value={type.value}
      >
        {type.label}
      </option>
    ))}
  </select>
</label>
  /* =========================
     FORMAT SIZE
  ========================= */

  const formatSize = (size) => {
    if (!size) return "-";

    if (size.startsWith("SHOE_")) {
      return `Shoe ${size.replace(
        "SHOE_",
        ""
      )}`;
    }

    return size;
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <main className="admin-products-page">
        <div className="admin-products-loading">
          <Package size={34} />

          <p>Loading products...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-products-page">

      {/* =========================
          HEADER
      ========================= */}

      <section className="admin-products-header">

        <div>
          <p className="admin-eyebrow">
            ONEDAYWEAR / ADMIN
          </p>

          <h1>PRODUCTS</h1>

          <p className="admin-products-count">
            {products.length} PRODUCTS IN STORE
          </p>
        </div>

        <button
          className="add-product-button"
          onClick={openAddModal}
        >
          <Plus size={18} />

          ADD PRODUCT
        </button>
      </section>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="admin-products-error">
          {error}
        </div>
      )}

      {/* =========================
          CONTROLS
      ========================= */}

      <section className="admin-products-controls">

        <div className="admin-search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="SEARCH PRODUCTS..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </div>

        <div className="admin-category-filters">

          <button
            className={
              categoryFilter === "ALL"
                ? "active"
                : ""
            }
            onClick={() =>
              setCategoryFilter("ALL")
            }
          >
            ALL
          </button>

          <button
            className={
              categoryFilter === "MEN"
                ? "active"
                : ""
            }
            onClick={() =>
              setCategoryFilter("MEN")
            }
          >
            MEN
          </button>

          <button
            className={
              categoryFilter === "WOMEN"
                ? "active"
                : ""
            }
            onClick={() =>
              setCategoryFilter("WOMEN")
            }
          >
            WOMEN
          </button>

          <button
            className={
              categoryFilter === "ONE_PIECES"
                ? "active"
                : ""
            }
            onClick={() =>
              setCategoryFilter(
                "ONE_PIECES"
              )
            }
          >
            ONE PIECES
          </button>

        </div>

      </section>

      {/* =========================
          PRODUCT TABLE
      ========================= */}

      <section className="admin-products-table-wrapper">

        <table className="admin-products-table">

          <thead>
            <tr>
              <th>PRODUCT</th>
              <th>CATEGORY</th>
              <th>SIZE</th>
              <th>RENTAL</th>
              <th>DEPOSIT</th>
              <th>STOCK</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>

            {filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="no-products"
                >
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map(
                (product) => (
                  <tr key={product.id}>

                    {/* PRODUCT */}

                    <td>
                      <div className="admin-product-info">

                        <div className="admin-product-image">

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
                            <Package
                              size={25}
                            />
                          )}

                        </div>

                        <div>
                          <strong>
                            {
                              product.productName
                            }
                          </strong>

                          <span>
                            {product.brand}
                          </span>
                        </div>

                      </div>
                    </td>

                    {/* CATEGORY */}

                    <td>
                      {product.category}
                    </td>

                    {/* SIZE */}

                    <td>
                      <span
                        className={
                          product.size?.startsWith(
                            "SHOE_"
                          )
                            ? "size-badge shoe-size"
                            : "size-badge"
                        }
                      >
                        {formatSize(
                          product.size
                        )}
                      </span>
                    </td>

                    {/* RENTAL */}

                    <td>
                      ₹
                      {Number(
                        product.rentalPrice
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    {/* DEPOSIT */}

                    <td>
                      ₹
                      {Number(
                        product.securityDeposit
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    {/* STOCK */}

                    <td>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }}
  >
    <strong>
      {product.availableQuantity}
    </strong>

    <button
      type="button"
      onClick={() =>
        handleIncreaseStock(product.id)
      }
      title="Increase stock"
      style={{
        width: "28px",
        height: "28px",
        border: "1px solid #111",
        background: "#fff",
        color: "#111",
        cursor: "pointer",
        fontSize: "18px",
        fontWeight: "700",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      +
    </button>
  </div>
</td>

                    {/* ACTIONS */}

                    <td>

                      <div className="product-actions">

                        <button
                          className="edit-product-button"
                          onClick={() =>
                            openEditModal(
                              product
                            )
                          }
                          title="Edit product"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          className="delete-product-button"
                          onClick={() =>
                            handleDelete(
                              product.id
                            )
                          }
                          title="Delete product"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )
            )}

          </tbody>

        </table>

      </section>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {showModal && (
        <div className="admin-product-modal-overlay">

          <div className="admin-product-modal">

            <div className="admin-product-modal-header">

              <div>

                <p className="admin-eyebrow">
                  {editingProduct
                    ? "EDIT PRODUCT"
                    : "NEW PRODUCT"}
                </p>

                <h2>
                  {editingProduct
                    ? "EDIT PRODUCT"
                    : "ADD PRODUCT"}
                </h2>

              </div>

              <button
                className="close-modal-button"
                onClick={closeModal}
              >
                <X size={22} />
              </button>

            </div>

            {/* =========================
                FORM
            ========================= */}

            <form
              className="admin-product-form"
              onSubmit={handleSubmit}
            >

              {/* PRODUCT NAME */}

              <label>
                PRODUCT NAME

                <input
                  type="text"
                  name="productName"
                  value={
                    form.productName
                  }
                  onChange={handleChange}
                  placeholder="Product name"
                  required
                />
              </label>

              {/* BRAND */}

              <label>
                BRAND

                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="Brand"
                  required
                />
              </label>

              {/* CATEGORY */}

              <label>
                CATEGORY

                <select
                  name="category"
                  value={
                    form.category
                  }
                  onChange={handleChange}
                  required
                >
                  <option value="MEN">
                    MEN
                  </option>

                  <option value="WOMEN">
                    WOMEN
                  </option>

                  <option value="ONE_PIECES">
                    ONE PIECES
                  </option>
                </select>
              </label>

              {/* SIZE */}

              <label>
                SIZE

                <select
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  required
                >

                  <optgroup label="Clothing Sizes">

                    {CLOTHING_SIZES.map(
                      (size) => (
                        <option
                          key={size.value}
                          value={
                            size.value
                          }
                        >
                          {size.label}
                        </option>
                      )
                    )}

                  </optgroup>

                  <optgroup label="Shoe Sizes">

                    {SHOE_SIZES.map(
                      (size) => (
                        <option
                          key={size.value}
                          value={
                            size.value
                          }
                        >
                          {size.label}
                        </option>
                      )
                    )}

                  </optgroup>

                </select>
              </label>

              {/* RENTAL PRICE */}

              <label>
                RENTAL PRICE

                <input
                  type="number"
                  name="rentalPrice"
                  value={
                    form.rentalPrice
                  }
                  onChange={handleChange}
                  min="0"
                  required
                />
              </label>

              {/* SECURITY DEPOSIT */}

              <label>
                SECURITY DEPOSIT

                <input
                  type="number"
                  name="securityDeposit"
                  value={
                    form.securityDeposit
                  }
                  onChange={handleChange}
                  min="0"
                  required
                />
              </label>

              {/* AVAILABLE QUANTITY */}

              <label>
                AVAILABLE QUANTITY

                <input
                  type="number"
                  name="availableQuantity"
                  value={
                    form.availableQuantity
                  }
                  onChange={handleChange}
                  min="0"
                  required
                />
              </label>

              {/* IMAGE URL */}

              <label>
                IMAGE URL

                <input
                  type="url"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  required
                />
              </label>

              {/* DESCRIPTION */}

              <label className="full-width-field">
                DESCRIPTION

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={handleChange}
                  placeholder="Product description..."
                  rows="5"
                  required
                />
              </label>

              {/* ACTIONS */}

              <div className="admin-product-form-actions">

                <button
                  type="button"
                  className="cancel-product-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="save-product-button"
                  disabled={saving}
                >
                  {saving
                    ? "SAVING..."
                    : editingProduct
                    ? "UPDATE PRODUCT"
                    : "ADD PRODUCT"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </main>
  );
}

export default AdminProducts;