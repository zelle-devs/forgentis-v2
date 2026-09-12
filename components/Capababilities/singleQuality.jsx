"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./style.css";

export default function Section01SingleQuality({
  data = {},
  eventName = "singleQualityProgress",
  onButtonClick,
}) {
  const containerRef = useRef(null);
  const slideRef = useRef(null);
  const tlRef = useRef(null);

  useLayoutEffect(() => {
    if (!data || Object.keys(data).length === 0) return;

    const ctx = gsap.context(() => {
      const slide = slideRef.current;
      if (!slide) return;

      const span = slide.querySelector(".main_heading_section_cs1 > span");
      const button = slide.querySelector(".cta_button_cs1");
      const otherElements = slide.querySelectorAll(
        ".tag_section_cs1, .content_section_cs1, .statement_section_cs1, .intro_items_cs1, .rich_grid_cs1, .process_title_cs1"
      );

      /*
      =====================================================
      INITIAL STATE (Hidden / Waiting to enter)
      =====================================================
      */
      gsap.set(slide, {
        opacity: 0,
        y: 40,
        scale: 0.95,
        filter: "blur(8px)",
      });

      if (span) {
        gsap.set(span, {
          y: "110%",
          opacity: 0,
          filter: "blur(6px)",
          letterSpacing: "4px",
        });
      }

      if (button) {
        gsap.set(button, {
          opacity: 0,
          y: 20,
          scale: 0.9,
        });
      }

      if (otherElements.length) {
        gsap.set(otherElements, {
          opacity: 0,
          y: 15,
        });
      }

      /*
      =====================================================
      PROGRESS TIMELINE (Scrubbable 0 -> 1)
      =====================================================
      */
      tlRef.current = gsap.timeline({ paused: true });

      // Slide In & Unblur
      tlRef.current.to(slide, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power2.out",
      });

      // Highlighted Word reveal
      if (span) {
        tlRef.current.to(
          span,
          {
            y: "0%",
            opacity: 1,
            filter: "blur(0px)",
            letterSpacing: "0px",
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.4"
        );
      }

      // Supporting texts fade in
      if (otherElements.length) {
        tlRef.current.to(
          otherElements,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.5"
        );
      }

      // CTA Button Pop In
      if (button) {
        tlRef.current.to(
          button,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.5)",
          },
          "-=0.3"
        );
      }
    }, containerRef);

    /*
    =====================================================
    DYNAMIC SCROLL EVENT LISTENER
    =====================================================
    */
    const handleProgress = (e) => {
      const p = e.detail?.progress ?? 0;

      if (tlRef.current) {
        gsap.to(tlRef.current, {
          progress: p,
          duration: 0.15,
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
  }, [eventName, data]);

  if (!data || Object.keys(data).length === 0) return null;

  return (
    <section ref={containerRef} className="cap_section_1">
      <div ref={slideRef} className="cap_slide">
        {/* TAG */}
        {data.tag && <span className="tag_section_cs1">{data.tag}</span>}

        {/* MAIN HEADING */}
        {data.title && (
          <h2
            className="main_heading_section_cs1"
            dangerouslySetInnerHTML={{
              __html: data.title,
            }}
          />
        )}

        {/* MAIN DESCRIPTION */}
        {data.desc && <p className="content_section_cs1">{data.desc}</p>}

        {/* SECONDARY DESCRIPTION */}
        {data.secondaryDesc && (
          <p className="secondary_content_cs1">{data.secondaryDesc}</p>
        )}

        {/* PROCESS / SUB STATEMENT */}
        {data.processTitle && (
          <div className="process_title_cs1">{data.processTitle}</div>
        )}

        {/* RICH CARDS / HIGHLIGHTS (OPTIONAL) */}
        {data.richItems && (
          <div className="rich_grid_cs1">
            {data.richItems.map((item, idx) => (
              <div key={idx} className="rich_card_cs1">
                <strong>{item.title}</strong>
                <small>{item.desc}</small>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER STATEMENT */}
        {data.footer && (
          <div className="statement_section_cs1">{data.footer}</div>
        )}

        {/* ACTION BUTTON */}
        {data.buttonText && (
          <button
            type="button"
            className="cta_button_cs1"
            onClick={onButtonClick}
          >
            {data.buttonText}
          </button>
        )}
      </div>
    </section>
  );
}