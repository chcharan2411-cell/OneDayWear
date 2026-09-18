import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  Trash2,
  X,
  Star,
} from "lucide-react";

import {
  getAdminReviews,
  deleteReview,
} from "../services/adminReviewService";

import "./AdminReviews.css";

function AdminReviews() {

  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [ratingFilter, setRatingFilter] =
    useState("ALL");

  const [selectedReview, setSelectedReview] =
    useState(null);

  const loadReviews = async () => {

    try {

      setLoading(true);
      setError("");

      const data = await getAdminReviews();

      setReviews(data || []);

    } catch (err) {

      console.error(
        "Admin reviews error:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Unable to load reviews."
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async (reviewId) => {

    const confirmed = window.confirm(
      `Are you sure you want to delete review #${reviewId}?`
    );

    if (!confirmed) {
      return;
    }

    try {

      await deleteReview(reviewId);

      setReviews((currentReviews) =>
        currentReviews.filter(
          (review) =>
            review.reviewId !== reviewId
        )
      );

      if (
        selectedReview?.reviewId === reviewId
      ) {
        setSelectedReview(null);
      }

      alert(
        "Review deleted successfully."
      );

    } catch (err) {

      console.error(
        "Delete review error:",
        err
      );

      alert(
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to delete review."
      );
    }
  };

  const filteredReviews = useMemo(() => {

    const search =
      searchTerm.trim().toLowerCase();

    return reviews.filter((review) => {

      const matchesSearch =
        !search ||
        String(review.reviewId)
          .toLowerCase()
          .includes(search) ||
        String(review.userEmail || "")
          .toLowerCase()
          .includes(search) ||
        String(review.productName || "")
          .toLowerCase()
          .includes(search) ||
        String(review.productId || "")
          .toLowerCase()
          .includes(search) ||
        String(review.review || "")
          .toLowerCase()
          .includes(search);

      const matchesRating =
        ratingFilter === "ALL" ||
        String(review.rating) ===
          ratingFilter;

      return (
        matchesSearch &&
        matchesRating
      );
    });

  }, [
    reviews,
    searchTerm,
    ratingFilter,
  ]);

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

  const renderStars = (rating) => {

    return (
      <div className="admin-review-stars">

        {[1, 2, 3, 4, 5].map(
          (star) => (
            <Star
              key={star}
              size={15}
              fill={
                star <= rating
                  ? "currentColor"
                  : "none"
              }
            />
          )
        )}

      </div>
    );
  };

  if (loading) {

    return (
      <main className="admin-reviews-page">

        <div className="admin-reviews-loading">

          <RefreshCw
            size={28}
            className="review-loading-spin"
          />

          <p>LOADING REVIEWS...</p>

        </div>

      </main>
    );
  }

  if (error) {

    return (
      <main className="admin-reviews-page">

        <div className="admin-reviews-error">

          <h2>
            REVIEWS UNAVAILABLE
          </h2>

          <p>{error}</p>

          <button onClick={loadReviews}>
            <RefreshCw size={16} />
            RETRY
          </button>

        </div>

      </main>
    );
  }

  return (
    <main className="admin-reviews-page">

      {/* HEADER */}

      <section className="admin-reviews-header">

        <div>

          <div className="review-breadcrumb">
            ONEDAYWEAR / ADMIN
          </div>

          <h1>REVIEWS</h1>

          <p>
            Monitor customer feedback and
            manage product reviews.
          </p>

        </div>

        <button
          className="review-refresh-button"
          onClick={loadReviews}
        >
          <RefreshCw size={17} />
          REFRESH
        </button>

      </section>

      {/* STATISTICS */}

      <section className="admin-review-stats">

        <div className="admin-review-stat">

          <span>
            TOTAL REVIEWS
          </span>

          <strong>
            {reviews.length}
          </strong>

        </div>

        <div className="admin-review-stat">

          <span>
            VISIBLE REVIEWS
          </span>

          <strong>
            {filteredReviews.length}
          </strong>

        </div>

        <div className="admin-review-stat">

          <span>
            FIVE STAR
          </span>

          <strong>
            {
              reviews.filter(
                (review) =>
                  review.rating === 5
              ).length
            }
          </strong>

        </div>

      </section>

      {/* TOOLBAR */}

      <section className="admin-review-toolbar">

        <div className="admin-review-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="SEARCH USER, PRODUCT OR REVIEW..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />

        </div>

        <select
          value={ratingFilter}
          onChange={(e) =>
            setRatingFilter(
              e.target.value
            )
          }
        >

          <option value="ALL">
            ALL RATINGS
          </option>

          <option value="5">
            5 STARS
          </option>

          <option value="4">
            4 STARS
          </option>

          <option value="3">
            3 STARS
          </option>

          <option value="2">
            2 STARS
          </option>

          <option value="1">
            1 STAR
          </option>

        </select>

      </section>

      {/* TABLE */}

      <section className="admin-reviews-table-wrapper">

        <table className="admin-reviews-table">

          <thead>

            <tr>
              <th>REVIEW</th>
              <th>USER</th>
              <th>PRODUCT</th>
              <th>RATING</th>
              <th>DATE</th>
              <th>ACTIONS</th>
            </tr>

          </thead>

          <tbody>

            {filteredReviews.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="admin-reviews-empty"
                >
                  NO REVIEWS FOUND
                </td>

              </tr>

            ) : (

              filteredReviews.map(
                (review) => (

                  <tr
                    key={review.reviewId}
                  >

                    <td>

                      <strong>
                        #{review.reviewId}
                      </strong>

                      <p className="review-preview">
                        {review.review}
                      </p>

                    </td>

                    <td>
                      {review.userEmail}
                    </td>

                    <td>

                      <strong>
                        {review.productName ||
                          `Product #${review.productId}`}
                      </strong>

                      <small>
                        #{review.productId}
                      </small>

                    </td>

                    <td>
                      {renderStars(
                        review.rating
                      )}
                    </td>

                    <td>
                      {formatDate(
                        review.createdAt
                      )}
                    </td>

                    <td>

                      <div className="review-actions">

                        <button
                          className="review-view-button"
                          title="View review"
                          onClick={() =>
                            setSelectedReview(
                              review
                            )
                          }
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          className="review-delete-button"
                          title="Delete review"
                          onClick={() =>
                            handleDelete(
                              review.reviewId
                            )
                          }
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

      {/* MODAL */}

      {selectedReview && (

        <div
          className="admin-review-modal-overlay"
          onClick={() =>
            setSelectedReview(null)
          }
        >

          <div
            className="admin-review-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="admin-review-modal-header">

              <div>

                <span>
                  REVIEW DETAILS
                </span>

                <h2>
                  #{selectedReview.reviewId}
                </h2>

              </div>

              <button
                onClick={() =>
                  setSelectedReview(null)
                }
              >
                <X size={20} />
              </button>

            </div>

            <div className="admin-review-details">

              <div>
                <span>USER</span>
                <strong>
                  {selectedReview.userEmail}
                </strong>
              </div>

              <div>
                <span>PRODUCT</span>
                <strong>
                  {selectedReview.productName}
                </strong>
              </div>

              <div>
                <span>PRODUCT ID</span>
                <strong>
                  #{selectedReview.productId}
                </strong>
              </div>

              <div>
                <span>RATING</span>
                <strong>
                  {renderStars(
                    selectedReview.rating
                  )}
                </strong>
              </div>

              <div className="review-full-text">

                <span>
                  REVIEW
                </span>

                <p>
                  {selectedReview.review}
                </p>

              </div>

              <div>
                <span>DATE</span>
                <strong>
                  {formatDate(
                    selectedReview.createdAt
                  )}
                </strong>
              </div>

            </div>

            <button
              className="review-modal-delete"
              onClick={() =>
                handleDelete(
                  selectedReview.reviewId
                )
              }
            >
              <Trash2 size={16} />
              DELETE REVIEW
            </button>

          </div>

        </div>

      )}

    </main>
  );
}

export default AdminReviews;