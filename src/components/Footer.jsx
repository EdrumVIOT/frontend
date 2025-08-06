import React from "react";
import "../css/Home.css";
import { useNavigate } from "react-router-dom";
function Footer() {
  const navigate = useNavigate();
  return (
    <div>
      <section className="footer">
        <div className="footer-header">
          <div className="second-hero-header">
            <h2 style={{ marginTop: "60px" }}>
              Хөгжмийн аялалаа өнөөдөр эхлүүлээрэй
            </h2>
            <h3>Бүртгүүлж, хөгжмийн ертөнцөд орцгооё</h3>
            <button
              className="hero-btn"
              onClick={() => {
                navigate("/register");
                window.scrollTo(0, 0);
              }}
            >
              Бүртгүүлэх
            </button>
          </div>
        </div>

        <div className="footer-main">
          <div className="footer-left">
            <p className="footer-description">
              Бөмбөр хөгжимийг орчин үеийн технологийн тусламжтай хүн бүрт
              хүртээмжтэй болгох зорилготой.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h3 className="footer-title">Холбоосууд</h3>
              <ul className="footer-list">
                <li>Хичээлүүд</li>
                <li>Багш нар</li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Хичээлүүд</h3>
              <ul className="footer-list">
                <li onClick={() => navigate("/subject")}>Бөмбөр</li>
                <li onClick={() => navigate("/subject")}>Гитар</li>
                <li onClick={() => navigate("/subject")}>Төгөлдөр хуур</li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Тусламж</h3>
              <ul className="footer-list">
                <li>Холбоо барих</li>
                <li>Түгээмэл асуултууд</li>
                <li>Дэмжлэг</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-meta">
            <p className="footer-tagline">
              Монгол хэл дээрх хөгжмийн хичээлийн платформ
            </p>
            <p className="footer-copyright">©2025 Нүдэн Солюшн ХХК.</p>
          </div>
          <hr className="footer-divider" />
        </div>
      </section>
    </div>
  );
}

export default Footer;
