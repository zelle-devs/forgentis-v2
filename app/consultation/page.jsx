'use client'

import BookingSystem from '@/components/Consultation/BookingSystem'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import NavContent from '@/components/NavContent/NavContent'
import { Suspense } from 'react'

export default function ConsultationPage() {
  return (
    <>
      <NavContent />

      <section
        className="scroll-section"
        data-section-type="short"
        style={{
          maxWidth: '100%',
          paddingBottom: '30px',
          pointerEvents: 'auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <BookingSystem />
        </Suspense>
      </section>
    </>
  )
}



// import BookingSystem from "@/components/Consultation/BookingSystem";
// import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
// import { Suspense } from "react";

// export default function ConsultationPage() {
//   return (
//     <>
//       <section
//         className="scroll-section"
//         data-section-type="short"
//         style={{
//           maxWidth: "100%",
//           paddingBottom: "30px",
//           pointerEvents: "auto",
//           position: "relative",
//           zIndex: 10,
//         }}
//       >
//         <Suspense fallback={<LoadingSpinner/>}>
//           <BookingSystem />
//         </Suspense>
//       </section>
//     </>
//   )
// }

// export default function ConsultationPage() {
//   return (
//     <>
//       <section className="scroll-section" data-section-type="short" style={{ maxWidth: "100%", paddingBottom: "30px", }}>
//         <Suspense fallback={<LoadingSpinner/>}>
//           <BookingSystem />
//         </Suspense>
//       </section>
//     </>
//   )
// }
