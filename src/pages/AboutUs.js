import React from "react";
import AppNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackButton from "../components/BackButton";
import "../styles/style.css";

const AboutUs = () => {
  return (
    <>
      <AppNavbar />

      <div className="igit-container">
        <div className="cart-header">
          <BackButton label="About Us" />
        </div>

        {/* HERO SECTION */}
        <section className="about-hero">
          <h1>iGit in My Oven</h1>
          <p className="hero-subtext">
            Where collaboration, passion, and craftsmanship rise together — just
            like the perfect pastry.
          </p>
        </section>

        {/* ABOUT (Text | Image) */}
        <section className="about-row">
          <div className="about-text">
            <h2>About Us</h2>
            <p>
              Welcome to <strong>iGit in My Oven</strong>, a bakery built on
              teamwork, precision, and passion. Inspired by the concept of{" "}
              <strong>Git</strong> — a system where developers collaborate,
              improve, and commit to excellence — our brand represents unity,
              professionalism, and shared creativity.
            </p>
          </div>

          <div className="about-image-wrapper">
            <img
              src="/Promotion.png"
              alt="About"
              className="about-image-side"
            />
          </div>
        </section>

        {/* HISTORY (Image | Text) */}
        <section className="about-row reverse">
          <div className="about-image-wrapper">
            <img
              src="/Founder.png"
              alt="History"
              className="about-image-side"
            />
          </div>

          <div className="about-text">
            <h2>Our History</h2>
            <p>
              Founded in 1910 by <strong>Jorick Farinas</strong> and{" "}
              <strong>Emiel Escuzar</strong>, the bakery began as a small artisan
              shop. Decades later, under the leadership of{" "}
              <strong>Moises Fatal</strong>, the craft evolved — blending
              tradition with modern artistry.
            </p>
          </div>
        </section>

        {/* MISSION & VISION CENTER */}
        <section className="about-two-col">
          <div>
            <h2>Mission</h2>
            <p>To craft meaningful, memorable, and delicious creations.</p>
          </div>

          <div>
            <h2>Vision</h2>
            <p>To be the region’s most trusted bakery for artistry and flavor.</p>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="about-section">
          <h2>Contact Us</h2>
          <p>
            Email: <strong>igitinmyoven@gmail.com</strong>
          </p>
          <p>
            Phone: <strong>0969-67-420</strong>
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default AboutUs;
