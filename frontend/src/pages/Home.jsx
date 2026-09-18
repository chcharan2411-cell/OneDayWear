import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Home.css";

function Home() {

  const [lightning, setLightning] = useState(false);

  useEffect(() => {

    let timeout;

    const triggerLightning = () => {

      setLightning(true);

      // Lightning stays visible only briefly
      setTimeout(() => {
        setLightning(false);
      }, 180);

      // Random time before next lightning
      const nextTime =
        Math.random() * 7000 + 5000;

      timeout = setTimeout(
        triggerLightning,
        nextTime
      );
    };

    // First lightning after a few seconds
    timeout = setTimeout(
      triggerLightning,
      4000
    );

    return () => {
      clearTimeout(timeout);
    };

  }, []);

  return (
    <div className="home">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="hero-section">

        <div
          className={`hero-image ${
            lightning ? "lightning-active" : ""
          }`}
        >

          {/* Rain */}
          <div className="rain rain-one"></div>
          <div className="rain rain-two"></div>
          <div className="rain rain-three"></div>

          {/* Lightning flash */}
          <div className="lightning-flash"></div>

        </div>


        {/* SHOP NOW BELOW IMAGE */}

        <div className="hero-button-container">

          <Link
            to="/products"
            className="hero-button"
          >
            SHOP NOW
          </Link>

        </div>

      </section>


      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <section className="categories">

        <div className="section-heading">
          <p>EXPLORE</p>
          <h2>SHOP BY CATEGORY</h2>
        </div>


        <div className="category-grid">

          {/* MEN */}

          <Link
            to="/products?category=men"
            className="category-card"
          >

            <div className="category-image men-image">
              <span>MEN</span>
            </div>

            <h3>MEN</h3>

            <p>
              Explore Men's Collection
            </p>

          </Link>


          {/* WOMEN */}

          <Link
            to="/products?category=women"
            className="category-card"
          >

            <div className="category-image women-image">
              <span>WOMEN</span>
            </div>

            <h3>WOMEN</h3>

            <p>
              Explore Women's Collection
            </p>

          </Link>


          {/* ALL */}

          <Link
            to="/products?category=all"
            className="category-card"
          >

            <div className="category-image one-piece-image">
              <span>ALL</span>
            </div>

            <h3>ALL</h3>

            <p>
              Discover Our Full Collection
            </p>

          </Link>

        </div>

      </section>


      {/* =====================================================
          FEATURED
      ===================================================== */}

      <section className="featured">

        <div className="section-heading">

          <p>DON'T MISS</p>

          <h2>
            FEATURED COLLECTION
          </h2>

        </div>


        <div className="featured-content">

          <h2>
            YOUR NEXT LOOK
            <br />
            IS WAITING.
          </h2>

          <Link
            to="/products"
            className="dark-button"
          >
            EXPLORE COLLECTION
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;