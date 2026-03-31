import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            background: 'var(--bg-surface)',
            borderTop: '2px solid var(--border-strong)',
            padding: '80px 40px 40px',
            color: 'var(--text-main)',
            marginTop: '80px',
            zIndex: 10
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '60px',
                marginBottom: '60px'
            }}>
                {/* Brand Section */}
                <div>
                    <h2 style={{
                        fontSize: '1.8rem',
                        fontWeight: '900',
                        letterSpacing: '-1px',
                        margin: '0 0 20px 0',
                        color: 'var(--primary)'
                    }}>
                        VAAGAI
                    </h2>
                    <p style={{
                        color: 'var(--text-muted)',
                        lineHeight: '1.8',
                        fontSize: '0.95rem',
                        maxWidth: '300px'
                    }}>
                        Crafting premium artisanal furniture and doors for modern living spaces. Every piece is a testament to timeless quality and exceptional craftsmanship.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '30px' }}>
                        Discover More
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <li><Link to="/" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s', fontWeight: '600' }}>The Collection</Link></li>
                        <li><Link to="/customer/dashboard" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s', fontWeight: '600' }}>Bespoke Services</Link></li>
                        <li><Link to="/customer/appointments" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s', fontWeight: '600' }}>Consultation Booking</Link></li>
                        <li><Link to="/customer/profile" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s', fontWeight: '600' }}>Account Detail</Link></li>
                    </ul>
                </div>

                {/* Support/Info */}
                <div>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '30px' }}>
                        Connect
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <li style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontWeight: '600' }}>Email: <span style={{ color: 'var(--text-main)' }}>concierge@vaagai.com</span></li>
                        <li style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontWeight: '600' }}>Phone: <span style={{ color: 'var(--text-main)' }}>+91 98765 43210</span></li>
                        <li style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontWeight: '600' }}>Location: <span style={{ color: 'var(--text-main)' }}>Perundurai, Erode, Tamil Nadu</span></li>
                    </ul>
                </div>

                {/* Newsletter Prototype */}
                <div>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '30px' }}>
                        Journal
                    </h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>Subscribe for design insights and early collection access.</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            placeholder="Your email address"
                            style={{
                                background: '#fff',
                                border: '2px solid var(--border-strong)',
                                padding: '12px 15px',
                                borderRadius: '8px',
                                color: 'var(--text-main)',
                                fontSize: '0.85rem',
                                flex: 1
                            }}
                        />
                        <button className="btn-primary" style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '0.85rem' }}>
                            JOIN
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div style={{
                maxWidth: '1400px',
                margin: '80px auto 0',
                paddingTop: '30px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: '700' }}>
                    © 2026 VAAGAI FURNITURE & DOORS. ALL RIGHTS RESERVED.
                </div>
                <div style={{ display: 'flex', gap: '30px' }}>
                    <span style={{ cursor: 'pointer', color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '1px' }}>INSTAGRAM</span>
                    <span style={{ cursor: 'pointer', color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '1px' }}>PINTEREST</span>
                    <span style={{ cursor: 'pointer', color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '1px' }}>BEHANCE</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
