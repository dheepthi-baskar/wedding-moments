
import { useEffect, useState } from "react";
import "./App.css";
import UploadSection from "./components/UploadSection";
import GallerySection from "./components/GallerySection";

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="logo">✦ WEDDING MOMENTS ✦</div>
      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#upload">Upload</a>
        <a href="#gallery">Gallery</a>
      </div>
    </nav>
  );
}

function Countdown() {
  const target = new Date("2026-11-15T00:00:00");
  const calc = () => {
    const diff = target - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="countdown">
      {[["days", "Days"], ["hours", "Hrs"], ["minutes", "Min"], ["seconds", "Sec"]].map(([k, label]) => (
        <div className="countdown-unit" key={k}>
          <span className="countdown-num">{String(time[k]).padStart(2, "0")}</span>
          <span className="countdown-label">{label}</span>
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <div className="website">

      <NavBar />

      {/* Hero Section */}
      <section className="hero" id="home">

        <div className="hero-content">
          <p className="eyebrow">
            TWO HEARTS, ONE BEAUTIFUL JOURNEY
          </p>

          <h1>
            Thilak <br /> & Jyotsna
          </h1>

          <div className="gold-line"></div>

          <p className="welcome">
            Together with their families, we invite you
            to celebrate the beginning of a beautiful journey.
            Your presence and memories make this celebration special.
          </p>

          <div className="couple">
            Thilak B. V & Jyotsna V
          </div>

          <p className="wedding-date">15 · NOVEMBER · 2026</p>

          <Countdown />

          <div className="hero-buttons">
            <a href="#upload" className="primary-btn">
              Share Your Memories
            </a>

            <a href="#gallery" className="secondary-btn">
              View Gallery
            </a>
          </div>
        </div>

        <div className="hero-image">
          <div className="image-caption">
            <span>OUR SPECIAL CELEBRATION</span>
            <p>Forever starts here.</p>
          </div>
        </div>

      </section>

<section className="wedding-guide">
  <p className="eyebrow">BE A PART OF OUR STORY</p>
  <h2>Every Moment Deserves to Be Remembered</h2>
  <p className="guide-description">
    Help us collect all the beautiful memories
    from our special day. Share your pictures
    and videos with us!
  </p>

  <div className="guide-cards">
    <div className="guide-card">
      <span>01</span>
      <h3>Scan</h3>
      <p>Scan our wedding QR code using your phone camera.</p>
    </div>

    <div className="guide-card">
      <span>02</span>
      <h3>Upload</h3>
      <p>Select your favourite wedding photos and videos.</p>
    </div>

    <div className="guide-card">
      <span>03</span>
      <h3>Celebrate</h3>
      <p>Explore and download beautiful memories shared by everyone.</p>
    </div>
  </div>
</section>

      {/* Upload Section */}
      <section id="upload">
        <UploadSection />
      </section>

      {/* Gallery Section */}
      <section id="gallery">
        <GallerySection />
      </section>

      <footer>
        <div className="footer-ornament">✦ ✦ ✦</div>
        <h2>Thilak & Jyotsna</h2>
        <p className="footer-date">15 · NOVEMBER · 2026</p>
        <p>Thank you for being a part of our beautiful journey.</p>
        <div className="footer-divider"></div>
        <small>MADE WITH LOVE ❤️</small>
      </footer>

    </div>
  );
}

export default App;
