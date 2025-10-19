import React, { useState, useEffect, useRef } from "react";
import "./MainPage.css";

const MainPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [current, setCurrent] = useState(0); // ✅ 이미지 스크롤 단계 상태 추가
  const videoScrollRef = useRef(null);

  // 스크롤 시 헤더 투명도 효과
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ 비디오 드래그 이동 기능
  useEffect(() => {
    const slider = videoScrollRef.current;
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const mouseDown = (e) => {
      isDown = true;
      slider.classList.add("dragging");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const mouseLeave = () => {
      isDown = false;
      slider.classList.remove("dragging");
    };

    const mouseUp = () => {
      isDown = false;
      slider.classList.remove("dragging");
    };

    const mouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener("mousedown", mouseDown);
    slider.addEventListener("mouseleave", mouseLeave);
    slider.addEventListener("mouseup", mouseUp);
    slider.addEventListener("mousemove", mouseMove);

    return () => {
      slider.removeEventListener("mousedown", mouseDown);
      slider.removeEventListener("mouseleave", mouseLeave);
      slider.removeEventListener("mouseup", mouseUp);
      slider.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  const images = Array.from(
    { length: 21 },
    (_, i) => `${process.env.PUBLIC_URL}/images/${i + 1}.jpg`
  );

  const headerOpacity = Math.max(1 - scrollY / 300, 0);
  const headerTranslate = Math.min(scrollY / 6, 40);

  return (
    <div className="main-container">
      {/* 상단 타이틀 */}
      <header
        className="main-header"
        style={{
          opacity: headerOpacity,
          transform: `translateY(-${headerTranslate}px)`,
        }}
      >
        <h1 className="asset-font">
          WILLOW <span className="pf">PF</span>
        </h1>
        <h2 className="asset-font">EXPANSIVE IDEAS,</h2>
        <h2 className="asset-font">STRUCTURED CREATION</h2>
      </header>

      {/* ✅ 휠 스크롤로 이미지 슬라이드 조절 */}
      <section
        className="overlap-gallery"
        onWheel={(e) => {
          e.preventDefault();
          const direction = e.deltaY > 0 ? 1 : -1;
          setCurrent((prev) => {
            const next = prev + direction * 0.2; // ✅ 이동 속도 절반으로 감소
            if (next < 0) return 0;
            if (next * 5 >= images.length) return prev;
            return next;
          });
        }}
      >    

      
        <div className="overlap-container">
          {images.map((src, idx) => {
            const overlapCount =
              current * 5 > images.length ? images.length : current * 5;
            const showCount = Math.min(5, images.length - overlapCount);

            let style = {};
            if (idx < overlapCount) {
              style = {
                left: `${idx * 10}px`,
                transform: "scale(0.95)",
                zIndex: idx,
              };
            } else if (idx < overlapCount + showCount) {
              style = {
                left: `${overlapCount * 10 + (idx - overlapCount) * 220}px`,
                filter: "none",
                zIndex: idx,
              };
            } else {
              style = {
                left: `${
                  overlapCount * 10 +
                  showCount * 220 +
                  (idx - overlapCount - showCount) * 10
                }px`,
                transform: "scale(0.9)",
                zIndex: 0,
              };
            }

            return (
              <img
                key={idx}
                src={src}
                alt={`img-${idx}`}
                className="overlap-img"
                style={style}
              />
            );
          })}
        </div>
      </section>

      {/* ✅ 프로필 + 비디오 (위 3개 / 아래 2개 구조) */}
      <section className="profile-video-section">
        {/* 🔹 위쪽: 프로필 + 영상 3개 */}
        <div className="profile-top-row">
          <div className="profile-block">
          <div className="profile-circle">
            <img
              src={`${process.env.PUBLIC_URL}/images/me3.jpg`}
              alt="Profile"
              className="profile-img"
            />
          </div>

            <div className="profile-text">
              <p className="kor-name">유예나</p>
              <p className="eng-name">LYU YENA</p>
              <p className="info">
                010-4436-6851<br />
                yenasohappy@naver.com<br />
                명지전문대학교 패션리빙디자인학과 25년도 졸업<br />
                <a
                  href="https://instagram.com/101.1217"
                  target="_blank"
                  rel="noreferrer"
                  className="insta-link"
                >
                  instagram.com/101.1217
                </a>
              </p>
            </div>
          </div>

          {/* 프로필 옆 3개 영상 */}
          <div className="video-grid-top">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="video-box">
                <video
                  src={`${process.env.PUBLIC_URL}/videos/${i + 1}.mp4`}
                  controls
                  poster={`${process.env.PUBLIC_URL}/images/video${i + 1}.jpg`}
                />
                <p className="video-desc">
                  {i === 0 && "비쥬얼 콘텐츠 제작 제작\nPs, Canva 활용"}
                  {i === 1 && "비쥬얼 콘텐츠 제작 제작\nPs, Canva 활용"}
                  {i === 2 && "콘텐츠 제작\n Ps 스케치, Canva 활용"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 🔹 아래쪽: 영상 2개 */}
        <div className="video-grid-bottom">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="video-box">
              <video
                src={`${process.env.PUBLIC_URL}/videos/${i + 4}.mp4`}
                controls
                poster={`${process.env.PUBLIC_URL}/images/video${i + 4}.jpg`}
              />
              <p className="video-desc">
                {i === 0 && "제작 기물 포토북 영상 제작 \nPs, Canva 활용"}
                {i === 1 && "모션 그래픽 영상 제작\n Ps, Canva 활용"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ 하단 3컬럼 */}
      <section className="footer-section">
        <div className="footer-col">
          <h3>WEB TEAM PROJECT</h3>
          <div className="project">
            <img
              src={`${process.env.PUBLIC_URL}/images/project1.jpg`}
              alt="Archive Musée"
              onClick={() => window.open("https://team1-2c9b9.web.app", "_blank")}
            />
            <a
              href="https://team1-2c9b9.web.app"
              target="_blank"
              rel="noreferrer"
            >
              https://ream1-2c9b9.web.app/
            </a>
            <p>기획, 웹 디자인, 자료 수집, 데이터 등록</p>
          </div>
          <div className="project">
            <img
              src={`${process.env.PUBLIC_URL}/images/project2.jpg`}
              alt="Dance Store"
              onClick={() =>
                window.open("https://kance-851b2.web.app/", "_blank")
              }
            />
            <a
              href="https://kance-851b2.web.app/"
              target="_blank"
              rel="noreferrer"
            >
              https://dance-8512b.web.app/
            </a>
            <p>store 부분 기획, 디자인, 코드 개발·구축, 데이터 등록</p>
          </div>
        </div>

        <div className="footer-col">
          <h3>WEB DESIGN .PDF</h3>
          <p className="pdf-desc">개인 웹 기획, 디자인 작업물</p>

          <div className="pdf-thumbs">
            {["pdf1", "pdf2", "pdf3"].map((name, i) => (
              <img
                key={i}
                src={`${process.env.PUBLIC_URL}/images/${name}.png`}
                alt={name}
                onClick={() =>
                  window.open(
                    `${process.env.PUBLIC_URL}/pdf/${name}.pdf`,
                    "_blank"
                  )
                }
              />
            ))}
          </div>
        </div>

        <div className="footer-col">
          <h3>WEB SITE PORTFOLIO</h3>
          <img
            src={`${process.env.PUBLIC_URL}/images/portfolio.jpg`}
            alt="portfolio"
            className="portfolio-thumb"
            onClick={() =>
              window.open("https://yesssterday.github.io/pf", "_blank")
            }
          />
          <a
            href="https://yesssterday.github.io/pf"
            target="_blank"
            rel="noreferrer"
            className="portfolio-link"
          >
            https://yesssterday.github.io/pf
            <p>포트폴리오 웹사이트로 제작</p>
          </a>
        </div>
      </section>
    </div>
  );
};

export default MainPage;
