import { Suspense } from "react";
import BookingSystem from '@/components/Consultation/BookingSystem';
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
export default function InformationPage() {
     return (
            <Suspense fallback={<LoadingSpinner/>}>
                <BookingSystem />
            </Suspense>
        );
}