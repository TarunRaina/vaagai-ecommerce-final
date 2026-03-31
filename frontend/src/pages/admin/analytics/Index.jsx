import { useEffect, useState } from "react";
import api from "../../../api/axios";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell
} from "recharts";
import { TrendingUp, Users, ShoppingBag, IndianRupee, AlertTriangle, Star, CheckCircle, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const AnalyticsDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    const [dayOffset, setDayOffset] = useState(0);
    const [dailyData, setDailyData] = useState([]);
    const [dailyLoading, setDailyLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get("/analytics/overview/");
                setData(res.data.data);
            } catch (err) {
                console.error("Failed to load analytics data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    useEffect(() => {
        fetchDailyTrends();
    }, [dayOffset]);

    const fetchDailyTrends = async () => {
        try {
            setDailyLoading(true);
            const res = await api.get(`/analytics/daily-trends/?days=14&offset=${dayOffset}`);
            setDailyData(res.data.data);
        } catch (err) {
            console.error("Daily trends failed", err);
        } finally {
            setDailyLoading(false);
        }
    };

    const handleScroll = (dir) => {
        if (dir === 'left') setDayOffset(prev => prev + 14);
        else if (dir === 'right') setDayOffset(prev => Math.max(0, prev - 14));
    };

    const handleExportReport = async () => {
        setGenerating(true);
        try {
            const response = await api.get("/analytics/export-report/", {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Vaagai_Executive_Intelligence_Report.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error("Report generation failed", err);
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px', flexFlow: 'column', alignItems: 'center' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid var(--border-cohesive)', borderTopColor: 'var(--primary)', borderRadius: '50%', marginBottom: '20px' }} />
            <div style={{ color: '#999', fontSize: '0.9rem', fontWeight: '600' }}>Synthesizing Intelligence...</div>
        </div>
    );

    if (!data) return <div style={{ color: '#DC2626', padding: '40px', fontSize: '0.95rem' }}>Strategic engine offline. Failed to retrieve data.</div>;

    const COLORS = ['#D4AF37', '#B8860B', '#F5DEB3', '#D2B48C', '#DEB887'];

    // Process segment data for Pie
    const pieData = [
        { name: 'B2B Revenue', value: data.revenue_split.b2b },
        { name: 'B2C Revenue', value: data.revenue_split.b2c },
    ];

    const cardStyle = {
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-cohesive)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '110px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
        transition: 'transform 0.3s ease'
    };

    const panelStyle = {
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-cohesive)',
        borderRadius: '20px',
        padding: '35px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
    };

    return (
        <div className="animate-fade" style={{ paddingBottom: '60px' }}>
            {/* Header Intelligence */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ width: '12px', height: '2px', background: 'var(--primary)' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--primary)' }}>Executive Dashboard</span>
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, color: '#1A1A1A', letterSpacing: '-1.5px' }}>Business Intelligence</h2>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                        onClick={handleExportReport}
                        disabled={generating}
                        style={{
                            padding: '14px 28px',
                            background: '#FFF',
                            border: '1.5px solid var(--border-cohesive)',
                            borderRadius: '14px',
                            fontSize: '0.85rem',
                            fontWeight: '800',
                            color: 'var(--text-main)',
                            cursor: generating ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-cohesive)'}
                    >
                        <IndianRupee size={16} />
                        {generating ? 'Finalizing...' : 'Intelligence Report'}
                    </button>
                    <div style={{
                        padding: '12px 24px',
                        borderRadius: '100px',
                        background: 'rgba(22,163,74,0.05)',
                        color: '#16A34A',
                        fontSize: '0.8rem',
                        fontWeight: '800',
                        border: '1px solid rgba(22,163,74,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A', display: 'inline-block', boxShadow: '0 0 10px #16A34A' }} />
                        Real-time Sync
                    </div>
                </div>
            </div>

            {/* KPI High-Density Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '900', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Net Revenue</span>
                        <div style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(184,134,11,0.05)', color: 'var(--primary)', fontSize: '0.65rem', fontWeight: '900' }}>+12%</div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '900', color: '#1A1A1A' }}>₹{data.kpis.total_revenue.toLocaleString()}</div>
                </div>
                <div style={cardStyle}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '900', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Order Volume</span>
                    <div style={{ fontSize: '2rem', fontWeight: '900', color: '#1A1A1A' }}>{data.kpis.paid_orders}</div>
                </div>
                <div style={cardStyle}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '900', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Avg Order Value</span>
                    <div style={{ fontSize: '2rem', fontWeight: '900', color: '#1A1A1A' }}>₹{Math.round(data.kpis.avg_order_value).toLocaleString()}</div>
                </div>
                <div style={cardStyle}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '900', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Clients</span>
                    <div style={{ fontSize: '2rem', fontWeight: '900', color: '#1A1A1A' }}>{data.kpis.total_customers}</div>
                </div>
            </div>

            {/* Daily Revenue Precision */}
            <div style={{ ...panelStyle, marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-0.5px' }}>Revenue Precision</h3>
                        <p style={{ color: '#999', fontSize: '0.85rem', margin: '4px 0 0' }}>Daily commercial throughput (14-day window)</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                            onClick={() => handleScroll('left')}
                            style={{ 
                                padding: '8px', 
                                border: '1px solid var(--border-cohesive)', 
                                borderRadius: '10px', 
                                background: '#fff', 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button 
                            onClick={() => handleScroll('right')}
                            disabled={dayOffset === 0}
                            style={{ 
                                padding: '8px', 
                                border: '1px solid var(--border-cohesive)', 
                                borderRadius: '10px', 
                                background: '#fff', 
                                cursor: dayOffset === 0 ? 'not-allowed' : 'pointer', 
                                opacity: dayOffset === 0 ? 0.4 : 1,
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
                <div style={{ width: '100%', height: '320px', position: 'relative' }}>
                    {dailyLoading && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.5)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                             <div className="spinner" style={{ width: '24px', height: '24px', border: '2px solid transparent', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        </div>
                    )}
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dailyData}>
                            <defs>
                                <linearGradient id="dailyFlow" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.12} />
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="rgba(0,0,0,0.03)" />
                            <XAxis 
                                dataKey="display" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#999', fontSize: 10, fontWeight: '700' }}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#999', fontSize: 10, fontWeight: '700' }}
                                tickFormatter={(val) => `₹${val >= 1000 ? val/1000 + 'k' : val}`}
                                dx={-10}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    borderRadius: '16px', 
                                    border: '1px solid var(--border-cohesive)', 
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                    padding: '12px 16px'
                                }}
                                itemStyle={{ color: 'var(--primary)', fontWeight: '900' }}
                                labelStyle={{ color: '#999', fontWeight: '800', fontSize: '0.75rem', marginBottom: '4px' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="var(--primary)" 
                                strokeWidth={3} 
                                fill="url(#dailyFlow)"
                                animationDuration={800}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Strategic Visualization Layer */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '30px', marginBottom: '30px' }}>
                {/* Revenue Momentum Area Chart */}
                <div style={panelStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-0.5px' }}>Growth Trajectory</h3>
                            <p style={{ color: '#999', fontSize: '0.85rem', margin: '4px 0 0' }}>Revenue trends over the last 6 fiscal months</p>
                        </div>
                        <TrendingUp color="var(--primary)" size={24} strokeWidth={2.5} />
                    </div>
                    <div style={{ width: '100%', height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.trends}>
                                <defs>
                                    <linearGradient id="revenueFlow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="rgba(0,0,0,0.03)" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#999', fontSize: 11, fontWeight: '700' }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#999', fontSize: 11, fontWeight: '700' }}
                                    tickFormatter={(val) => `₹${val >= 1000 ? val / 1000 + 'k' : val}`}
                                    dx={-10}
                                />
                                <Tooltip
                                    cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    contentStyle={{
                                        background: '#FFF',
                                        border: '1px solid var(--border-cohesive)',
                                        borderRadius: '16px',
                                        padding: '15px 20px',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
                                    }}
                                    itemStyle={{ color: 'var(--primary)', fontWeight: '900', fontSize: '1.1rem' }}
                                    labelStyle={{ fontWeight: '800', color: '#999', marginBottom: '5px', textTransform: 'uppercase', fontSize: '0.7rem' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="var(--primary)"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#revenueFlow)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Regional Market Share integrated into Grid 1 */}
                <div style={panelStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                        <MapPin size={20} color="var(--primary)" />
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900' }}>Regional Market Share</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {data.geography_performance && data.geography_performance.length > 0 ? (
                            data.geography_performance.slice(0, 4).map((region, idx) => (
                                <div key={idx} style={{ padding: '12px 15px', background: 'var(--bg-surface-elevated)', borderRadius: '12px', border: '1px solid var(--border-cohesive)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <span style={{ fontWeight: '800', fontSize: '0.8rem' }}>{region.name}</span>
                                        <span style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '0.8rem' }}>₹{region.revenue.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <div style={{ flex: 1, height: '3px', background: 'rgba(0,0,0,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                            <div style={{ 
                                                width: `${(region.revenue / data.kpis.total_revenue) * 100}%`, 
                                                height: '100%', 
                                                background: 'var(--primary)',
                                                borderRadius: '2px'
                                            }} />
                                        </div>
                                        <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#999' }}>{region.orders}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ color: '#999', fontSize: '0.85rem', textAlign: 'center', padding: '40px 0' }}>Analyzing...</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Strategic Row 2: Category & Segmentation */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '30px', marginBottom: '30px' }}>
                {/* Category Intelligence */}
                <div style={panelStyle}>
                    <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-0.5px' }}>Category Intelligence</h3>
                        <p style={{ color: '#999', fontSize: '0.85rem', margin: '4px 0 0' }}>Revenue distribution by asset class</p>
                    </div>
                    {data.category_performance.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {data.category_performance.map((item, idx) => (
                                <div key={idx}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', fontWeight: '800' }}>
                                        <span>{item.name}</span>
                                        <span style={{ color: 'var(--primary)' }}>₹{item.revenue.toLocaleString()}</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-surface-elevated)', borderRadius: '10px', overflow: 'hidden' }}>
                                        <div
                                            style={{
                                                width: `${(item.revenue / data.kpis.total_revenue) * 100}%`,
                                                height: '100%',
                                                background: 'var(--primary)',
                                                borderRadius: '10px',
                                                transition: 'width 1s ease'
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <div style={{ opacity: 0.1, fontSize: '4rem' }}>📊</div>
                            <div style={{ color: '#999', fontSize: '0.85rem' }}>Awaiting initial sales data</div>
                        </div>
                    )}
                </div>

                {/* Revenue Segmentation Donut */}
                <div style={panelStyle}>
                    <h3 style={{ marginBottom: '30px', fontSize: '1.1rem', fontWeight: '900' }}>Segment Power</h3>
                    <div style={{ height: '200px', width: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={65}
                                    outerRadius={85}
                                    paddingAngle={10}
                                    dataKey="value"
                                    animationDuration={1500}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ position: 'absolute', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.65rem', color: '#999', fontWeight: '900', textTransform: 'uppercase' }}>Channel</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '900' }}>B2B vs B2C</div>
                        </div>
                    </div>
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        {pieData.map((d, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[i] }} />
                                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#666' }}>{d.name.split(' ')[0]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Operational Metrics Row 3 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '30px' }}>
                {/* Top Products Simplified List */}
                <div style={panelStyle}>
                    <h3 style={{ marginBottom: '30px', fontSize: '1.25rem', fontWeight: '900' }}>Elite Assets</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {data.top_products.map((p, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--bg-surface-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '900', color: 'var(--primary)' }}>
                                    {idx + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1A1A1A' }}>{p.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#999', fontWeight: '600' }}>{p.sales} orders</div>
                                </div>
                                <div style={{ fontSize: '0.85rem', fontWeight: '900', color: 'var(--primary)' }}>₹{p.revenue.toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Operational Health Panels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ ...panelStyle, padding: '24px', flex: 1, display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(74,222,128,0.1)', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>{data.appointment_health.approved}</div>
                            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Showroom Success</div>
                        </div>
                    </div>
                    <div style={{ ...panelStyle, padding: '24px', flex: 1, display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>{data.kpis.low_stock_count}</div>
                            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Inventory Alerts</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;



