"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./style.css";

const capabilitiesData = [
  {
    tag: "",
    title: "ONE WORKSHOP. <span>COMPLETE CONTROL.</span>",
    desc: "The fewer times a project changes hands, the more control there is over the result. At Forgentis, critical fabrication processes are coordinated through one production environment—allowing us to maintain greater control over accuracy, quality, finishing and delivery. Whether you need a single custom component or a production run, we build around your drawings, specifications and application requirements.",
    footer: "One partner. One workflow. One finished result.",
  },
  {
    tag: "01 — METAL FABRICATION",
    title: "FROM SHEET AND SECTION TO <span>FINISHED ASSEMBLY.</span>",
    desc: "We fabricate steel, stainless steel, aluminum and brass into components, structures and assemblies built to your requirements. From individual parts to larger fabricated assemblies, our teams work from drawings and specifications to produce metalwork designed for its intended application.",
    listTitle: "MATERIALS",
    items: ["Mild Steel", "Stainless Steel", "Aluminum", "Brass"],
    cta: "DISCUSS YOUR REQUIREMENT",
  },
  {
    tag: "02 — CNC & PRECISION MANUFACTURING",
    title: "REPEATABILITY IS <span>PRECISION AT SCALE.</span>",
    desc: "Computer-controlled manufacturing allows us to produce consistent parts across individual components and repeat production. Our CNC capabilities support applications where accuracy, consistency and repeatability matter—from engineered components to architectural details.",
    listTitle: "BUILT FOR",
    items: [
      "Precision components",
      "Repeat production",
      "Complex profiles",
      "Dimensional consistency",
    ],
  },
  {
    tag: "03 — LASER CUTTING",
    title: "SHARP CUTS. CLEAN EDGES. <span>COMPLEX PROFILES.</span>",
    desc: "Our CNC laser cutting capability allows us to produce detailed profiles, panels, brackets, screens and precision components with clean, consistent cuts. We cut material up to 25mm, subject to material type and grade.",
    listTitle: "IDEAL FOR",
    items: [
      "Architectural screens",
      "Decorative panels",
      "Brackets",
      "Flanges",
      "Precision profiles",
      "Custom components",
    ],
    cta: "START WITH A DRAWING",
  },
  {
    tag: "04 — BENDING & FORMING",
    title: "FLAT MATERIAL. <span>PRECISE FORM.</span>",
    desc: "Precision bending and forming transform sheet and plate into components that are ready for assembly, installation or further fabrication. Every bend is developed around the drawing and application requirement, helping components align correctly when they reach the site.",
    listTitle: "CAPABILITIES",
    items: [
      "Press brake forming",
      "Rolling",
      "Molding",
      "Pinching",
      "Complex bends and profiles",
    ],
  },
  {
    tag: "05 — MACHINING",
    title: "PRECISION WHERE THE <span>DETAIL MATTERS.</span>",
    desc: "For components requiring controlled dimensions, detailed features or machining after fabrication, our machining capabilities provide the precision needed to bring the specification to life. From individual components to repeat requirements, machining is integrated into the wider fabrication workflow.",
    footer: "BUILT TO YOUR SPECIFICATION.",
  },
  {
    tag: "06 — WELDING & ASSEMBLY",
    title: "JOINED TO PERFORM. <span>ASSEMBLED TO INSTALL.</span>",
    desc: "Our skilled welding teams combine MIG, TIG and spot welding to create strong, clean and consistent joints. Where required, components are assembled within our facility before delivery—reducing the complexity of installation and ensuring the finished unit arrives ready for its intended application.",
    items: ["MIG", "TIG", "SPOT WELDING", "ASSEMBLY"],
  },
  {
    tag: "07 — FINISHING",
    title: "THE FINAL DETAIL <span>CHANGES THE RESULT.</span>",
    desc: "Finishing is more than appearance. The right treatment protects the material, supports the application and completes the design intent.",
    richItems: [
      { name: "PVD COATING", note: "Gold, rose gold & black chrome" },
      { name: "POWDER COATING", note: "Architectural, commercial & industrial" },
      { name: "BRUSHED & MATTE", note: "Clean surface finishes" },
      { name: "ANTI-CORROSION", note: "Outdoor protection" },
    ],
  },
  {
    tag: "08 — CUSTOM FABRICATION",
    title: "WHEN THE STANDARD <span>SOLUTION DOESN'T EXIST.</span>",
    desc: "Some projects don't fit into a standard product category. Bring us a drawing, sample, reference image or concept. Our team can develop the fabrication approach around the required dimensions, material, finish and application.",
    footer: "YOUR DESIGN. OUR FABRICATION EXPERTISE.",
  },
  {
    tag: "09 — PROTOTYPING & PRODUCTION",
    title: "TEST THE FIT. CONFIRM FINISH. <span>THEN SCALE.</span>",
    desc: "For new designs or complex requirements, we can produce a prototype or sample before moving into full production. This allows dimensions, fit, finish and fabrication details to be reviewed before the complete batch is manufactured.",
    footer: "PROTOTYPE → APPROVE → PRODUCE",
  },
  {
    tag: "10 — PRODUCTION AT SCALE",
    title: "FROM ONE PART TO <span>REPEAT PRODUCTION.</span>",
    desc: "When your requirement moves beyond a single component, Forgentis can support repeat production with controlled processes designed around consistency.",
    listTitle: "PRODUCTION PLANNING CONSIDERS",
    items: [
      "Volume",
      "Material availability",
      "Fabrication sequence",
      "Quality requirements",
      "Delivery schedule",
    ],
    footer: "Scale production without losing control of the specification.",
  },
];

