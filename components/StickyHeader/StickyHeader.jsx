// components/StickyHeader/StickyHeader.jsx
'use client'
import { useState } from 'react'
import gsap from 'gsap'
import './StickyHeader.css'

function StickyHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  const menuItems = [
    'Home',
    'About',
    'Capabilities',
    'Industries',
    'Quality',
    'Facilities'
  ]

  const openMenu = () => {
    setMenuOpen(true)
    gsap.fromTo('.sidebar-menu', 
      { x: '-100%', opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
    )
  }

  const closeMenu = () => {
    gsap.to('.sidebar-menu', {
      x: '-100%',
      opacity: 0,
      duration: 0.4,
      ease: 'power3.in',
      onComplete: () => setMenuOpen(false)
    })
  }

  return (
    <>
      <header className="sticky-header">
        <div className="header-logo">
          <img src="/images/forgentis_icon.webp" alt="Logo" />
        </div>

        <div className="header-right">
          <button className="header-btn">GET IN TOUCH</button>
          <button 
            className={`hamburger ${menuOpen ? 'active' : ''}`}
            onClick={menuOpen ? closeMenu : openMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Sidebar Menu */}
      {menuOpen && (
        <div className="sidebar-menu">
          <button className="sidebar-close" onClick={closeMenu}>×</button>
          <nav className="sidebar-nav">
            {menuItems.map((item, index) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className={`sidebar-link ${activeSection === item.toLowerCase() ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  closeMenu()
                  // Section change logic yahan add karein
                }}
              >
                <span className="sidebar-number">0{index + 1}</span>
                {item}
              </a>
            ))}
          </nav>

          <div className="sidebar-footer">
            <p>© 2024 Forgentis</p>
            <div className="sidebar-socials">
              <a href="#">Instagram</a>
              <a href="#">LinkedIn</a>
              <a href="#">Twitter</a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default StickyHeader