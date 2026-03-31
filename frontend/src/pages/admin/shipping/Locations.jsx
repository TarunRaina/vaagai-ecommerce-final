import { useState, useEffect } from "react";
import api from "../../../api/axios";
import Icon from "../../../components/Icons";

const ShippingLocations = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/shipping-states/");
      setStates(res.data);
    } catch (err) {
      console.error("Failed to fetch shipping states", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleState = async (id, currentStatus) => {
    try {
      await api.patch(`/orders/admin/shipping-states/${id}/`, { is_active: !currentStatus });
      setStates(states.map(s => s.id === id ? { ...s, is_active: !currentStatus } : s));
      setMessage("Shipping configuration updated!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const glassStyle = {
    background: 'var(--bg-surface)',
    padding: '36px',
    borderRadius: '24px',
    border: '1px solid var(--border-cohesive)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
  };

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>Shipping Locations</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.9rem' }}>Enable or disable delivery regions in India</p>
      </div>

      <div style={glassStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ width: '5px', height: '22px', background: 'var(--primary)', borderRadius: '3px' }}></div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>Active Delivery States</h3>
        </div>

        {message && (
          <div style={{ 
            background: 'rgba(22,163,74,0.08)', 
            color: '#16a34a', 
            padding: '12px 20px', 
            borderRadius: '12px', 
            marginBottom: '28px',
            fontSize: '0.85rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Icon name="check" size={16} /> {message}
          </div>
        )}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '20px' 
        }}>
          {loading ? (
             <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
                Fetching geography data...
             </div>
          ) : states.map(state => (
            <div 
              key={state.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                background: state.is_active ? 'rgba(184,134,11,0.03)' : 'var(--bg-main)',
                border: `1.5px solid ${state.is_active ? 'var(--primary-muted)' : 'var(--border-strong)'}`,
                borderRadius: '16px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <div style={{ 
                   width: '10px', 
                   height: '10px', 
                   background: state.is_active ? '#4ade80' : '#888', 
                   borderRadius: '50%',
                   boxShadow: state.is_active ? '0 0 8px rgba(74, 222, 128, 0.4)' : 'none'
                 }}></div>
                 <span style={{ 
                   fontSize: '0.95rem', 
                   fontWeight: '700', 
                   color: state.is_active ? 'var(--text-main)' : 'var(--text-dim)' 
                 }}>{state.name}</span>
              </div>

              <div 
                onClick={() => toggleState(state.id, state.is_active)}
                style={{
                  width: '44px',
                  height: '24px',
                  background: state.is_active ? 'var(--primary)' : '#ddd',
                  borderRadius: '12px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease'
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  background: '#fff',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '3px',
                  left: state.is_active ? '23px' : '3px',
                  transition: 'left 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShippingLocations;
