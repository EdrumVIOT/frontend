import React, { useEffect, useRef } from "react";
import "../css/Subject.css";
import Header from "./Header";
import Footer from "./Footer";

function Subject() {
  const videoRefs = useRef([]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePlayAndFullscreen = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    }
  };

  return (
    <>
    <div className="subject-container">
      <Header />
      <section className="sub-section1">
        <div className="sub-section-header">
          {" "}
          <h2>Бөмбөрийн хичээлүүд</h2>
          <h3>
            Анхан шатнаас эхлээд мэргэжлийн түвшин хүртэл, бүх түвшний сурагчдад
            тохирсон хичээлүүд
          </h3>
          <div className="sub-header-card">
            <div id="subCard">150+ хичээл</div>
            <div id="subCard">45 багш</div>
            <div id="subCard">1800 сурагч</div>
            <div></div>
          </div>
        </div>
      </section>
      <section className="sub-section2">
        <div className="sub-section2-cards">
          {[1, 2, 3].map((_, index) => (
            <div className="sub-section2-card" key={index}>
              <div className="card-top-labels">
                <span className="badge left">Анхан шат</span>
                <span className="badge right">Хичээл №1</span>
              </div>
              <div className="card-video-player">
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  src="/videos/homeVideo.mp4"
                  width="100%"
                  height="200"
                  controls
                  muted
                  preload="metadata"
                >
                  Таны браузер видео дэмжигдэхгүй байх шиг байна.
                </video>
              </div>

              <h3 className="card-title">Бөмбөрийн үндэс</h3>
              <p className="card-desc">
                Анхан шатны сурагчдад зориулсан бөмбөрийн үндсэн техник, суурь,
                зүтгэлтэй сурах хичээл
              </p>
              <p className="card-teacher">Багш: Б.Баттулга</p>
              <div className="card-meta">
                <span>🕒 8 долоо хоногийн өмнө</span>
                <span>👥 248</span>
                <span>⭐ 4.8</span>
              </div>
              <button
                className="view-button"
                onClick={() => handlePlayAndFullscreen(index)}
              >
                Хичээл үзэх
              </button>
            </div>
          ))}
        </div>
      </section>
      
    </div>
    <Footer/>
    </>
  );
}

export default Subject;
