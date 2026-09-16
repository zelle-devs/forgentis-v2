import { Pencil } from 'lucide-react';
import React from 'react';
import { IoIosInformationCircle } from 'react-icons/io';
import './ReviewStep.css';

const ReviewStep = ({ formData, selectedDate, selectedTime, onEditDate, onEditForm, selectedPlatform }) => {
    return (
        <div className="main">
        <div className="review-single-card">
            <div className="review-left-content">
                <div className="section-header-with-edit">
                    <h2 className="step-title">
                        Review Your Consultation Request
                        <button 
                            className="edit-icon-inline" 
                            onClick={onEditForm}
                            title="Edit Information"
                        >
                            <Pencil size={18} className="edit-icon-small" />
                        </button>
                    </h2>
                </div>

                <div className="section-label">Personal Information</div>
                <div className="review-grid">
                    <div className="review-item-wrapper">
                        <span>Full Name</span>
                        <div className="review-item">
                            <p>{formData.Fname} {formData.Lname}</p>
                        </div>
                    </div>
                    <div className="review-item-wrapper">
                        <span>Work Email</span>
                        <div className="review-item">
                            <p>{formData.workEmail || '—'}</p>
                        </div>
                    </div>
                    <div className="review-item-wrapper">
                        <span>Phone Number</span>
                        <div className="review-item">
                            <p>{formData.phone || '—'}</p>
                        </div>
                    </div>
                </div>

                {/* Company Information - Only show if filled (Optional) */}
                {(formData.companyName || formData.jobTitle || formData.companySize || formData.industry) && (
                    <>
                        <div className="section-label">Company Information <span style={{ color: '#999', fontSize: '10px', textTransform: 'none', letterSpacing: '0' }}>(Optional)</span></div>
                        <div className="review-grid">
                            {formData.companyName && (
                                <div className="review-item-wrapper">
                                    <span>Company Name</span>
                                    <div className="review-item">
                                        <p>{formData.companyName}</p>
                                    </div>
                                </div>
                            )}
                            {formData.jobTitle && (
                                <div className="review-item-wrapper">
                                    <span>Designation</span>
                                    <div className="review-item">
                                        <p>{formData.jobTitle}</p>
                                    </div>
                                </div>
                            )}
                            {formData.companySize && (
                                <div className="review-item-wrapper">
                                    <span>Company Size</span>
                                    <div className="review-item">
                                        <p>{formData.companySize}</p>
                                    </div>
                                </div>
                            )}
                            {formData.industry && (
                                <div className="review-item-wrapper">
                                    <span>Industry</span>
                                    <div className="review-item">
                                        <p>{formData.industry}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Business Needs - Only Primary Goal */}
                {formData.primaryGoal && (
                    <>
                        <div className="section-label">Business Needs</div>
                        <div className="review-grid">
                            <div className="review-item-wrapper">
                                <span>Primary Goal</span>
                                <div className="review-item">
                                    <p>{formData.primaryGoal}</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {formData.notes && (
                    <>
                        <div className="section-label">Additional Requirements</div>
                        <div className="review-grid">
                            <div className="review-item-wrapper full-width">
                                <span>Your Requirements</span>
                                <div className="review-item">
                                    <p>{formData.notes}</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="vertical-divider-container">
                <div className="vertical-line"></div>
            </div>

            <div className="review-right-content">
                <div className="section-header-with-edit">
                    <h3 className="side-label">
                        Selected Date & Time
                        <button 
                            className="edit-icon-inline" 
                            onClick={onEditDate}
                            title="Edit Date & Time"
                        >
                            <Pencil size={18} className="edit-icon-small" />
                        </button>
                    </h3>
                </div>

                <div className="selection-info">
                    <div className="info-row">
                        <div className="info-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                <line x1="8" y1="21" x2="16" y2="21"></line>
                                <line x1="12" y1="17" x2="12" y2="21"></line>
                            </svg>
                        </div>
                        <div className="info-text">
                            <span>Meeting Method</span>
                            <p>
                                {selectedPlatform === 'onsite' ? 'Onsite'
                                    : selectedPlatform === 'google-meet' ? 'Google Meet'
                                    : selectedPlatform === 'zoom' ? 'Zoom'
                                    : selectedPlatform === 'teams' ? 'Microsoft Teams'
                                    : 'Not selected'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="selection-note">
                    <div className="note-content">
                        <IoIosInformationCircle className="note-icon" />
                        <span>A fabrication specialist will contact you shortly before your scheduled consultation.</span>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default ReviewStep;