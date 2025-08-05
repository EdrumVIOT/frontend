import React, { useEffect } from "react";
import "../css/Home.css";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.state?.scrollToFooter) {
      const footer = document.querySelector(".footer");
      if (footer) {
        footer.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  return (
    <div>
      <div className="home-container">
        <Header />

        <section className="hero">
          <div className="hero-text">
            <h1>Хөгжмийн хичээлийг гэрээсээ сур</h1>
            <p>
              Барабан, гитар, төгөлдөр хуур зэрэг хөгжмийн зэмсгүүдийг
              мэргэжлийн багш нараас суралцаарай
            </p>
            <div className="hero-buttons">
              <button
                className="hero-btn"
                onClick={() => {
                  navigate("/register");
                  window.scrollTo(0, 0);
                }}
              >
                Эхлэх
              </button>
            </div>
          </div>
          <div className="hero-video">
            <img src="/images/sectionImg.jpg" alt="container" />
          </div>
        </section>
        <section className="second-hero">
          <div className="second-hero-header">
            <h2>Биднийг яагаад сонгох вэ?</h2>
            <p>
              Орчин үеийн технологи болон уламжлалт арга барилыг хослуулан, үр
              дүнтэй сургалтын орчинг бүрдүүлэх
            </p>
          </div>
          <div></div>{" "}
          <div className="feature-grid">
            <div className="feature-card">
              <img src="/images/videoIcon.png" alt="icon" />
              <h3>Видео хичээлүүд</h3>
              <p>
                Өндөр чанартай видео хичээлүүдээр тодорхой заавар авч, дахин
                дахин үзэх боломжтой
              </p>
            </div>

            <div className="feature-card">
              <img src="/images/teacherIcon.png" alt="icon" />
              <h3>Мэргэжлийн багш нар</h3>
              <p>
                Олон жилийн туршлагатай, мэргэжсэн багш нарын удирдлага дор
                суралцаарай
              </p>
            </div>

            <div className="feature-card">
              <img src="/images/statisticIcon.png" alt="icon" />
              <h3>Ахиц хянах систем</h3>
              <p>
                Өөрийн сурсан хичээл, оноо, шагналыг хянаж, дэвшлээ харах
                боломжтой
              </p>
            </div>

            <div className="feature-card">
              <img src="/images/timeIcon.png" alt="icon" />
              <h3>Уян хатан цаг</h3>
              <p>
                24/7 хүссэн цагааар хичээллэж, өөрийн хуваарьт тохируулан
                суралцаарай
              </p>
            </div>

            <div className="feature-card">
              <img src="/images/comIcon.png" alt="icon" />
              <h3>Багш-сурагч харилцаа</h3>
              <p>
                Асуулт асуух, зөвлөгөө авах, туршлага хуваалцах боломжтой
                платформ
              </p>
            </div>
          </div>
        </section>
        <section className="third-hero">
          <div className="second-hero-header">
            <h2> Манай багш нар</h2>
            <p>Мэргэжлийн хөгжимчид таныг хөгжмийн замд дагуулна.</p>
          </div>
          <div className="teachers-container">
            <div>
              <img
                src="/images/person.jpg"
                alt="teacher"
                className="teacher-photo"
              />{" "}
              <h2>Г.Амгаланбаатар</h2>{" "}
              <p style={{ width: "150px" }}>
                Анхан шатны багш. Суис-ийг хөгжмийн ангиар сурч төгсөн, 15 жил
                багшилж байгаа.
              </p>
            </div>
            <div>
              <img
                src="/images/person.jpg"
                alt="teacher"
                className="teacher-photo"
              />{" "}
              <h2>Г.Амгаланбаатар</h2>{" "}
              <p style={{ width: "150px" }}>
                Анхан шатны багш. Суис-ийг хөгжмийн ангиар сурч төгсөн, 15 жил
                багшилж байгаа.
              </p>
            </div>
            <div>
              <img
                src="/images/person.jpg"
                alt="teacher"
                className="teacher-photo"
              />{" "}
              <h2>Г.Амгаланбаатар</h2>{" "}
              <p style={{ width: "150px" }}>
                Анхан шатны багш. Суис-ийг хөгжмийн ангиар сурч төгсөн, 15 жил
                багшилж байгаа.
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
