import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Checkout.css";

/* =========================================================
   LOAD RAZORPAY SDK
========================================================= */

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // Already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        resolve(true);
      });

      existingScript.addEventListener("error", () => {
        resolve(false);
      });

      return;
    }

    // Create Razorpay script dynamically
    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};


function Checkout() {

  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    clearCart
  } = useCart();


  const [rentalStartDate, setRentalStartDate] =
    useState("");

  const [rentalEndDate, setRentalEndDate] =
    useState("");

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [error, setError] =
    useState("");


  /* =========================================================
     LOGIN CHECK
  ========================================================= */

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }

  }, [navigate]);


  /* =========================================================
     SECURITY DEPOSIT
  ========================================================= */

  const securityDepositTotal =
    cartItems.reduce(
      (total, item) =>
        total +
        Number(item.securityDeposit || 0) *
          item.quantity,
      0
    );


  /* =========================================================
     RENTAL DAYS
  ========================================================= */

  const rentalDays =
    rentalStartDate &&
    rentalEndDate
      ? Math.max(
          0,
          Math.round(
            (
              new Date(rentalEndDate) -
              new Date(rentalStartDate)
            ) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;


  /* =========================================================
     RENTAL TOTAL
  ========================================================= */

  const estimatedRentalTotal =
    cartItems.reduce(
      (total, item) =>
        total +
        Number(item.rentalPrice || 0) *
          item.quantity *
          rentalDays,
      0
    );


  /* =========================================================
     CREATE RAZORPAY PAYMENT
  ========================================================= */

  const startRazorpayPayment = async (
    orderId
  ) => {

    const token =
      localStorage.getItem("token");


    if (!token) {

      navigate("/login");

      throw new Error(
        "Please login to continue."
      );
    }


    /* =======================================================
       LOAD RAZORPAY SCRIPT
    ======================================================= */

    const razorpayLoaded =
      await loadRazorpayScript();


    if (!razorpayLoaded) {

      throw new Error(
        "Unable to load Razorpay. Please check your internet connection."
      );
    }


    /* =======================================================
       CREATE RAZORPAY ORDER
    ======================================================= */

    const razorpayResponse =
      await fetch(
        `http://localhost:8080/payments/razorpay/order/${orderId}`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );


    if (!razorpayResponse.ok) {

      const message =
        await razorpayResponse.text();

      throw new Error(
        message ||
          "Unable to create Razorpay order."
      );
    }


    const razorpayOrder =
      await razorpayResponse.json();


    console.log(
      "Razorpay Order:",
      razorpayOrder
    );


    /* =======================================================
       VERIFY RAZORPAY SDK
    ======================================================= */

    if (!window.Razorpay) {

      throw new Error(
        "Razorpay SDK is not available."
      );
    }


    /* =======================================================
       RAZORPAY OPTIONS
    ======================================================= */

    const options = {

      key:
        razorpayOrder.keyId,

      amount:
        Number(
          razorpayOrder.amount
        ) * 100,

      currency:
        razorpayOrder.currency ||
        "INR",

      name:
        "One Day Wear",

      description:
        "Rental Clothing Payment",

      order_id:
        razorpayOrder.razorpayOrderId,


      /* =====================================================
         PAYMENT SUCCESS
      ===================================================== */

      handler:
        async function (response) {

          console.log(
            "Razorpay Payment Response:",
            response
          );


          try {

            /* ===============================================
               VERIFY PAYMENT
            =============================================== */

            const verifyResponse =
              await fetch(
                "http://localhost:8080/payments/razorpay/verify",
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json",

                    Authorization:
                      `Bearer ${token}`
                  },

                  body:
                    JSON.stringify({

                      orderId:
                        orderId,

                      razorpayOrderId:
                        response.razorpay_order_id,

                      razorpayPaymentId:
                        response.razorpay_payment_id,

                      razorpaySignature:
                        response.razorpay_signature
                    })
                }
              );


            /* ===============================================
               VERIFY RESPONSE CHECK
            =============================================== */

            if (!verifyResponse.ok) {

              const message =
                await verifyResponse.text();

              throw new Error(
                message ||
                  "Payment verification failed."
              );
            }


            const paymentResult =
              await verifyResponse.json();


            console.log(
              "Payment Verified:",
              paymentResult
            );


            /* ===============================================
               PAYMENT SUCCESS
            =============================================== */

            clearCart();

            navigate(
              "/order-success"
            );

          } catch (err) {

            console.error(
              "Payment verification error:",
              err
            );

            setError(
              err.message ||
                "Payment verification failed."
            );

            setPlacingOrder(false);
          }
        },


      /* =====================================================
         PREFILL
      ===================================================== */

      prefill: {

        name: "",

        email: "",

        contact: ""
      },


      /* =====================================================
         NOTES
      ===================================================== */

      notes: {

        orderId:
          String(orderId)
      },


      /* =====================================================
         THEME
      ===================================================== */

      theme: {

        color:
          "#111111"
      },


      /* =====================================================
         MODAL
      ===================================================== */

      modal: {

        ondismiss:
          function () {

            console.log(
              "Razorpay payment window closed."
            );

            setPlacingOrder(false);
          }
      }
    };


    /* =======================================================
       CREATE RAZORPAY INSTANCE
    ======================================================= */

    const razorpay =
      new window.Razorpay(
        options
      );


    /* =======================================================
       PAYMENT FAILED
    ======================================================= */

    razorpay.on(
      "payment.failed",
      function (response) {

        console.error(
          "Razorpay payment failed:",
          response
        );


        setError(
          response.error?.description ||
            "Payment failed. Please try again."
        );


        setPlacingOrder(false);
      }
    );


    /* =======================================================
       OPEN RAZORPAY
    ======================================================= */

    razorpay.open();
  };


  /* =========================================================
     PLACE ORDER
  ========================================================= */

  const handlePlaceOrder =
    async (e) => {

      e.preventDefault();

      setError("");


      /* =====================================================
         CART CHECK
      ===================================================== */

      if (cartItems.length === 0) {

        setError(
          "Your cart is empty."
        );

        return;
      }


      /* =====================================================
         DATE CHECK
      ===================================================== */

      if (
        !rentalStartDate ||
        !rentalEndDate
      ) {

        setError(
          "Please select rental dates."
        );

        return;
      }


      if (
        rentalEndDate <=
        rentalStartDate
      ) {

        setError(
          "Rental end date must be after start date."
        );

        return;
      }


      /* =====================================================
         LOGIN CHECK
      ===================================================== */

      const token =
        localStorage.getItem("token");


      if (!token) {

        navigate("/login");

        return;
      }


      try {

        setPlacingOrder(true);


        /* ===================================================
           CURRENT VERSION

           Your backend currently creates one order
           for each cart item.

           We start Razorpay for the first created order.
        =================================================== */

        for (
          const item of cartItems
        ) {

          /* ================================================
             CREATE OUR ORDER
          ================================================ */

          const response =
            await fetch(
              "http://localhost:8080/orders",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",

                  Authorization:
                    `Bearer ${token}`
                },

                body:
                  JSON.stringify({

                    productId:
                      item.id,

                    quantity:
                      item.quantity,

                    rentalStartDate:
                      rentalStartDate,

                    rentalEndDate:
                      rentalEndDate
                  })
              }
            );


          /* ================================================
             ORDER ERROR
          ================================================ */

          if (!response.ok) {

            const message =
              await response.text();

            throw new Error(
              message ||
                "Failed to place order."
            );
          }


          /* ================================================
             CREATED ORDER
          ================================================ */

          const createdOrder =
            await response.json();


          console.log(
            "Created Order:",
            createdOrder
          );


          /* ================================================
             ORDER ID
          ================================================ */

          const orderId =
            createdOrder.id;


          if (!orderId) {

            throw new Error(
              "Order ID was not returned by backend."
            );
          }


          /* ================================================
             ORDER AMOUNT
          ================================================ */

          const orderAmount =
            Number(
              createdOrder.totalAmount
            );


          if (
            !orderAmount ||
            orderAmount <= 0
          ) {

            throw new Error(
              "Invalid order amount returned by backend."
            );
          }


          console.log(
            "Order ID:",
            orderId
          );

          console.log(
            "Order Amount:",
            orderAmount
          );


          /* ================================================
             START RAZORPAY
          ================================================ */

          await startRazorpayPayment(
            orderId
          );


          /*
           * VERY IMPORTANT
           *
           * Stop here.
           *
           * Razorpay must finish before we continue.
           *
           * Payment verification happens inside
           * Razorpay's handler().
           */

          return;
        }

      } catch (err) {

        console.error(
          "Checkout error:",
          err
        );


        setError(
          err.message ||
            "Unable to process your order."
        );


        setPlacingOrder(false);
      }
    };


  /* =========================================================
     TODAY
  ========================================================= */

  const today =
    new Date()
      .toISOString()
      .split("T")[0];


  /* =========================================================
     UI
  ========================================================= */

  return (

    <main className="checkout-page">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="checkout-header">

        <p>
          ONE DAY WEAR
        </p>

        <h1>
          CHECKOUT
        </h1>

      </section>


      {/* =====================================================
          CHECKOUT CONTAINER
      ===================================================== */}

      <section className="checkout-container">


        {/* ===================================================
            RENTAL FORM
        =================================================== */}

        <div className="checkout-form-section">

          <h2>
            RENTAL DETAILS
          </h2>


          <form
            onSubmit={
              handlePlaceOrder
            }
          >


            {/* ===============================================
                DATE GROUP
            =============================================== */}

            <div className="date-group">


              {/* =============================================
                  START DATE
              ============================================= */}

              <div className="date-field">

                <label>
                  RENTAL START DATE
                </label>

                <input
                  type="date"

                  value={
                    rentalStartDate
                  }

                  min={
                    today
                  }

                  onChange={(e) =>
                    setRentalStartDate(
                      e.target.value
                    )
                  }

                  required
                />

              </div>


              {/* =============================================
                  END DATE
              ============================================= */}

              <div className="date-field">

                <label>
                  RENTAL END DATE
                </label>

                <input
                  type="date"

                  value={
                    rentalEndDate
                  }

                  min={
                    rentalStartDate ||
                    today
                  }

                  onChange={(e) =>
                    setRentalEndDate(
                      e.target.value
                    )
                  }

                  required
                />

              </div>

            </div>


            {/* ===============================================
                DATE ERROR
            =============================================== */}

            {rentalStartDate &&
              rentalEndDate &&
              rentalEndDate <=
                rentalStartDate && (

              <div className="checkout-error">

                Rental end date must be
                after start date.

              </div>

            )}


            {/* ===============================================
                GENERAL ERROR
            =============================================== */}

            {error && (

              <div className="checkout-error">

                {error}

              </div>

            )}


            {/* ===============================================
                PAYMENT BUTTON
            =============================================== */}

            <button
              type="submit"

              className={
                "place-order-button"
              }

              disabled={
                placingOrder ||
                cartItems.length === 0 ||
                !rentalStartDate ||
                !rentalEndDate ||
                rentalEndDate <=
                  rentalStartDate
              }
            >

              {placingOrder
                ? "OPENING PAYMENT..."
                : "PROCEED TO PAYMENT"}

            </button>


          </form>

        </div>


        {/* ===================================================
            ORDER SUMMARY
        =================================================== */}

        <div className="checkout-summary">

          <h2>
            ORDER SUMMARY
          </h2>


          {/* =================================================
              CART ITEMS
          ================================================= */}

          <div className="checkout-items">

            {cartItems.map(
              (item) => (

                <div
                  className="checkout-item"
                  key={item.id}
                >


                  {/* =========================================
                      IMAGE
                  ========================================= */}

                  <div className="checkout-item-image">

                    {item.imageUrl ? (

                      <img
                        src={
                          item.imageUrl
                        }

                        alt={
                          item.productName
                        }
                      />

                    ) : (

                      <span>
                        NO IMAGE
                      </span>

                    )}

                  </div>


                  {/* =========================================
                      INFO
                  ========================================= */}

                  <div className="checkout-item-info">

                    <h3>
                      {
                        item.productName
                      }
                    </h3>

                    <p>
                      Quantity:{" "}
                      {
                        item.quantity
                      }
                    </p>

                    <p>
                      ₹
                      {
                        item.rentalPrice
                      }{" "}
                      / day
                    </p>

                  </div>


                </div>

              )
            )}

          </div>


          {/* =================================================
              RENTAL TOTAL
          ================================================= */}

          <div className="checkout-total">

            <span>
              RENTAL TOTAL
            </span>

            <strong>

              ₹{" "}

              {rentalDays > 0
                ? estimatedRentalTotal
                : cartTotal}

            </strong>

          </div>


          {/* =================================================
              RENTAL DURATION
          ================================================= */}

          {rentalDays > 0 && (

            <div className="checkout-duration">

              <span>
                RENTAL DURATION
              </span>

              <strong>

                {rentalDays}{" "}

                {
                  rentalDays === 1
                    ? "DAY"
                    : "DAYS"
                }

              </strong>

            </div>

          )}


          {/* =================================================
              SECURITY DEPOSIT
          ================================================= */}

          <div className="checkout-deposit">

            <span>
              SECURITY DEPOSIT
            </span>

            <strong>
              ₹
              {
                securityDepositTotal
              }
            </strong>

          </div>


        </div>


      </section>

    </main>
  );
}

export default Checkout;