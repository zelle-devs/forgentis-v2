"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from 'next/navigation';
import './BookingSystem.css';
import DateStep from './DateStep';
import FormStep from './FormStep';
import ReviewStep from './ReviewStep';
import { updateStepInURL, getStepFromPath } from '@/app/utils/urlParams';
import DynamicButton from '../DynamicButton/DynamicButton';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const stepperVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.2
        }
    }
};

const stepVariants = {
    hidden: {
        opacity: 0,
        x: -40
    },
    show: {
        opacity: 1,
        x: 0,
        transition: {
            duration: .5
        }
    }
};

const pageVariants = {
    initial: {
        clipPath: "inset(0 0 100% 0 round 30px)",
        opacity: 0.5
    },

    animate: {
        clipPath: "inset(0 0 0% 0 round 30px)",
        opacity: 1,
        transition: {
            delay: 1.3,
            duration: 1.3,
            ease: [0.22, 1, 0.36, 1]
        }
    },

    exit: {
        clipPath: "inset(0 100% 0 0 round 30px)",
        opacity: 0.5,
        transition: {
            duration: 0.55,
            ease: [0.65, 0, 0.35, 1]
        }
    }
};

const initialPageVariants = {
    initial: {
        clipPath: "inset(0 0 100% 0 round 30px)",
        opacity: 0.5
    },

    animate: {
        clipPath: "inset(0 0 0% 0 round 30px)",
        opacity: 1,
        transition: {
            delay: 1,
            duration: 1.2
        }
    }
};

const slideVariants = {
    initial: (direction) => ({
        clipPath:
            direction === 1
                ? "inset(0 0 0 100% round 30px)"
                : "inset(0 100% 0 0 round 30px)"
    }),

    animate: {
        clipPath: "inset(0 0 0 0 round 30px)",
        transition: {
            duration: 0.75,
            ease: [0.65, 0, 0.35, 1]
        }
    },

    exit: (direction) => ({
        clipPath:
            direction === 1
                ? "inset(0 100% 0 0 round 30px)"
                : "inset(0 0 0 100% round 30px)",
        transition: {
            duration: 0.75,
            ease: [0.65, 0, 0.35, 1]
        }
    })
};

const successVariants = {
    initial: {
        clipPath: "inset(0 0 100% 0 round 30px)",
        opacity: 0.5
    },

    animate: {
        clipPath: "inset(0 0 0 0 round 30px)",
        opacity: 1,
        transition: {
            delay: 0.8,
            duration: 1.5,
            ease: [0.25, 0.1, 0.25, 1]
        }
    }
};



