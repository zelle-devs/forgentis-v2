'use client'

import React, { useState,useEffect } from 'react';
import { IoIosInformationCircle } from 'react-icons/io';
import { Check } from 'lucide-react';
import './FormStep.css';

const FormStep = ({ 
    formData, 
    setFormData, 
    openDropdown, 
    setOpenDropdown, 
    selectedDate, 
    selectedTime, 
    selectedPlatform, 
    selectedMedium 
}) => {
    const [emailError, setEmailError] = useState('');
    const [focusedField, setFocusedField] = useState(null);

    // Global listener to close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.custom-select-wrapper')) {
                setOpenDropdown(null);
                setFocusedField(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setOpenDropdown]);

    const CustomSelect = ({ label, value, options, fieldName, placeholder, required = false }) => {
        const isOpen = openDropdown === fieldName;
        const isFocused = focusedField === fieldName;
        
        return (
            <div className="input-group">
                <label>{label} {required && <span className="required-star">*</span>}</label>
                <div className="custom-select-wrapper">
                    <div 
                        className="neu-input custom-trigger" 
                        onClick={() => {
                            setOpenDropdown(isOpen ? null : fieldName);
                            setFocusedField(fieldName);
                        }}
                        tabIndex={0}
                    >
                        <span style={{ color: value ? '#1A1A1A' : (isFocused ? '#666' : '#999') }}>
                            {value || (isFocused ? '' : placeholder)}
                        </span>
                        <div className={`form-chevron ${isOpen ? 'rotate' : ""}`}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                    </div>

                    {isOpen && (
                        <div 
                            className="neu-dropdown-list" 
                            data-dropdown
                            onMouseDown={(e) => e.stopPropagation()} 
                            onWheel={(e) => e.stopPropagation()}
                        >
                            {options.map(opt => (
                                <div 
                                    key={opt} 
                                    className="neu-option" 
                                    onClick={() => { 
                                        setFormData({ ...formData, [fieldName]: opt }); 
                                        setOpenDropdown(null); 
                                        setFocusedField(null);
                                    }}
                                >
                                    {opt}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const MultiSelectChips = ({ label, options, fieldName, required = false }) => {
        const selected = formData[fieldName] || [];
        
        const toggleOption = (option) => {
            const updated = selected.includes(option)
                ? selected.filter(item => item !== option)
                : [...selected, option];
            setFormData({ ...formData, [fieldName]: updated });
        };

        return (
            <div className="input-group">
                <label>{label} {required && <span className="required-star">*</span>}</label>
                <div className="chip-grid">
                    {options.map(option => {
                        const isSelected = selected.includes(option);
                        return (
                            <button
                                key={option}
                                type="button"
                                className={`chip-item ${isSelected ? 'chip-selected' : ''}`}
                                onClick={() => toggleOption(option)}
                            >
                                <span>{option}</span>
                                {isSelected && <Check size={14} className="chip-check" />}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const RadioGroup = ({ label, options, fieldName, required = false }) => {
        const value = formData[fieldName] || '';
        
        return (
            <div className="input-group">
                <div className="radio-grid">
                    {options.map(option => (
                        <button
                            key={option}
                            type="button"
                            className={`radio-item ${value === option ? 'radio-selected' : ''}`}
                            onClick={() => setFormData({ ...formData, [fieldName]: option })}
                        >
                            <div className="radio-dot">
                                {value === option && <div className="radio-dot-fill" />}
                            </div>
                            <span>{option}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleEmailChange = (e) => {
        const email = e.target.value;
        setFormData({ ...formData, workEmail: email });
        if (email && !validateEmail(email)) {
            setEmailError('Please enter a valid work email address');
        } else {
            setEmailError('');
        }
    };

    const handleInputFocus = (fieldName) => {
        setFocusedField(fieldName);
    };

    const handleInputBlur = () => {
        setFocusedField(null);
    };

    const jobTitleOptions = ["Founder", "CEO", "Manager", "Executive", "Operations Manager", "Director", "IT Manager", "Other"];
    const companySizeOptions = ["1–10", "11–50", "51–100", "101–250", "251–500", "500+"];
    const industryOptions = ["IT & Software", "Education", "Healthcare", "Construction", "Manufacturing", "Retail", "Finance", "Logistics", "Real Estate", "Other"];
    const primaryGoalOptions = ["Printing", "Packing", "Advertising", "Other"];

    return (
        <div className="split-layout-form">
            <div className="form-container-left">
                <div className="form-card">
                    <h2 className="step-title">Let&apos;s Get to Know You</h2>
                    <p className="form-subtitle">Please share a few details so we can personalize your demo.</p>

                    <div className="section-label">Personal Information</div>
                    <div className="row2">
                        <div className="input-group">
                            <label>First Name <span className="required-star">*</span></label>
                            <input 
                                type="text" 
                                placeholder={focusedField === 'Fname' ? '' : "First Name"}
                                value={formData.Fname || ''} 
                                className="neu-input" 
                                onChange={(e) => setFormData({ ...formData, Fname: e.target.value })}
                                onFocus={() => handleInputFocus('Fname')}
                                onBlur={handleInputBlur}
                                required 
                            />
                        </div>
                        <div className="input-group">
                            <label>Last Name <span className="required-star">*</span></label>
                            <input 
                                type="text" 
                                placeholder={focusedField === 'Lname' ? '' : "Last Name"}
                                value={formData.Lname || ''} 
                                className="neu-input" 
                                onChange={(e) => setFormData({ ...formData, Lname: e.target.value })}
                                onFocus={() => handleInputFocus('Lname')}
                                onBlur={handleInputBlur}
                                required 
                            />
                        </div>
                    </div>

                    <div className="row2">
                        <div className="input-group">
                            <label>Work Email <span className="required-star">*</span></label>
                            <input 
                                type="email" 
                                placeholder={focusedField === 'workEmail' ? '' : "email@company.com"}
                                value={formData.workEmail || ''} 
                                className={`neu-input ${emailError ? 'error-input' : ''}`} 
                                onChange={handleEmailChange}
                                onFocus={() => handleInputFocus('workEmail')}
                                onBlur={handleInputBlur}
                                required 
                            />
                            {emailError && <span className="error-msg">{emailError}</span>}
                        </div>
                        <div className="input-group">
                            <label>Phone Number <span className="required-star">*</span></label>
                            <input 
                                type="tel" 
                                inputMode="numeric" 
                                placeholder={focusedField === 'phone' ? '' : "03xxxxxxxxx"}
                                value={formData.phone || ''} 
                                className="neu-input" 
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^[0-9+\- ]*$/.test(val) || val === "") {
                                        setFormData({ ...formData, phone: val });
                                    }
                                }}
                                onFocus={() => handleInputFocus('phone')}
                                onBlur={handleInputBlur}
                                required 
                            />
                        </div>
                    </div>

                    <div className="section-label">Company Information (Optional)</div>
                    <div className="row2">
                        <div className="input-group">
                            <label>Company Name</label>
                            <input 
                                type="text" 
                                placeholder={focusedField === 'companyName' ? '' : "Company"}
                                value={formData.companyName || ''} 
                                className="neu-input" 
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                onFocus={() => handleInputFocus('companyName')}
                                onBlur={handleInputBlur}
                            />
                        </div>
                        <CustomSelect 
                            label="Designation" 
                            value={formData.jobTitle} 
                            fieldName="jobTitle" 
                            placeholder="Select Designation" 
                            options={jobTitleOptions} 
                            required={false} 
                        />
                    </div>

                    <div className="row2">
                        <CustomSelect 
                            label="Company Size" 
                            value={formData.companySize} 
                            fieldName="companySize" 
                            placeholder="Select Company Size" 
                            options={companySizeOptions} 
                            required={false} 
                        />
                        <CustomSelect 
                            label="Industry" 
                            value={formData.industry} 
                            fieldName="industry" 
                            placeholder="Select Industry" 
                            options={industryOptions} 
                            required={false} 
                        />
                    </div>

                    <div className="section-label">Business Needs</div>
                    {/* <RadioGroup 
                        label="Primary Goal" 
                        options={primaryGoalOptions} 
                        fieldName="primaryGoal" 
                        required={false} 
                    /> */}

                    <div className="input-group">
                        <label>Tell us about your requirements</label>
                        <textarea
                            rows="3"
                            placeholder={focusedField === 'notes' ? '' : "Describe your challenges or what you'd like to see during the demo..."}
                            value={formData.notes || ''}
                            className="neu-input"
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            onFocus={() => handleInputFocus('notes')}
                            onBlur={handleInputBlur}
                        ></textarea>
                    </div>
                </div>
            </div>

            <div className="summary-container-right">
                <h3 className="side-label">Selected Date & Time</h3>

                <div className="selection-info">
                    <div className="info-row">
                        <div className="info-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                        </div>
                        <div className="info-text">
                            <span>Date</span>
                            <p>{selectedDate?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) || 'Not selected'}</p>
                        </div>
                    </div>

                    <div className="info-row">
                        <div className="info-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                        <div className="info-text">
                            <span>Time Slot</span>
                            <p>{selectedTime || 'Not selected'}</p>
                        </div>
                    </div>

                    <div className="info-row">
                        <div className="info-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                <line x1="8" y1="21" x2="16" y2="21"></line>
                                <line x1="12" y1="17" x2="12" y2="21"></line>
                            </svg>
                        </div>
                        <div className="info-text">
                            <span>Meeting Method</span>
                            <p>
                                {selectedMedium === 'onsite' ? 'Onsite'
                                    : selectedPlatform === 'google_meet' ? 'Google Meet'
                                    : selectedPlatform === 'zoom' ? 'Zoom'
                                    : selectedPlatform === 'ms_teams' ? 'Microsoft Teams'
                                    : 'Not selected'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="selection-note">
                    <div className="note-content">
                        <IoIosInformationCircle className="note-icon" />
                        <span>Our representative will contact you shortly before your scheduled demo.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormStep;