import { useEffect, useState } from "react";
import {
  Users,
  Package,
  Boxes,
  ShoppingBag,
  CreditCard,
  IndianRupee,
  Star,
  Heart,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Admin.css";

function Admin() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          "http://localhost:9093/admin/dashboard",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Dashboard request failed: ${response.status}`
          );
        }

        const data = await response.json();

        setDashboard(data);
      } catch (error) {
        console.error("Admin dashboard error:", error);

        setError(
          error.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

 const stats = dashboard
  ? [
      {
        label: "TOTAL USERS",
        value: dashboard.totalUsers,
        icon: Users,
        link: "/admin/users",
      },

      // PRODUCT SERVICE
      {
        label: "TOTAL PRODUCTS",
        value: dashboard.totalProducts,
        icon: Package,
        link: "/admin/products",
      },

      // INVENTORY SERVICE
      {
        label: "INVENTORY",
        value: "MANAGE",
        icon: Boxes,
        link: "/admin/inventory",
      },

      // ORDER SERVICE
      {
        label: "TOTAL ORDERS",
        value: dashboard.totalOrders,
        icon: ShoppingBag,
        link: "/admin/orders",
      },

      // PAYMENT SERVICE
      {
        label: "TOTAL PAYMENTS",
        value: dashboard.totalPayments,
        icon: CreditCard,
        link: "/admin/payments",
      },

      {
        label: "TOTAL REVENUE",
        value: `₹${Number(
          dashboard.totalRevenue || 0
        ).toLocaleString("en-IN")}`,
        icon: IndianRupee,
        link: "#",
      },

      {
        label: "TOTAL REVIEWS",
        value: dashboard.totalReviews,
        icon: Star,
        link: "#",
      },

      {
        label: "WISHLIST ITEMS",
        value: dashboard.totalWishlistItems,
        icon: Heart,
        link: "#",
      },

      {
        label: "LOW STOCK",
        value: dashboard.lowStockProducts,
        icon: AlertTriangle,
        link: "/admin/inventory",
      },
    ]
  : [];

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-loading">
          <div className="admin-loading-line"></div>
          <p>LOADING DASHBOARD...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-page">
        <div className="admin-error">
          <AlertTriangle
            size={36}
            strokeWidth={1.5}
          />

          <h2>ADMIN DASHBOARD UNAVAILABLE</h2>

          <p>{error}</p>

          <button
            onClick={() => window.location.reload()}
          >
            RETRY
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">

      {/* ================= HEADER ================= */}

      <section className="admin-header">
        <div>
          <p className="admin-eyebrow">
            ONEDAYWEAR / ADMIN
          </p>

          <h1>ADMIN DASHBOARD</h1>

          <p className="admin-subtitle">
            Manage your rental store and monitor its
            performance.
          </p>
        </div>

        <div className="admin-status">
          <span></span>
          SYSTEM ONLINE
        </div>
      </section>

      {/* ================= STAT CARDS ================= */}

      <section className="admin-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              key={stat.label}
              to={stat.link}
              className={`admin-stat-card ${
                stat.label === "LOW STOCK" &&
                Number(stat.value) > 0
                  ? "warning"
                  : ""
              }`}
            >
              <div className="admin-stat-top">
                <span>{stat.label}</span>

                <Icon
                  size={20}
                  strokeWidth={1.5}
                />
              </div>

              <strong>{stat.value}</strong>
            </Link>
          );
        })}
      </section>

      {/* ================= STORE MANAGEMENT ================= */}

      <section className="admin-overview">

        <div className="admin-overview-header">
          <div>
            <p>STORE MANAGEMENT</p>
            <h2>ONE DAY WEAR</h2>
          </div>

          <span>LIVE DATA</span>
        </div>

        <div className="admin-overview-content">

          {/* PRODUCT SERVICE */}
          <Link to="/admin/products">
            <span>PRODUCTS</span>

            <strong>
              {dashboard.totalProducts}
            </strong>
          </Link>

          {/* INVENTORY SERVICE */}
          <Link to="/admin/inventory">
            <span>INVENTORY</span>

            <strong>
              {dashboard.lowStockProducts}
            </strong>
          </Link>

          {/* ORDER SERVICE */}
          <Link to="/admin/orders">
            <span>ORDERS</span>

            <strong>
              {dashboard.totalOrders}
            </strong>
          </Link>

          {/* PAYMENT SERVICE */}
          <Link to="/admin/payments">
            <span>PAYMENTS</span>

            <strong>
              {dashboard.totalPayments}
            </strong>
          </Link>

          {/* REVENUE */}
          <div>
            <span>REVENUE</span>

            <strong>
              ₹
              {Number(
                dashboard.totalRevenue || 0
              ).toLocaleString("en-IN")}
            </strong>
          </div>

        </div>
      </section>

    </main>
  );
}

export default Admin;