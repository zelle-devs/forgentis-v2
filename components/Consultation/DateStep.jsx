import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DateStep.css';
import { ChevronLeft } from 'lucide-react';

const DateStep = ({ currentMonth, setCurrentMonth, selectedDate, setSelectedDate, selectedTime, setSelectedTime, selectedPlatform, setSelectedPlatform, openDropdown, setOpenDropdown }) => {
    const timeSlots = ["11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM"];

const platforms = [
    { 
        id: 'google-meet', 
        name: 'Google Meet', 
        color: '#4285F4',
        bgLight: 'var(--color-blue-glow)',
        logo: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M2 6C2 4.89543 2.89543 4 4 4H16C17.1046 4 18 4.89543 18 6V18C18 19.1046 17.1046 20 16 20H4C2.89543 20 2 19.1046 2 18V6Z" fill="#4285F4"/>
                <path d="M18 8.5L22 6V18L18 15.5V8.5Z" fill="#4285F4" opacity="0.85"/>
                <circle cx="10" cy="11.5" r="2.8" fill="white"/>
                <circle cx="10" cy="11.5" r="1.4" fill="#4285F4"/>
                <path d="M7 15.5C7 13.8 8.34 12.5 10 12.5C11.66 12.5 13 13.8 13 15.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
            </svg>
        )
    },
    { 
        id: 'teams', 
        name: 'Microsoft Teams', 
        color: '#6264A7',
        bgLight: 'var(--color-blue-glow)',
        logo: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="1" y="5" width="12" height="14" rx="3" fill="#6264A7"/>
                <path d="M13 6.5L18 3.5V17L13 14V6.5Z" fill="#6264A7" opacity="0.9"/>
                <text x="7" y="14.5" fontFamily="'Segoe UI', Arial, sans-serif" fontWeight="900" fontSize="7.5" fill="white" textAnchor="middle" letterSpacing="0">T</text>
            </svg>
        )
    },
    { 
        id: 'zoom', 
        name: 'Zoom', 
        color: '#2D8CFF',
        bgLight: 'var(--color-blue-glow)',
        logo: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="1" y="3" width="16" height="18" rx="3.5" fill="#2D8CFF"/>
                <path d="M17 7L23 4V20L17 17V7Z" fill="#2D8CFF" opacity="0.9"/>
                <rect x="4.2" y="6.5" width="4.5" height="11" rx="1.3" fill="white"/>
                <circle cx="6.45" cy="10" r="1" fill="#2D8CFF"/>
                <rect x="9.5" y="6.5" width="4.5" height="11" rx="1.3" fill="white"/>
                <circle cx="11.75" cy="10" r="1" fill="#2D8CFF"/>
            </svg>
        )
    }
];

const meetingModes = [
    {
        id: 'onsite',
        name: 'Onsite',
        color: 'var(--color-blue-main2)',
        bgLight: 'var(--color-blue-glow)',
        logo: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M4 21V8L12 3L20 8V21H14V14H10V21H4Z" fill="var(--color-blue-main2)"/>
            </svg>
        )
    },
    {
        id: 'online',
        name: 'Online',
        color: 'var(--color-blue-main2)',
        bgLight: 'var(--color-blue-glow)',
        logo: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" fill="var(--color-blue-main2)"/>
                <path d="M3 12H21M12 3C14.5 5.5 15.8 8.5 15.8 12C15.8 15.5 14.5 18.5 12 21C9.5 18.5 8.2 15.5 8.2 12C8.2 8.5 9.5 5.5 12 3Z" stroke="white" strokeWidth="1.2" fill="none"/>
            </svg>
        )
    }
];

    const calendarData = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        const days = [];

        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            const d = new Date(year, month - 1, prevMonthLastDay - i);
            days.push({ day: prevMonthLastDay - i, dateObj: d, isCurrentMonth: false, isDisabled: true });
        }
        for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(year, month, i);
            days.push({ day: i, dateObj: d, isCurrentMonth: true, isDisabled: d < today });
        }
        return days;
    }, [currentMonth]);

    const [platformStage, setPlatformStage] = useState(
    selectedPlatform && selectedPlatform !== 'onsite' ? 'platform' : 'mode'
);

const handleModeClick = (modeId) => {
    if (modeId === 'onsite') {
        setSelectedPlatform('onsite');
    } else {
        setSelectedPlatform('');
        setPlatformStage('platform');
    }
};

