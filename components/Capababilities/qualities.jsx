"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./style.css";

export default function Section01Quality({
  qualityData = [],
  eventName = "capabilityProgress",
}) {
  const containerRef = useRef(null);
  const slidesRef = useRef([]);
  const tlRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const slides = slidesRef.current.filter(Boolean);

      if (!slides.length) return;

      tlRef.current = gsap.timeline({
        paused: true,
      });

      /*
      =====================================================
      INITIAL STATE
      =====================================================
      */
      gsap.set(slides[0], {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        pointerEvents: "auto",
      });

      const firstSpan = slides[0].querySelector(
        ".main_heading_section_cs1 > span"
      );

      if (firstSpan) {
        gsap.set(firstSpan, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          letterSpacing: "0px",
        });
      }

      /*
      =====================================================
      HIDE ALL OTHER SLIDES
      =====================================================
      */
      if (slides.length > 1) {
        gsap.set(slides.slice(1), {
          opacity: 0,
          y: 40,
          scale: 0.94,
          filter: "blur(8px)",
          pointerEvents: "none",
        });
      }

      /*
      =====================================================
      TIMELINE TRANSITIONS (No dead gaps)
      =====================================================
      */
      slides.forEach((slide, i) => {
        if (i >= slides.length - 1) return;

        const nextSlide = slides[i + 1];
        const nextSpan = nextSlide.querySelector(
          ".main_heading_section_cs1 > span"
        );

        if (nextSpan) {
          gsap.set(nextSpan, {
            y: "110%",
            opacity: 0,
            filter: "blur(6px)",
            letterSpacing: "4px",
          });
        }

        const label = `step-${i}`;

        // Current slide exits
        tlRef.current.to(
          slide,
          {
            opacity: 0,
            y: -40,
            scale: 0.94,
            filter: "blur(8px)",
            duration: 1,
            ease: "power2.inOut",
            pointerEvents: "none",
          },
          label
        );

        // Next slide enters in sync
        tlRef.current.fromTo(
          nextSlide,
          {
            opacity: 0,
            y: 40,
            scale: 0.94,
            filter: "blur(8px)",
            pointerEvents: "none",
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power2.out",
            pointerEvents: "auto",
          },
          `${label}+=0.15`
        );

        // Highlighted text reveal
        if (nextSpan) {
          tlRef.current.to(
            nextSpan,
            {
              y: "0%",
              opacity: 1,
              filter: "blur(0px)",
              letterSpacing: "0px",
              duration: 0.8,
              ease: "power3.out",
            },
            `${label}+=0.3`
          );
        }
      });
    }, containerRef);

    /*
    =====================================================
    DYNAMIC SCROLL LISTENER (Tight duration for real-time scrub)
    =====================================================
    */
    const handleProgress = (e) => {
      const p = e.detail?.progress ?? 0;

      if (tlRef.current) {
        gsap.to(tlRef.current, {
          progress: p,
          duration: 0.2,
          ease: "power1.out",
          overwrite: "auto",
        });
      }
    };

    window.addEventListener(eventName, handleProgress);

    return () => {
      window.removeEventListener(eventName, handleProgress);
      ctx.revert();
    };
  }, [eventName, qualityData]);

  return (
    <section ref={containerRef} className="cap_section_1">
      {qualityData.map((item, index) => (
        <div
          key={index}
          ref={(el) => {
            slidesRef.current[index] = el;
          }}
          className="cap_slide"
        >
          {item.tag && <span className="tag_section_cs1">{item.tag}</span>}

          <h2
            className="main_heading_section_cs1"
            dangerouslySetInnerHTML={{
              __html: item.title,
            }}
          />

          {item.desc && <p className="content_section_cs1">{item.desc}</p>}

          {item.introItems && (
            <div className="intro_items_cs1">
              {item.introItems.map((text, idx) => (
                <span key={idx} className="intro_item_cs1">
                  {text}
                </span>
              ))}
            </div>
          )}

          {item.secondaryDesc && (
            <p className="secondary_content_cs1">{item.secondaryDesc}</p>
          )}

          {item.processTitle && (
            <div className="process_title_cs1">{item.processTitle}</div>
          )}

          {item.processItems && (
            <div className="process_list_cs1">
              {item.processItems.map((process, idx) => (
                <div key={idx} className="process_row_cs1">
                  <span className="process_number_cs1">{process.number}</span>
                  <span className="process_name_cs1">{process.title}</span>
                  <span className="process_description_cs1">
                    {process.description}
                  </span>
                </div>
              ))}
            </div>
          )}

          {item.footer && (
            <div className="statement_section_cs1">{item.footer}</div>
          )}
        </div>
      ))}
    </section>
  );
}