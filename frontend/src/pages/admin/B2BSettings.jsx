import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import Icon from "../../components/Icons";

const B2BSettings = () => {
    const { token } = useAuth();
    const [settings, setSettings] = useState({
        base_discount_percent: 10,
        bulk_threshold: 10,
        bulk_discount_percent: 18
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get("/b2b/admin/settings/", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSettings(res.data);
        } catch (err) {
            console.error("Failed to fetch B2B settings");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.patch("/b2b/admin/settings/", settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsError(false);
            setMessage("Settings saved successfully.");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setIsError(true);
            setMessage("Failed to save settings.");
        }
    };

    if (loading) return (
        <div style={{ padding: '60px', color: '#999', fontSize: '0.95rem' }}>Loading settings...</div>
    );

    const labelStyle = {
        display: 'block',
        fontSize: '0.72rem',
        fontWeight: '700',
        color: '#888',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    };

    const cardStyle = {
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-cohesive)',
        borderRadius: '14px',
        padding: '28px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
    };

    return (
        <div className="animate-fade">
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: '#1A1A1A' }}>B2B Settings</h2>
                <p style={{ color: '#999', marginTop: '4px', fontSize: '0.88rem' }}>Configure pricing rules for verified business partners</p>
            </div>

            {/* Summary stat row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
                {[
                    {
                        label: 'Partner Discount',
                        value: `${settings.base_discount_percent}%`,
                        sub: 'Applied to all B2B accounts',
                        icon: 'dollar',
                        color: '#16A34A',
                        tint: 'rgba(22,163,74,0.08)'
                    },
                    {
                        label: 'Bulk Threshold',
                        value: `${settings.bulk_threshold} units`,
                        sub: 'Per product to trigger bulk rate',
                        icon: 'package',
                        color: '#2563EB',
                        tint: 'rgba(37,99,235,0.08)'
                    },
                    {
                        label: 'Bulk Discount',
                        value: `${settings.bulk_discount_percent}%`,
                        sub: 'Overrides base when threshold met',
                        icon: 'analytics',
                        color: 'var(--primary)',
                        tint: 'rgba(184,134,11,0.08)'
                    }
                ].map((s, i) => (
                    <div key={i} style={{
                        ...cardStyle,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <div style={{
                            width: '46px', height: '46px',
                            borderRadius: '10px',
                            background: s.tint,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <Icon name={s.icon} size={20} color={s.color} strokeWidth={1.8} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.72rem', color: '#AAA', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px' }}>{s.label}</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1A1A1A', lineHeight: 1 }}>{s.value}</div>
                            <div style={{ fontSize: '0.72rem', color: '#BBB', marginTop: '3px' }}>{s.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Two-column form layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

                {/* Left: Base settings */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                        <div style={{ width: '4px', height: '18px', background: '#16A34A', borderRadius: '2px' }} />
                        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: '#1A1A1A' }}>Standard Partner Rate</h3>
                    </div>
                    <label style={labelStyle}>Discount Percentage (%)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={settings.base_discount_percent}
                        onChange={e => setSettings({ ...settings, base_discount_percent: e.target.value })}
                    />
                    <p style={{ fontSize: '0.78rem', color: '#BBB', marginTop: '10px', marginBottom: 0 }}>
                        Applied to all verified B2B accounts on every order.
                    </p>
                </div>

                {/* Right: Bulk threshold */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                        <div style={{ width: '4px', height: '18px', background: '#2563EB', borderRadius: '2px' }} />
                        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: '#1A1A1A' }}>Bulk Order Threshold</h3>
                    </div>
                    <label style={labelStyle}>Minimum Units per Product</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                            type="number"
                            min="1"
                            value={settings.bulk_threshold}
                            onChange={e => setSettings({ ...settings, bulk_threshold: e.target.value })}
                            style={{ width: '130px' }}
                        />
                        <span style={{ fontWeight: '600', color: '#999', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>units per product</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#BBB', marginTop: '10px', marginBottom: 0 }}>
                        When a customer orders at or above this quantity for a single product, the bulk discount applies instead.
                    </p>
                </div>
            </div>

            {/* Bulk Discount — full width, gold highlight */}
            <div style={{
                ...cardStyle,
                borderColor: 'rgba(184,134,11,0.3)',
                background: 'rgba(253,248,238,0.8)',
                marginBottom: '24px'
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <div style={{ width: '4px', height: '18px', background: 'var(--primary)', borderRadius: '2px' }} />
                            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: '#1A1A1A' }}>Bulk Discount Rate</h3>
                            <span style={{
                                background: 'rgba(184,134,11,0.12)',
                                color: 'var(--primary)',
                                fontSize: '0.65rem',
                                fontWeight: '800',
                                padding: '2px 8px',
                                borderRadius: '100px',
                                border: '1px solid rgba(184,134,11,0.25)',
                                letterSpacing: '0.5px'
                            }}>OVERRIDES BASE</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px', alignItems: 'start' }}>
                            <div>
                                <label style={labelStyle}>Bulk Discount (%)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={settings.bulk_discount_percent}
                                    onChange={e => setSettings({ ...settings, bulk_discount_percent: e.target.value })}
                                />
                            </div>
                            <div style={{
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--border-cohesive)',
                                borderRadius: '10px',
                                padding: '16px',
                                fontSize: '0.82rem',
                                color: '#666',
                                lineHeight: 1.6
                            }}>
                                <div style={{ fontWeight: '700', color: '#444', marginBottom: '4px', fontSize: '0.85rem' }}>How this works</div>
                                When a B2B customer orders <strong>{settings.bulk_threshold}+ units</strong> of a single product,
                                this <strong>{settings.bulk_discount_percent}%</strong> discount applies instead of the standard <strong>{settings.base_discount_percent}%</strong>.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                    onClick={handleUpdate}
                    className="btn-primary"
                    style={{ padding: '12px 28px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '700' }}
                >
                    Save Settings
                </button>
                {message && (
                    <div className="animate-fade" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: isError ? '#DC2626' : '#16A34A',
                        fontWeight: '700',
                        fontSize: '0.88rem',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        background: isError ? 'rgba(220,38,38,0.08)' : 'rgba(22,163,74,0.08)',
                        border: `1px solid ${isError ? 'rgba(220,38,38,0.2)' : 'rgba(22,163,74,0.2)'}`
                    }}>
                        <Icon name={isError ? 'alert' : 'check'} size={16} color={isError ? '#DC2626' : '#16A34A'} /> {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default B2BSettings;