const handleBackToModes = () => {
    setSelectedPlatform('');
    setPlatformStage('mode');
};

    return (
        <div className="step-container">
            <div className="split-layout">
                <div className="separate-calendar-card">
                    <h2 className="step-title">Select Date</h2>
                    
                    <div className="calendar-header">
                        <div className="nav-btns">
                            <button className="circle-btn" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </button>
                            <button className="circle-btn" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </button>
                        </div>

                        <div className="selectors">
                            <div className="select-wrapper">
                                <div className="pill-select" onClick={() => setOpenDropdown(openDropdown === 'month' ? null : 'month')}>
                                    <span>{currentMonth.toLocaleString('default', { month: 'long' })}</span>
                                    <div className={`chevron ${openDropdown === 'month' ? 'rotate' : ""}`}>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </div>
                                </div>
                                {openDropdown === 'month' && (
                                    <div className="pill-dropdown-list" data-dropdown>
                                        {Array.from({ length: 12 }, (_, i) => {
                                            const today = new Date();
                                            const isPastMonth = currentMonth.getFullYear() === today.getFullYear() && i < today.getMonth();
                                            return (
                                                <div key={i} className="pill-option" onClick={() => { setCurrentMonth(new Date(currentMonth.getFullYear(), i, 1)); setOpenDropdown(null); }}
                                                    style={isPastMonth ? { opacity: 0.4, cursor: 'not-allowed', pointerEvents: 'none' } : {}}>
                                                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="select-wrapper">
                                <div className="pill-select" onClick={() => setOpenDropdown(openDropdown === 'year' ? null : 'year')}>
                                    <span>{currentMonth.getFullYear()}</span>
                                    <div className={`chevron ${openDropdown === 'year' ? 'rotate' : ""}`}>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </div>
                                </div>
                                {openDropdown === 'year' && (
                                    <div className="pill-dropdown-list" data-dropdown>
                                        {[2026, 2027, 2028, 2029].map(year => (
                                            <div key={year} className="pill-option" onClick={() => { setCurrentMonth(new Date(year, currentMonth.getMonth(), 1)); setOpenDropdown(null); }}>
                                                {year}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div className="calendar-grid"
                            key={currentMonth.getMonth() + '-' + currentMonth.getFullYear()}
                            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                            transition={{ duration: 0.25, ease: "easeOut" }}>
                            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => <span key={d} className="day-name">{d}</span>)}
                            {calendarData.map((item, idx) => {
                                const isSelected = selectedDate?.toDateString() === item.dateObj?.toDateString();
                                return (
                                    <button
                                        key={idx}
                                        disabled={item.isDisabled}
                                        className={`day-btn ${isSelected ? 'selected-day' : ""} ${!item.isCurrentMonth ? 'other-month-day' : ""} ${item.isDisabled ? 'disabled-day' : ""}`}
                                        onClick={() => setSelectedDate(item.dateObj)}
                                    >
                                        {item.day}
                                        {isSelected && <span className="selected-dot"></span>}
                                    </button>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="separate-time-card">
                    <h3 className="side-label">Select Time Slot</h3>
                    <div className="time-grid-wrapper">
                        <div className="time-grid">
                            {timeSlots.map(time => (
                                <button
                                    key={time}
                                    className={`time-btn ${selectedTime === time ? 'active-time' : ""}`}
                                    onClick={() => setSelectedTime(time)}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="platform-section">
                <div className="platform-section-header">
                    <h2 className="platform-section-title">
                        {platformStage === 'mode' ? 'Meeting Type' : 'Meeting Platform'}
                    </h2>
                    {platformStage === 'platform' && (
                        <button type="button" className="back-to-modes-btn" onClick={handleBackToModes}>
                            <span className="backbtn"><ChevronLeft size={13} strokeWidth={3}/> Back</span>
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {platformStage === 'mode' ? (
                        <motion.div
                            key="mode-cards"
                            className="platform-grid platform-grid-two"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            {meetingModes.map(mode => {
                                const isSelected = selectedPlatform === mode.id;
                                return (
                                    <motion.button
                                        key={mode.id}
                                        className={`platform-card ${isSelected ? 'platform-selected' : ''}`}
                                        onClick={() => handleModeClick(mode.id)}
                                        style={isSelected ? {
                                            borderColor: mode.color,
                                            backgroundColor: mode.bgLight,
                                            boxShadow: `0 6px 20px ${mode.color}25`
                                        } : {}}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="platform-logo" style={{ color: mode.color }}>
                                            {mode.logo}
                                        </div>
                                        <span className="platform-name" style={isSelected ? { color: mode.color, fontWeight: 700 } : {}}>
                                            {mode.name}
                                        </span>
                                        {isSelected && (
                                            <div className="platform-check" style={{ backgroundColor: mode.color }}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="platform-cards"
                            className="platform-grid"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            {platforms.map(platform => {
                                const isSelected = selectedPlatform === platform.id;
                                return (
                                    <motion.button
                                        key={platform.id}
                                        className={`platform-card ${isSelected ? 'platform-selected' : ''}`}
                                        onClick={() => setSelectedPlatform(platform.id)}
                                        style={isSelected ? {
                                            borderColor: platform.color,
                                            backgroundColor: platform.bgLight,
                                            boxShadow: `0 6px 20px ${platform.color}25`
                                        } : {}}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="platform-logo" style={{ color: platform.color }}>
                                            {platform.logo}
                                        </div>
                                        <span className="platform-name" style={isSelected ? { color: platform.color, fontWeight: 700 } : {}}>
                                            {platform.name}
                                        </span>
                                        {isSelected && (
                                            <div className="platform-check" style={{ backgroundColor: platform.color }}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DateStep;