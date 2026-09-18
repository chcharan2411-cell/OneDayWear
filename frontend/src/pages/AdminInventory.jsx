import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Plus,
  Minus,
  Package,
  AlertTriangle,
  X,
} from "lucide-react";

import {
  getAdminInventory,
  updateInventory,
  restoreStock,
  deductStock,
} from "../services/adminInventoryService";

import "./AdminInventory.css";

function AdminInventory() {
  const [inventory, setInventory] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [stockFilter, setStockFilter] = useState("ALL");

  const [selectedItem, setSelectedItem] = useState(null);

  const [stockQuantity, setStockQuantity] = useState("");

  const [actionLoading, setActionLoading] =
    useState(false);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminInventory();

      setInventory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(
        "Admin inventory error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load inventory."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const filteredInventory = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    return inventory.filter((item) => {
      const productId = String(
        item.productId || ""
      ).toLowerCase();

      const productName = String(
        item.productName || ""
      ).toLowerCase();

      const matchesSearch =
        !search ||
        productId.includes(search) ||
        productName.includes(search);

      const isLowStock =
        Boolean(item.lowStock) ||
        Number(item.availableQuantity || 0) <=
          Number(item.lowStockThreshold || 5);

      const matchesFilter =
        stockFilter === "ALL" ||
        (stockFilter === "LOW" && isLowStock) ||
        (stockFilter === "AVAILABLE" &&
          !isLowStock);

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [
    inventory,
    searchTerm,
    stockFilter,
  ]);

  const lowStockCount = inventory.filter(
    (item) =>
      Boolean(item.lowStock) ||
      Number(item.availableQuantity || 0) <=
        Number(item.lowStockThreshold || 5)
  ).length;

  const totalStock = inventory.reduce(
    (total, item) =>
      total +
      Number(item.availableQuantity || 0),
    0
  );

  const openStockModal = (item) => {
    setSelectedItem(item);
    setStockQuantity("");
  };

  const closeStockModal = () => {
    if (actionLoading) {
      return;
    }

    setSelectedItem(null);
    setStockQuantity("");
  };

  const handleAddStock = async () => {
    const quantity = Number(stockQuantity);

    if (!quantity || quantity < 1) {
      alert("Enter a valid quantity.");
      return;
    }

    try {
      setActionLoading(true);

      const updated = await restoreStock(
        selectedItem.productId,
        quantity
      );

      /*
       * Backend currently returns a String
       * for restore/deduct.
       *
       * Therefore refresh inventory after
       * successful operation.
       */
      await loadInventory();

      alert("Stock added successfully.");

      closeStockModal();
    } catch (err) {
      console.error(
        "Add stock error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to add stock."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveStock = async () => {
    const quantity = Number(stockQuantity);

    if (!quantity || quantity < 1) {
      alert("Enter a valid quantity.");
      return;
    }

    if (
      quantity >
      Number(selectedItem.availableQuantity || 0)
    ) {
      alert("Quantity cannot exceed available stock.");
      return;
    }

    try {
      setActionLoading(true);

      await deductStock(
        selectedItem.productId,
        quantity
      );

      await loadInventory();

      alert("Stock deducted successfully.");

      closeStockModal();
    } catch (err) {
      console.error(
        "Deduct stock error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to deduct stock."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetStock = async () => {
    const quantity = Number(stockQuantity);

    if (stockQuantity === "" || quantity < 0) {
      alert("Enter a valid stock quantity.");
      return;
    }

    try {
      setActionLoading(true);

      await updateInventory(
        selectedItem.productId,
        {
          productId: selectedItem.productId,
          quantity,
        }
      );

      await loadInventory();

      alert("Inventory updated successfully.");

      closeStockModal();
    } catch (err) {
      console.error(
        "Update inventory error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to update inventory."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  if (loading) {
    return (
      <main className="admin-inventory-page">
        <div className="admin-inventory-loading">
          <RefreshCw
            size={28}
            className="inventory-loading-spin"
          />

          <p>LOADING INVENTORY...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-inventory-page">
        <div className="admin-inventory-error">
          <AlertTriangle size={38} />

          <h2>INVENTORY UNAVAILABLE</h2>

          <p>{error}</p>

          <button onClick={loadInventory}>
            <RefreshCw size={16} />
            RETRY
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-inventory-page">

      {/* HEADER */}

      <section className="admin-inventory-header">

        <div>
          <p className="inventory-eyebrow">
            ONEDAYWEAR / ADMIN
          </p>

          <h1>INVENTORY</h1>

          <p className="inventory-subtitle">
            Monitor and manage product stock.
          </p>
        </div>

        <button
          className="inventory-refresh-button"
          onClick={loadInventory}
        >
          <RefreshCw size={17} />
          REFRESH
        </button>

      </section>

      {/* STATISTICS */}

      <section className="inventory-stats">

        <div className="inventory-stat-card">

          <div className="inventory-stat-icon">
            <Package size={20} />
          </div>

          <div>
            <span>PRODUCTS</span>
            <strong>
              {inventory.length}
            </strong>
          </div>

        </div>

        <div className="inventory-stat-card">

          <div className="inventory-stat-icon">
            <Package size={20} />
          </div>

          <div>
            <span>TOTAL STOCK</span>
            <strong>
              {totalStock}
            </strong>
          </div>

        </div>

        <div className="inventory-stat-card warning">

          <div className="inventory-stat-icon">
            <AlertTriangle size={20} />
          </div>

          <div>
            <span>LOW STOCK</span>
            <strong>
              {lowStockCount}
            </strong>
          </div>

        </div>

      </section>

      {/* TOOLBAR */}

      <section className="inventory-toolbar">

        <div className="inventory-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="SEARCH PRODUCT OR PRODUCT ID..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </div>

        <select
          value={stockFilter}
          onChange={(e) =>
            setStockFilter(e.target.value)
          }
        >
          <option value="ALL">
            ALL STOCK
          </option>

          <option value="AVAILABLE">
            AVAILABLE
          </option>

          <option value="LOW">
            LOW STOCK
          </option>
        </select>

      </section>

      {/* TABLE */}

      <section className="inventory-table-wrapper">

        <table className="inventory-table">

          <thead>
            <tr>
              <th>PRODUCT</th>
              <th>PRODUCT ID</th>
              <th>AVAILABLE STOCK</th>
              <th>THRESHOLD</th>
              <th>STATUS</th>
              <th>LAST UPDATED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>

            {filteredInventory.length === 0 ? (

              <tr>
                <td
                  colSpan="7"
                  className="inventory-empty"
                >
                  NO INVENTORY FOUND
                </td>
              </tr>

            ) : (

              filteredInventory.map((item) => {

                const quantity =
                  Number(
                    item.availableQuantity || 0
                  );

                const threshold =
                  Number(
                    item.lowStockThreshold || 5
                  );

                const isLowStock =
                  Boolean(item.lowStock) ||
                  quantity <= threshold;

                return (
                  <tr key={item.productId}>

                    <td>
                      <strong>
                        {item.productName ||
                          `Product #${item.productId}`}
                      </strong>
                    </td>

                    <td>
                      #{item.productId}
                    </td>

                    <td>
                      <strong
                        className={
                          isLowStock
                            ? "inventory-quantity-low"
                            : ""
                        }
                      >
                        {quantity}
                      </strong>
                    </td>

                    <td>
                      {threshold}
                    </td>

                    <td>

                      <span
                        className={`inventory-status ${
                          isLowStock
                            ? "inventory-status-low"
                            : "inventory-status-good"
                        }`}
                      >
                        {isLowStock
                          ? "LOW STOCK"
                          : "IN STOCK"}
                      </span>

                    </td>

                    <td>
                      {formatDate(
                        item.lastUpdated
                      )}
                    </td>

                    <td>

                      <button
                        className="inventory-manage-button"
                        onClick={() =>
                          openStockModal(item)
                        }
                      >
                        MANAGE
                      </button>

                    </td>

                  </tr>
                );
              })

            )}

          </tbody>

        </table>

      </section>

      {/* STOCK MODAL */}

      {selectedItem && (

        <div
          className="inventory-modal-overlay"
          onClick={closeStockModal}
        >

          <div
            className="inventory-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="inventory-modal-header">

              <div>
                <span>
                  INVENTORY MANAGEMENT
                </span>

                <h2>
                  {selectedItem.productName ||
                    `Product #${selectedItem.productId}`}
                </h2>
              </div>

              <button
                onClick={closeStockModal}
                disabled={actionLoading}
              >
                <X size={20} />
              </button>

            </div>

            <div className="inventory-modal-current">

              <span>CURRENT STOCK</span>

              <strong>
                {selectedItem.availableQuantity}
              </strong>

            </div>

            <label>
              QUANTITY
            </label>

            <input
              type="number"
              min="1"
              placeholder="Enter quantity"
              value={stockQuantity}
              onChange={(e) =>
                setStockQuantity(
                  e.target.value
                )
              }
            />

            <div className="inventory-modal-actions">

              <button
                className="inventory-add-button"
                onClick={handleAddStock}
                disabled={actionLoading}
              >
                <Plus size={17} />
                ADD STOCK
              </button>

              <button
                className="inventory-remove-button"
                onClick={handleRemoveStock}
                disabled={actionLoading}
              >
                <Minus size={17} />
                DEDUCT STOCK
              </button>

            </div>

            <button
              className="inventory-set-button"
              onClick={handleSetStock}
              disabled={actionLoading}
            >
              SET EXACT STOCK
            </button>

          </div>

        </div>

      )}

    </main>
  );
}

export default AdminInventory;