const BookingSystem = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [direction, setDirection] = useState(1);
    const [isConfirming, setIsConfirming] = useState(false);

    const [step, setStep] = useState(() => getStepFromPath(searchParams));
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isUpdatingFromURL, setIsUpdatingFromURL] = useState(false);
    const [stepProgress, setStepProgress] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [selectedMedium, setSelectedMedium] = useState('');


    const generateGoogleCalendarUrl = ({ date, timeSlot, medium, platform, companyName, clientName }) => {
        if (!date || !timeSlot) return 'https://calendar.google.com';

        // Parse time (handles "10:00 AM" or ranges like "10:00 AM - 11:00 AM")
        const startTimePart = timeSlot.split('-')[0].trim();
        const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i;
        const match = startTimePart.match(timeRegex);

        let startYear = date.getFullYear();
        let startMonth = date.getMonth();
        let startDay = date.getDate();
        let startHours = 10;
        let startMinutes = 0;

        if (match) {
            let hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            const period = match[3] ? match[3].toUpperCase() : null;

            if (period === 'PM' && hours < 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;

            startHours = hours;
            startMinutes = minutes;
        }

        const startDate = new Date(startYear, startMonth, startDay, startHours, startMinutes);
        // Default meeting duration: 45 minutes
        const endDate = new Date(startDate.getTime() + 45 * 60000);

        const formatToUTCString = (d) => {
            return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const title = encodeURIComponent(`Forgentis Consultation`);
        const details = encodeURIComponent(
            `Consultation booked via Booking Portal.\n\n` +
            `Client: ${clientName}\n` +
            `Medium: ${medium === 'onsite' ? 'Onsite' : platform || 'Online'}\n` +
            `Time: ${timeSlot}`
        );
        const location = encodeURIComponent(
            medium === 'onsite' ? 'Onsite Office' : (platform || 'Online Video Meeting')
        );
        const dates = `${formatToUTCString(startDate)}/${formatToUTCString(endDate)}`;

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            setHasLoaded(true);
        }, 2200);

        return () => clearTimeout(timer);
    }, []);

    const [formData, setFormData] = useState({
        Fname: '', Lname: '', workEmail: '', phone: '',
        companyName: '', jobTitle: '', companySize: '', industry: '',
        primaryGoal: '', notes: ''
    });


    const [step1Valid, setStep1Valid] = useState(false);
    const [step2Valid, setStep2Valid] = useState(false);

    const validateStep1 = () => {
        const isValid = selectedDate !== null && selectedTime !== null && selectedMedium !== "" && (selectedMedium === 'online' ? selectedPlatform !== "" : true);;
        console.log(selectedMedium, "here")
        //  
        setStep1Valid(isValid);
        return isValid;
    };

    const validateStep2 = () => {
        const isValid = formData.Fname && formData.Fname.trim() !== '' &&
            formData.Lname && formData.Lname.trim() !== '' &&
            formData.workEmail && formData.workEmail.trim() !== '' &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail) &&
            formData.phone && formData.phone.trim() !== '';

        setStep2Valid(isValid);
        return isValid;
    };

    const transitionToStep = (newStep) => {
        if (newStep === step) return;

        setIsTransitioning(true);

        setTimeout(() => {
            setStep(newStep);
            updateStepInURL(newStep, router, true);

            window.scrollTo({ top: 0, behavior: 'smooth' });

            setTimeout(() => {
                setIsTransitioning(false);
            }, 100);
        }, 150);
    };

    const handleStepChange = (newStep) => {
        if (newStep === step) return;

        setDirection(newStep > step ? 1 : -1);

        if (newStep < step) {
            transitionToStep(newStep);
        } else {
            if (step === 1 && validateStep1()) {
                transitionToStep(newStep);
            } else if (step === 2 && validateStep2()) {
                transitionToStep(newStep);
            } else {
                showErrorToast(
                    `Please complete ${step === 1 ? "date & time" : "personal details"
                    } before proceeding`
                );
            }
        }
    };


    const handleNext = () => {
        setDirection(1);
        if (step === 1 && validateStep1()) {
            transitionToStep(2);
        } else if (step === 2 && validateStep2()) {
            transitionToStep(3);
        } else {
            const errorMsg = `Please complete ${step === 1 ? 'date & time' : 'personal details'} before proceeding`;
            showErrorToast(errorMsg);
        }
    };

    const handleBack = () => {
        setDirection(-1);

        if (step > 1) {
            transitionToStep(step - 1);
        }
    };

    const showErrorToast = (message) => {
        alert(message);
    };

    const formatDateForAPI = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleConfirm = () => {
        if (validateStep2()) {
            setIsConfirming(true);

            const payload = {
                selected_date: formatDateForAPI(selectedDate),
                selected_slot: selectedTime,
                meeting_type: selectedMedium,
                online_meeting_platform: selectedPlatform,

                first_name: formData.Fname,
                last_name: formData.Lname,
                email: formData.workEmail,
                phone: formData.phone,
                company_name: formData.companyName,
                designation: formData.jobTitle,
                company_size: formData.companySize,
                industry: formData.industry,
                // primary_goal: formData.primaryGoal,
                requirement_detail: formData.notes
            };

            fetch('https://ajgrouphqapi.zellehost.com/api/fg-consultations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Failed to submit consultation');
                    }
                    return res.json();
                })
                .then(() => {
                    setIsConfirming(false);
                    setIsConfirmed(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                })
                .catch((err) => {
                    console.error('Booking submission error:', err);
                    setIsConfirming(false);
                    showErrorToast('Something went wrong while confirming your booking. Please try again.');
                });
        } else {
            showErrorToast('Please complete all required fields before confirming');
        }
    };

    useEffect(() => {
        const currentStep = getStepFromPath(searchParams);
        if (currentStep !== step && !isUpdatingFromURL) {
            setIsUpdatingFromURL(true);

            if (currentStep < step) {
                transitionToStep(currentStep);
            } else if (currentStep > step) {
                if (step === 1 && validateStep1()) {
                    transitionToStep(currentStep);
                } else if (step === 2 && validateStep2()) {
                    transitionToStep(currentStep);
                } else {
                    updateStepInURL(step, router, true);
                }
            }
            setIsUpdatingFromURL(false);
        }
    }, [searchParams]);

    useEffect(() => {
        const handleGlobalClick = (event) => {
            if (!event.target.closest('[data-dropdown]')) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleGlobalClick);
        return () => document.removeEventListener("mousedown", handleGlobalClick);
    }, []);

    const getPlatformName = (id) => {
        switch (id) {
            case 'onsite': return 'Onsite';
            case 'google_meet': return 'Google Meet';
            case 'zoom': return 'Zoom';
            case 'ms_teams': return 'Microsoft Teams';
            default: return 'Google Meet';
        }
    };

    useEffect(() => {
        const progress = step - 1;
        setStepProgress(progress);
        document.documentElement.style.setProperty('--step-progress', progress);
    }, [step]);

    useEffect(() => {
        validateStep1();
    }, [selectedDate, selectedTime, selectedPlatform, selectedMedium]);

    useEffect(() => {
        validateStep2();
    }, [formData]);

    if (isConfirmed) {

        return (

            <motion.div className={`section-padding main-wrapper`}
                variants={successVariants}
                initial="initial"
                animate="animate"
            >

                <div className="final-success-card">

                    <div className="success-header">
                        <div className="check-circle">
                            <svg className="checkmark" viewBox="0 0 52 52">
                                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                            </svg>
                        </div>
                        <h2 className="success-title">Demo Scheduled!</h2>
                        <p className="success-subtitle">We&apos;ve sent a confirmation email to {formData.workEmail}</p>
                    </div>

                    <div className="success-summary-grid">
                        <div className="success-summary-item">
                            <span className="success-summary-label">Selected Date</span>
                            <p className="success-summary-value">
                                {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                        <div className="success-summary-item">
                            <span className="success-summary-label">Selected Slot</span>
                            <p className="success-summary-value">{selectedTime}</p>
                        </div>
                        <div className="success-summary-item">
                            <span className="success-summary-label">Meeting Method</span>
                            <p className="success-summary-value">{selectedMedium === 'onsite' ? "Onsite" : getPlatformName(selectedPlatform)}</p>
                        </div>
                    </div>

                    <div className="success-info-section">
                        <h3 className="success-info-title">Personal Information</h3>
                        <div className="success-info-grid">
                            <div className="success-info-item">
                                <span>Full Name</span>
                                <p>{formData.Fname} {formData.Lname}</p>
                            </div>
                            <div className="success-info-item">
                                <span>Work Email</span>
                                <p>{formData.workEmail}</p>
                            </div>
                            <div className="success-info-item">
                                <span>Phone Number</span>
                                <p>{formData.phone}</p>
                            </div>
                        </div>
                    </div>

                    {formData.companyName && (
                        <div className="success-info-section">
                            <h3 className="success-info-title">Company Information</h3>
                            <div className="success-info-grid">
                                {formData.companyName && (
                                    <div className="success-info-item">
                                        <span>Company Name</span>
                                        <p>{formData.companyName}</p>
                                    </div>
                                )}
                                {formData.jobTitle && (
                                    <div className="success-info-item">
                                        <span>Designation</span>
                                        <p>{formData.jobTitle}</p>
                                    </div>
                                )}
                                {formData.companySize && (
                                    <div className="success-info-item">
                                        <span>Company Size</span>
                                        <p>{formData.companySize}</p>
                                    </div>
                                )}
                                {formData.industry && (
                                    <div className="success-info-item">
                                        <span>Industry</span>
                                        <p>{formData.industry}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {formData.primaryGoal && (
                        <div className="success-info-section">
                            <h3 className="success-info-title">Business Needs</h3>
                            <div className="success-info-grid">
                                <div className="success-info-item">
                                    {/* <span>Primary Goal</span> */}
                                    <p>{formData.primaryGoal}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {formData.notes && (
                        <div className="success-info-section">
                            <h3 className="success-info-title">Additional Requirements</h3>
                            <div className="success-info-grid">
                                <div className="success-info-item">
                                    <span>Your Requirements</span>
                                    <p>{formData.notes}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="success-buttons-container">
                        <DynamicButton
                            label="Back to Home"
                            variant='outline'
                            onClick={() => window.location.href = '/'}
                        />
                        <DynamicButton
                            label="Add To Calendar"
                            onClick={() => {
                                const calendarUrl = generateGoogleCalendarUrl({
                                    date: selectedDate,
                                    timeSlot: selectedTime,
                                    medium: selectedMedium,
                                    platform: getPlatformName(selectedPlatform),
                                    companyName: formData.companyName,
                                    clientName: `${formData.Fname} ${formData.Lname}`.trim()
                                });
                                window.open(calendarUrl, '_blank', 'noopener,noreferrer');
                            }}
                        />
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className={`section-padding main-wrapper`}>

            {isConfirming && <LoadingSpinner />}

            <motion.div
                className="stepper"
                variants={stepperVariants}
                initial="hidden"
                animate="show"
                style={{ '--step-progress': stepProgress }}
            >
                {[
                    { step: 1, name: 'Date & Time' },
                    { step: 2, name: 'Personal Details' },
                    { step: 3, name: 'Review' }
                ].map((item) => {
                    const isActive = step === item.step;
                    const isCompleted = step > item.step;

                    const isClickable =
                        item.step < step ||
                        (item.step === step + 1 && step === 1 && step1Valid) ||
                        (item.step === step + 1 && step === 2 && step2Valid);

                    return (
                        <motion.div
                            key={item.step}
                            variants={stepVariants}
                            className={`step-item 
                                ${isCompleted ? 'completed-step' : ''} 
                                ${isActive ? 'active-step' : ''}
                                ${!isClickable && item.step > step ? 'disabled-step' : ''}`}
                            onClick={() => isClickable && handleStepChange(item.step)}
                            style={{ cursor: isClickable ? 'pointer' : 'not-allowed' }}
                        >
                            <div className="active-glow-wrapper">
                                <div className="step-circle">
                                    <span className="step-number">{item.step}</span>
                                    <span className="step-check"></span>
                                </div>
                            </div>
                            <span className="step-label">{item.name}</span>
                        </motion.div>
                    );
                })}
            </motion.div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    custom={direction}
                    variants={hasLoaded ? slideVariants : initialPageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"

                    className={`${step === 1 ? 'step-one-wrapper' : 'step-container'} ${isTransitioning ? 'step-transitioning' : ''}`}
                >
                    {step === 1 && (
                        <DateStep
                            currentMonth={currentMonth}
                            setCurrentMonth={setCurrentMonth}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            selectedTime={selectedTime}
                            setSelectedTime={setSelectedTime}
                            selectedPlatform={selectedPlatform}
                            setSelectedPlatform={setSelectedPlatform}
                            setSelectedMedium={setSelectedMedium}
                            selectedMedium={selectedMedium}
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                        />
                    )}

                    {step === 2 && (
                        <FormStep
                            formData={formData}
                            setFormData={setFormData}
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            selectedDate={selectedDate}
                            selectedMedium={selectedMedium}
                            selectedTime={selectedTime}
                            selectedPlatform={selectedPlatform}
                        />
                    )}

                    {step === 3 && (
                        <ReviewStep
                            formData={formData}
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            selectedPlatform={selectedPlatform}
                            selectedMedium={selectedMedium}
                            onEditDate={() => handleStepChange(1)}
                            onEditForm={() => handleStepChange(2)}
                        />
                    )}

                    <div className="action-area">
                        <div className="action-area-inner">
                            <div className="back-container">
                                {step > 1 && (
                                    <DynamicButton
                                        label="Back"
                                        width='full'
                                        size='sm'
                                        variant='outline'
                                        onClick={handleBack}
                                        className="back-btn"
                                    />
                                )}
                            </div>
                            <div className="next-container">
                                {step === 1 && (
                                    <DynamicButton
                                        label="Next Step"
                                        width='full'
                                        size='sm'
                                        onClick={handleNext}
                                        disabled={!step1Valid}
                                        className="next-btn"
                                    />
                                )}
                                {step === 2 && (
                                    <DynamicButton
                                        label="Review Booking"
                                        width='full'
                                        size='sm'
                                        onClick={handleNext}
                                        disabled={!step2Valid}
                                        className="next-btn"
                                    />
                                )}
                                {step === 3 && (
                                    <DynamicButton
                                        label="Confirm Booking"
                                        size='sm'
                                        width='full'
                                        onClick={handleConfirm}
                                        className="confirm-btn"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default BookingSystem;