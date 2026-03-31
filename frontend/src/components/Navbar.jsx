import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import Icon from "./Icons";

const Navbar = () => {
  const { isAuthenticated, logout, token } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [unseenCount, setUnseenCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchCounts = async () => {
        try {
          const [appointmentRes, cartRes] = await Promise.all([
            api.get("/appointments/unseen-count/"),
            api.get("/products/cart/")
          ]);
          setUnseenCount(appointmentRes.data.unseen_count);
          setCartCount(cartRes.data.total_items || 0);
        } catch (err) {
          console.error("Error fetching counts", err);
        }
      };
      fetchCounts();
      const interval = setInterval(fetchCounts, 15000); // Poll every 15s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/customer/dashboard?search=${search}`);
  };

  const navStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: isScrolled ? "10px 6%" : "16px 6%", // Much slimmer
    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    background: isScrolled
      ? 'rgba(249, 245, 238, 1)'
      : 'rgba(249, 245, 238, 0.96)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    borderBottom: '1px solid var(--border-cohesive)', // Thinner, more elegant border
    boxShadow: isScrolled
      ? '0 6px 25px rgba(0,0,0,0.05)'
      : '0 2px 10px rgba(0,0,0,0.02)', // Softer shadow
    boxSizing: 'border-box'
  };

  const linkStyle = {
    color: 'var(--text-main)',
    textDecoration: 'none',
    fontSize: '0.84rem',
    fontWeight: '800',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    transition: 'all 0.3s ease',
    opacity: 0.95, // Higher visibility
    position: 'relative',
  };

  return (
    <nav style={navStyle}>
      {/* Brand Logo Section */}
      <div
        style={{
          fontSize: '1.6rem',
          fontWeight: '900',
          letterSpacing: '3px',
          cursor: 'pointer',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onClick={() => navigate('/')}
      >
        <span style={{ opacity: 0.8, display: 'flex', alignItems: 'center' }}>
            <Icon name="sparkle" size={24} color="var(--primary)" />
        </span>
        VAAGAI
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
        {/* Search & Main Links */}
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <form onSubmit={handleSearch} style={{ position: "relative", display: 'flex', alignItems: 'center' }}>
            <span style={{
              position: "absolute",
              left: "14px",
              display: 'flex',
              alignItems: 'center',
              pointerEvents: "none",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search collections..."
              style={{
                width: isScrolled ? '200px' : '280px',
                padding: '10px 15px 10px 40px',
                borderRadius: '12px',
                background: '#FFF',
                border: '1.5px solid var(--border-cohesive)',
                color: 'var(--text-main)',
                fontSize: '0.82rem',
                fontWeight: '600',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.01)',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--primary)';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(184,134,11,0.05)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'var(--border-cohesive)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <Link to="/customer/dashboard" style={linkStyle}>
            Collections
            <div style={{
              position: 'absolute',
              bottom: '-4px',
              left: 0,
              width: activeStyle => activeStyle ? '100%' : '0', // Manual trigger in dashboard check
              height: '1px',
              background: 'var(--primary)',
              transition: 'width 0.3s ease'
            }} />
          </Link>
        </div>

        {/* User Actions */}
        <div style={{ display: "flex", gap: "30px", alignItems: 'center' }}>
          {!isAuthenticated ? (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-main)',
                  fontWeight: '800',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  fontSize: '0.78rem',
                  letterSpacing: '1px',
                  opacity: 0.8,
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.8}
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
              <button
                style={{
                  padding: '12px 28px',
                  borderRadius: '14px',
                  fontSize: '0.8rem',
                  fontWeight: '900',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  background: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(184,134,11,0.2)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(184,134,11,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(184,134,11,0.2)';
                }}
                onClick={() => navigate("/register")}
              >
                Join Us
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
              <Link to="/customer/orders" style={linkStyle}>Orders</Link>
              <Link to="/customer/wishlist" style={linkStyle}>Saved</Link>
              <Link to="/customer/appointments" style={linkStyle}>
                Booking
                {unseenCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-8px',
                    width: '6px',
                    height: '6px',
                    backgroundColor: 'var(--primary)',
                    borderRadius: '50%',
                  }} />
                )}
              </Link>
              <Link to="/customer/cart" style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Icon name="cart" size={20} color="var(--text-main)" />
                  {cartCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      background: 'var(--primary)',
                      color: 'white',
                      fontSize: '0.65rem',
                      fontWeight: '900',
                      minWidth: '15px',
                      height: '15px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '2px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                      border: '1.5px solid var(--bg-surface)'
                    }}>
                      {cartCount}
                    </span>
                  )}
                </span>
                Cart
              </Link>
              <div
                onClick={() => navigate("/customer/profile")}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '2px solid var(--border-cohesive)',
                  padding: '2px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-cohesive)'}
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#EF4444',
                  fontWeight: '800',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  fontSize: '0.78rem',
                  letterSpacing: '1px',
                  opacity: 0.8
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.8}
                onClick={handleLogout}
              >
                Exit
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
