import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  RotateCcw,
  X,
} from "lucide-react";

import {
  getPaymentCount,
  getPaymentByOrderId,
  refundPayment,
} from "../services/adminPaymentService";

import { getAdminOrders } from "../services/adminOrderService";

import "./AdminPayments.css";

const PAYMENT_STATUSES = [
  "PENDING",
  "SUCCESS",
  "FAILED",
  "REFUNDED",
];

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [paymentCount, setPaymentCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedPayment, setSelectedPayment] =
    useState(null);

  // =====================================================
  // LOAD PAYMENTS
  // =====================================================

  const loadPaymentsFromOrders = async () => {
    try {
      setLoading(true);
      setError("");

      // Get all orders
      const orders = await getAdminOrders();

      const orderIds = [
        ...new Set(
          orders
            .map((order) => order.id)
            .filter(Boolean)
        ),
      ];

      // Find payment for each order
      const paymentResults = await Promise.all(
        orderIds.map(async (orderId) => {
          try {
            return await getPaymentByOrderId(orderId);
          } catch (error) {
            // Order may not have payment
            return null;
          }
        })
      );

      const validPayments =
        paymentResults.filter(Boolean);

      setPayments(validPayments);

      // Get payment count
      const count = await getPaymentCount();

      setPaymentCount(count || 0);

    } catch (error) {
      console.error(
        "Admin payments error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load payments."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadPaymentsFromOrders();
  }, []);

  // =====================================================
  // REFUND
  // =====================================================

  const handleRefund = async (paymentId) => {
    const confirmed = window.confirm(
      `Are you sure you want to refund payment #${paymentId}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const updatedPayment =
        await refundPayment(paymentId);

      setPayments((currentPayments) =>
        currentPayments.map((payment) =>
          payment.id === paymentId
            ? updatedPayment
            : payment
        )
      );

      if (
        selectedPayment?.id === paymentId
      ) {
        setSelectedPayment(updatedPayment);
      }

      alert("Payment refunded successfully.");

    } catch (error) {
      console.error(
        "Refund payment error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to refund payment."
      );
    }
  };

  // =====================================================
  // FILTER PAYMENTS
  // =====================================================

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const search =
        searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||
        String(payment.id)
          .toLowerCase()
          .includes(search) ||
        String(payment.orderId)
          .toLowerCase()
          .includes(search) ||
        String(payment.paymentMethod || "")
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "ALL" ||
        payment.paymentStatus === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    payments,
    searchTerm,
    statusFilter,
  ]);

  // =====================================================
  // HELPERS
  // =====================================================

  const formatMoney = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    );
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

  const getStatusClass = (status) => {
    return String(status || "")
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="admin-payments-page">
        <div className="admin-payments-loading">

          <RefreshCw
            size={28}
            className="payment-loading-spin"
          />

          <p>LOADING PAYMENTS...</p>

        </div>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <main className="admin-payments-page">

        <div className="admin-payments-error">

          <h2>PAYMENTS UNAVAILABLE</h2>

          <p>{error}</p>

          <button
            onClick={loadPaymentsFromOrders}
          >
            <RefreshCw size={16} />
            RETRY
          </button>

        </div>

      </main>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="admin-payments-page">

      {/* ================= HEADER ================= */}

      <section className="admin-payments-header">

        <div>

          <div className="payment-breadcrumb">
            ONEDAYWEAR / ADMIN
          </div>

          <h1>PAYMENTS</h1>

          <p>
            Monitor customer payments and
            manage refunds.
          </p>

        </div>

        <button
          className="payment-refresh-button"
          onClick={loadPaymentsFromOrders}
        >
          <RefreshCw size={17} />
          REFRESH
        </button>

      </section>

      {/* ================= STATISTICS ================= */}

      <section className="admin-payment-stats">

        <div className="admin-payment-stat">

          <span>TOTAL PAYMENTS</span>

          <strong>
            {paymentCount}
          </strong>

        </div>

        <div className="admin-payment-stat">

          <span>VISIBLE PAYMENTS</span>

          <strong>
            {filteredPayments.length}
          </strong>

        </div>

        <div className="admin-payment-stat">

          <span>SUCCESSFUL</span>

          <strong>
            {
              payments.filter(
                (payment) =>
                  payment.paymentStatus ===
                  "SUCCESS"
              ).length
            }
          </strong>

        </div>

        <div className="admin-payment-stat">

          <span>REFUNDED</span>

          <strong>
            {
              payments.filter(
                (payment) =>
                  payment.paymentStatus ===
                  "REFUNDED"
              ).length
            }
          </strong>

        </div>

      </section>

      {/* ================= TOOLBAR ================= */}

      <section className="admin-payment-toolbar">

        <div className="admin-payment-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="SEARCH PAYMENT, ORDER OR METHOD..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >

          <option value="ALL">
            ALL STATUS
          </option>

          {PAYMENT_STATUSES.map(
            (status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            )
          )}

        </select>

      </section>

      {/* ================= TABLE ================= */}

      <section className="admin-payments-table-wrapper">

        <table className="admin-payments-table">

          <thead>

            <tr>
              <th>PAYMENT</th>
              <th>ORDER</th>
              <th>AMOUNT</th>
              <th>METHOD</th>
              <th>STATUS</th>
              <th>DATE</th>
              <th>ACTIONS</th>
            </tr>

          </thead>

          <tbody>

            {filteredPayments.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="admin-payments-empty"
                >
                  NO PAYMENTS FOUND
                </td>

              </tr>

            ) : (

              filteredPayments.map(
                (payment) => (

                  <tr key={payment.id}>

                    <td>
                      <strong>
                        #{payment.id}
                      </strong>
                    </td>

                    <td>
                      Order #{payment.orderId}
                    </td>

                    <td>
                      <strong>
                        {formatMoney(
                          payment.amount
                        )}
                      </strong>
                    </td>

                    <td>
                      {payment.paymentMethod}
                    </td>

                    <td>

                      <span
                        className={`payment-status payment-status-${getStatusClass(
                          payment.paymentStatus
                        )}`}
                      >
                        {payment.paymentStatus}
                      </span>

                    </td>

                    <td>
                      {formatDate(
                        payment.paymentDate
                      )}
                    </td>

                    <td>

                      <div className="payment-actions">

                        {/* VIEW */}

                        <button
                          className="payment-view-button"
                          title="View payment"
                          onClick={() =>
                            setSelectedPayment(
                              payment
                            )
                          }
                        >
                          <Eye size={17} />
                        </button>

                        {/* REFUND */}

                        {payment.paymentStatus ===
                          "SUCCESS" && (

                          <button
                            className="payment-refund-button"
                            title="Refund payment"
                            onClick={() =>
                              handleRefund(
                                payment.id
                              )
                            }
                          >
                            <RotateCcw
                              size={17}
                            />
                          </button>

                        )}

                      </div>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </section>

      {/* ================= PAYMENT MODAL ================= */}

      {selectedPayment && (

        <div
          className="admin-payment-modal-overlay"
          onClick={() =>
            setSelectedPayment(null)
          }
        >

          <div
            className="admin-payment-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="admin-payment-modal-header">

              <div>

                <span>
                  PAYMENT DETAILS
                </span>

                <h2>
                  #{selectedPayment.id}
                </h2>

              </div>

              <button
                onClick={() =>
                  setSelectedPayment(null)
                }
              >
                <X size={20} />
              </button>

            </div>

            <div className="admin-payment-details">

              <div>
                <span>PAYMENT ID</span>

                <strong>
                  #{selectedPayment.id}
                </strong>
              </div>

              <div>
                <span>ORDER ID</span>

                <strong>
                  #{selectedPayment.orderId}
                </strong>
              </div>

              <div>
                <span>AMOUNT</span>

                <strong>
                  {formatMoney(
                    selectedPayment.amount
                  )}
                </strong>
              </div>

              <div>
                <span>PAYMENT METHOD</span>

                <strong>
                  {
                    selectedPayment.paymentMethod
                  }
                </strong>
              </div>

              <div>
                <span>STATUS</span>

                <strong
                  className={`payment-status payment-status-${getStatusClass(
                    selectedPayment.paymentStatus
                  )}`}
                >
                  {
                    selectedPayment.paymentStatus
                  }
                </strong>
              </div>

              <div>
                <span>PAYMENT DATE</span>

                <strong>
                  {formatDate(
                    selectedPayment.paymentDate
                  )}
                </strong>
              </div>

            </div>

            {selectedPayment.paymentStatus ===
              "SUCCESS" && (

              <button
                className="payment-modal-refund"
                onClick={() =>
                  handleRefund(
                    selectedPayment.id
                  )
                }
              >

                <RotateCcw size={16} />

                REFUND PAYMENT

              </button>

            )}

          </div>

        </div>

      )}

    </main>
  );
}

export default AdminPayments;