export default function Section01Cap() {
  const containerRef = useRef(null);
  const slidesRef = useRef([]);
  const tlRef = useRef(null);

useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    const slides = slidesRef.current.filter(Boolean);
    tlRef.current = gsap.timeline({ paused: true });

    // Initial state
    gsap.set(slides[0], {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      pointerEvents: "auto",
    });

    // Pehli slide ke span ki initial state
    const firstSpan = slides[0].querySelector(".main_heading_section_cs1 > span");
    if (firstSpan) {
      gsap.set(firstSpan, { y: 0, opacity: 1, filter: "blur(0px)" });
    }

    gsap.set(slides.slice(1), {
      opacity: 0,
      y: 50,
      scale: 0.94,
      filter: "blur(8px)",
      pointerEvents: "none",
    });

    slides.forEach((slide, i) => {
      if (i < slides.length - 1) {
        const nextSlide = slides[i + 1];
        const nextSpan = nextSlide.querySelector(".main_heading_section_cs1 > span");

        // Next slide ke span ko animation ke liye ready karein
        if (nextSpan) {
          gsap.set(nextSpan, {
            y: "110%",
            opacity: 0,
            filter: "blur(6px)",
            letterSpacing: "4px",
          });
        }

        tlRef.current
          // 1. Current Slide EXIT
          .to(
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
            "+=1.8"
          )
          // 2. Next Slide ENTER
          .fromTo(
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
            "-=0.3"
          );

        // 3. HIGHLIGHTED TEXT REVEAL ANIMATION (Smooth Rise + De-blur + Tracking)
        if (nextSpan) {
          tlRef.current.to(
            nextSpan,
            {
              y: "0%",
              opacity: 1,
              filter: "blur(0px)",
              letterSpacing: "0px",
              duration: 1.1,
              ease: "power4.out",
            },
            "-=0.6" // Slide aane ke foran baad trigger hoga
          );
        }
      }
    });
  }, containerRef);

  const handleProgress = (e) => {
    const p = e.detail?.progress ?? 0;
    if (tlRef.current) {
      gsap.to(tlRef.current, {
        progress: p,
        duration: 0.9,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  };

  window.addEventListener("capabilityProgress", handleProgress);

  return () => {
    window.removeEventListener("capabilityProgress", handleProgress);
    ctx.revert();
  };
}, []);

  return (
    <section ref={containerRef} className="cap_section_1">
      {capabilitiesData.map((item, index) => (
        <div
          key={index}
          ref={(el) => (slidesRef.current[index] = el)}
          className="cap_slide"
        >
          {item.tag && <span className="tag_section_cs1">{item.tag}</span>}

          <h2
            className="main_heading_section_cs1"
            dangerouslySetInnerHTML={{ __html: item.title }}
          />

          <p className="content_section_cs1">{item.desc}</p>

          {item.items && (
            <div className="list_wrapper_cs1">
              {item.listTitle && (
                <span className="list_title_cs1">{item.listTitle}:</span>
              )}
              <div className="items_badge_cs1">
                {item.items.map((it, idx) => (
                  <span key={idx} className="badge_cs1">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.richItems && (
            <div className="rich_grid_cs1">
              {item.richItems.map((r, idx) => (
                <div key={idx} className="rich_card_cs1">
                  <strong>{r.name}</strong>
                  <small>{r.note}</small>
                </div>
              ))}
            </div>
          )}

          {item.footer && (
            <div className="statement_section_cs1">{item.footer}</div>
          )}

          {item.cta && <button className="cta_button_cs1">{item.cta}</button>}
        </div>
      ))}
    </section>
  );
}