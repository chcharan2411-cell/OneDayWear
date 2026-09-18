import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Trash2,
  Eye,
  X,
} from "lucide-react";

import {
  getAdminOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderCount,
  getTotalRevenue,
} from "../services/adminOrderService";

import "./AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        ordersData,
        countData,
        revenueData,
      ] = await Promise.all([
        getAdminOrders(),
        getOrderCount(),
        getTotalRevenue(),
      ]);

      setOrders(ordersData || []);
      setOrderCount(countData || 0);
      setRevenue(revenueData || 0);
    } catch (err) {
      console.error("Admin orders error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load orders. Make sure Order Service is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status,
              }
            : order
        )
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder((current) => ({
          ...current,
          status,
        }));
      }
    } catch (err) {
      console.error("Status update error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to update order status."
      );
    }
  };

  const handleDelete = async (orderId) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete order #${orderId}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteOrder(orderId);

      setOrders((currentOrders) =>
        currentOrders.filter(
          (order) => order.id !== orderId
        )
      );

      setOrderCount((current) =>
        current > 0 ? current - 1 : 0
      );

      setSelectedOrder(null);

      // Refresh revenue/count from backend
      try {
        const [countData, revenueData] =
          await Promise.all([
            getOrderCount(),
            getTotalRevenue(),
          ]);

        setOrderCount(countData || 0);
        setRevenue(revenueData || 0);
      } catch {
        // Main delete operation already succeeded.
      }
    } catch (err) {
      console.error("Delete order error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to delete order."
      );
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const search = searchTerm
        .trim()
        .toLowerCase();

      const matchesSearch =
        !search ||
        String(order.id)
          .toLowerCase()
          .includes(search) ||
        (order.userEmail || "")
          .toLowerCase()
          .includes(search) ||
        String(order.productId)
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "ALL" ||
        order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  /*
   * We don't assume enum values that were not provided
   * by your backend code.
   *
   * These values are collected from the orders currently
   * returned by your backend.
   */
  const statuses = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "RETURNED",
  "COMPLETED",
];

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMoney = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  };

  if (loading) {
    return (
      <main className="admin-orders-page">
        <div className="admin-orders-loading">
          <RefreshCw size={28} className="loading-spin" />
          <p>Loading orders...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-orders-page">
        <div className="admin-orders-error">
          <h2>ORDERS UNAVAILABLE</h2>
          <p>{error}</p>

          <button
            className="admin-orders-retry"
            onClick={loadOrders}
          >
            <RefreshCw size={16} />
            RETRY
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-orders-page">

      {/* Header */}
      <section className="admin-orders-header">
        <div>
          <div className="admin-breadcrumb">
            ONEDAYWEAR / ADMIN
          </div>

          <h1>ORDERS</h1>

          <p>
            Manage customer rentals and order status.
          </p>
        </div>

        <button
          className="admin-refresh-button"
          onClick={loadOrders}
          title="Refresh orders"
        >
          <RefreshCw size={17} />
          REFRESH
        </button>
      </section>

      {/* Statistics */}
      <section className="admin-order-stats">

        <div className="admin-order-stat">
          <span>TOTAL ORDERS</span>
          <strong>{orderCount}</strong>
        </div>

        <div className="admin-order-stat">
          <span>TOTAL REVENUE</span>
          <strong>{formatMoney(revenue)}</strong>
        </div>

        <div className="admin-order-stat">
          <span>VISIBLE ORDERS</span>
          <strong>{filteredOrders.length}</strong>
        </div>

      </section>

      {/* Filters */}
      <section className="admin-order-toolbar">

        <div className="admin-order-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="SEARCH ORDER, CUSTOMER OR PRODUCT..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        <select
          className="admin-order-status-filter"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="ALL">
            ALL STATUS
          </option>

          {statuses.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status}
            </option>
          ))}
        </select>

      </section>

      {/* Orders Table */}
      <section className="admin-orders-table-wrapper">

        <table className="admin-orders-table">

          <thead>
            <tr>
              <th>ORDER</th>
              <th>CUSTOMER</th>
              <th>PRODUCT</th>
              <th>QTY</th>
              <th>RENTAL PERIOD</th>
              <th>AMOUNT</th>
              <th>DEPOSIT</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>

            {filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  className="admin-orders-empty"
                >
                  NO ORDERS FOUND
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (

                <tr key={order.id}>

                  <td>
                    <strong>
                      #{order.id}
                    </strong>

                    <small>
                      {formatDateTime(
                        order.createdAt
                      )}
                    </small>
                  </td>

                  <td>
                    <span className="customer-email">
                      {order.userEmail}
                    </span>
                  </td>

                  <td>
                    <span className="product-id">
                      Product #{order.productId}
                    </span>
                  </td>

                  <td>
                    {order.quantity}
                  </td>

                  <td>
                    <div className="rental-period">
                      <span>
                        {formatDate(
                          order.rentalStartDate
                        )}
                      </span>

                      <span className="rental-arrow">
                        →
                      </span>

                      <span>
                        {formatDate(
                          order.rentalEndDate
                        )}
                      </span>
                    </div>
                  </td>

                  <td>
                    <strong>
                      {formatMoney(
                        order.totalAmount
                      )}
                    </strong>
                  </td>

                  <td>
                    {formatMoney(
                      order.securityDeposit
                    )}
                  </td>

                  <td>
                    <select
                      className={`order-status-select status-${String(
                        order.status || ""
                      ).toLowerCase()}`}
                      value={order.status || ""}
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          e.target.value
                        )
                      }
                    >
                      {statuses.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <div className="order-actions">

                      <button
                        className="order-view-button"
                        title="View order"
                        onClick={() =>
                          setSelectedOrder(order)
                        }
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        className="order-delete-button"
                        title="Delete order"
                        onClick={() =>
                          handleDelete(order.id)
                        }
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>
                  </td>

                </tr>

              ))
            )}

          </tbody>

        </table>

      </section>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="admin-order-modal-overlay"
          onClick={() =>
            setSelectedOrder(null)
          }
        >

          <div
            className="admin-order-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="admin-order-modal-header">

              <div>
                <span>
                  ORDER DETAILS
                </span>

                <h2>
                  #{selectedOrder.id}
                </h2>
              </div>

              <button
                className="admin-order-modal-close"
                onClick={() =>
                  setSelectedOrder(null)
                }
              >
                <X size={20} />
              </button>

            </div>

            <div className="admin-order-details">

              <div className="order-detail">
                <span>CUSTOMER</span>
                <strong>
                  {selectedOrder.userEmail}
                </strong>
              </div>

              <div className="order-detail">
                <span>PRODUCT</span>
                <strong>
                  Product #{selectedOrder.productId}
                </strong>
              </div>

              <div className="order-detail">
                <span>QUANTITY</span>
                <strong>
                  {selectedOrder.quantity}
                </strong>
              </div>

              <div className="order-detail">
                <span>RENTAL START</span>
                <strong>
                  {formatDate(
                    selectedOrder.rentalStartDate
                  )}
                </strong>
              </div>

              <div className="order-detail">
                <span>RENTAL END</span>
                <strong>
                  {formatDate(
                    selectedOrder.rentalEndDate
                  )}
                </strong>
              </div>

              <div className="order-detail">
                <span>TOTAL AMOUNT</span>
                <strong>
                  {formatMoney(
                    selectedOrder.totalAmount
                  )}
                </strong>
              </div>

              <div className="order-detail">
                <span>SECURITY DEPOSIT</span>
                <strong>
                  {formatMoney(
                    selectedOrder.securityDeposit
                  )}
                </strong>
              </div>

              <div className="order-detail">
                <span>CREATED</span>
                <strong>
                  {formatDateTime(
                    selectedOrder.createdAt
                  )}
                </strong>
              </div>

            </div>

            <div className="admin-order-modal-status">

              <label>
                ORDER STATUS
              </label>

              <select
                value={
                  selectedOrder.status || ""
                }
                onChange={(e) =>
                  handleStatusChange(
                    selectedOrder.id,
                    e.target.value
                  )
                }
              >
                {statuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}

export default AdminOrders;