import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import Icon from "../../components/Icons";

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStock, setFilterStock] = useState("All");
    const [sortBy, setSortBy] = useState("Newest");
    const [expandedProduct, setExpandedProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get("/products/admin/list/");
            setProducts(res.data);
        } catch (err) {
            console.error("Failed to fetch products", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleReviews = (id) => {
        setExpandedProduct(expandedProduct === id ? null : id);
    };

    let result = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterStock !== 'All') {
        result = result.filter(p => {
            if (filterStock === 'In Stock') return p.stock >= 10;
            if (filterStock === 'Low Stock') return p.stock > 0 && p.stock < 10;
            if (filterStock === 'Out of Stock') return p.stock <= 0;
            return true;
        });
    }

    result.sort((a, b) => {
        if (sortBy === 'Newest') return b.id - a.id;
        if (sortBy === 'Oldest') return a.id - b.id;
        if (sortBy === 'Most Sold') return (b.total_sales || 0) - (a.total_sales || 0);
        if (sortBy === 'Least Sold') return (a.total_sales || 0) - (b.total_sales || 0);
        if (sortBy === 'Highest Rating') return (parseFloat(b.average_rating) || 0) - (parseFloat(a.average_rating) || 0);
        if (sortBy === 'Price: High-Low') return parseFloat(b.price || 0) - parseFloat(a.price || 0);
        if (sortBy === 'Price: Low-High') return parseFloat(a.price || 0) - parseFloat(b.price || 0);
        return 0;
    });

    const filteredProducts = result;

    const getStockStatus = (stock) => {
        if (stock <= 0) return { label: "Out of Stock", color: "#DC2626", bg: "rgba(220,38,38,0.08)", border: "rgba(220,38,38,0.2)" };
        if (stock < 10) return { label: "Low Stock", color: "#D97706", bg: "rgba(217,119,6,0.08)", border: "rgba(217,119,6,0.2)" };
        return { label: "In Stock", color: "#16A34A", bg: "rgba(22,163,74,0.08)", border: "rgba(22,163,74,0.2)" };
    };

    if (loading) return (
        <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Loading products...
        </div>
    );

    return (
        <div className="animate-fade">
            {/* Page Header */}
            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: '#1A1A1A' }}>Products</h2>
                    <p style={{ color: '#999', marginTop: '4px', fontSize: '0.88rem' }}>Manage your product catalog, reviews, and performance</p>
                </div>
                <Link
                    to="/admin/dashboard"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'var(--primary)',
                        color: '#fff',
                        padding: '10px 18px',
                        borderRadius: '10px',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        letterSpacing: '0.3px'
                    }}
                >
                    <Icon name="plus" size={16} color="#fff" strokeWidth={2.5} />
                    Add Product
                </Link>
            </div>

            {/* Search and Stats Row */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '20px',
                flexWrap: 'wrap'
            }}>
                <select
                    value={filterStock}
                    onChange={(e) => setFilterStock(e.target.value)}
                    style={{ padding: '11px 14px', background: 'var(--bg-surface)', border: '1.5px solid var(--border-cohesive)', borderRadius: '10px', fontSize: '0.85rem', width: 'auto' }}
                >
                    <option value="All">All Stock</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ padding: '11px 14px', background: 'var(--bg-surface)', border: '1.5px solid var(--border-cohesive)', borderRadius: '10px', fontSize: '0.85rem', width: 'auto' }}
                >
                    <option value="Newest">Newest First</option>
                    <option value="Oldest">Oldest First</option>
                    <option value="Most Sold">Most Sold</option>
                    <option value="Least Sold">Least Sold</option>
                    <option value="Highest Rating">Highest Rating</option>
                    <option value="Price: High-Low">Price: High to Low</option>
                    <option value="Price: Low-High">Price: Low to High</option>
                </select>

                <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                    <div style={{
                        position: 'absolute', left: '14px', top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none'
                    }}>
                        <Icon name="eye" size={17} color="#AAA" strokeWidth={1.6} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search products by name or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '11px 14px 11px 42px',
                            background: 'var(--bg-surface)',
                            border: '1.5px solid var(--border-cohesive)',
                            borderRadius: '10px',
                            color: '#1A1A1A',
                            fontSize: '0.9rem',
                        }}
                    />
                </div>
                <div style={{
                    background: 'var(--bg-surface)',
                    border: '1.5px solid var(--border-cohesive)',
                    borderRadius: '10px',
                    padding: '11px 18px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: '#555',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Icon name="products" size={16} color="var(--primary)" strokeWidth={1.8} />
                    {filteredProducts.length} Products
                </div>
            </div>

            {/* Product Table */}
            <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-cohesive)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1.5px solid var(--border-cohesive)' }}>
                            <th style={{ padding: '14px 20px', color: '#888', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px' }}>Product</th>
                            <th style={{ padding: '14px 20px', color: '#888', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px' }}>Price & Status</th>
                            <th style={{ padding: '14px 20px', color: '#888', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px' }}>Stock</th>
                            <th style={{ padding: '14px 20px', color: '#888', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px' }}>Sales & Revenue</th>
                            <th style={{ padding: '14px 20px', color: '#888', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px' }}>Rating</th>
                            <th style={{ padding: '14px 20px', color: '#888', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: '#999' }}>
                                    No products found
                                </td>
                            </tr>
                        ) : filteredProducts.map((product) => {
                            const stockStatus = getStockStatus(product.stock);
                            const isExpanded = expandedProduct === product.id;
                            return (
                                <React.Fragment key={product.id}>
                                    <tr

                                        style={{
                                            borderBottom: isExpanded ? 'none' : '1px solid #F0EAE0',
                                            background: isExpanded ? '#FBF8F3' : 'transparent',
                                            transition: 'background 0.15s'
                                        }}
                                        onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = '#FAF7F2'; }}
                                        onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        {/* Product */}
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                <div style={{
                                                    width: '52px', height: '52px',
                                                    borderRadius: '10px',
                                                    overflow: 'hidden',
                                                    background: 'var(--bg-surface-elevated)',
                                                    border: '1px solid var(--border-cohesive)',
                                                    flexShrink: 0
                                                }}>
                                                    {product.image ? (
                                                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Icon name="package" size={22} color="#BBB" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#1A1A1A', marginBottom: '3px' }}>{product.name}</div>
                                                    <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: '600' }}>{product.category?.name || "Uncategorized"}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Price & Status */}
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1A1A1A' }}>₹{parseFloat(product.price).toLocaleString()}</div>
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                marginTop: '5px',
                                                fontSize: '0.72rem',
                                                fontWeight: '700',
                                                color: product.is_active ? '#16A34A' : '#DC2626',
                                            }}>
                                                <span style={{
                                                    width: '6px', height: '6px', borderRadius: '50%',
                                                    background: product.is_active ? '#16A34A' : '#DC2626',
                                                    display: 'inline-block'
                                                }} />
                                                {product.is_active ? "Active" : "Hidden"}
                                            </div>
                                        </td>

                                        {/* Stock */}
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1A1A1A', marginBottom: '6px' }}>{product.stock}</div>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '3px 10px',
                                                borderRadius: '100px',
                                                fontSize: '0.68rem',
                                                fontWeight: '700',
                                                background: stockStatus.bg,
                                                color: stockStatus.color,
                                                border: `1px solid ${stockStatus.border}`
                                            }}>
                                                {stockStatus.label}
                                            </span>
                                        </td>

                                        {/* Sales & Revenue */}
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ display: 'flex', gap: '20px' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.68rem', color: '#AAA', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px' }}>Sales</div>
                                                    <div style={{ fontWeight: '800', color: '#1A1A1A', fontSize: '1rem' }}>{product.total_sales || 0}</div>
                                                </div>
                                                <div style={{ borderLeft: '1.5px solid #EDE6D8', paddingLeft: '20px' }}>
                                                    <div style={{ fontSize: '0.68rem', color: '#AAA', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px' }}>Revenue</div>
                                                    <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1rem' }}>₹{(product.total_revenue || 0).toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Rating */}
                                        <td style={{ padding: '16px 20px' }}>
                                            <div
                                                style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                                                onClick={() => toggleReviews(product.id)}
                                                title="Click to view reviews"
                                            >
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="#D97706" stroke="#D97706" strokeWidth="1">
                                                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                </svg>
                                                <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1A1A1A' }}>{product.average_rating || "—"}</span>
                                                <span style={{ fontSize: '0.78rem', color: '#AAA', fontWeight: '500' }}>({product.review_count})</span>
                                            </div>
                                            <div style={{ fontSize: '0.72rem', color: '#B8860B', fontWeight: '600', marginTop: '4px', cursor: 'pointer' }}
                                                onClick={() => toggleReviews(product.id)}>
                                                {isExpanded ? 'Hide reviews ↑' : 'View reviews ↓'}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <Link
                                                    to={`/admin/products/edit/${product.id}`}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: '36px',
                                                        height: '36px',
                                                        background: 'var(--bg-surface-elevated)',
                                                        border: '1px solid var(--border-cohesive)',
                                                        borderRadius: '8px',
                                                        color: '#666',
                                                        textDecoration: 'none',
                                                        transition: 'all 0.15s'
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = '#EDE6D8'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface-elevated)'; e.currentTarget.style.borderColor = 'var(--border-cohesive)'; }}
                                                    title="Edit Product"
                                                >
                                                    <Icon name="pencil" size={15} color="#666" strokeWidth={2} />
                                                </Link>
                                                {product.is_active && (
                                                    <button
                                                        onClick={async () => {
                                                            if (window.confirm(`Are you sure you want to deactivate "${product.name}"? It will be hidden from the store but preserved in historical records.`)) {
                                                                try {
                                                                    await api.delete(`/products/delete/${product.id}/`);
                                                                    fetchProducts();
                                                                } catch (err) {
                                                                    alert("Failed to deactivate product.");
                                                                }
                                                            }
                                                        }}
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: '36px',
                                                            height: '36px',
                                                            background: 'rgba(220, 38, 38, 0.05)',
                                                            border: '1px solid rgba(220, 38, 38, 0.15)',
                                                            borderRadius: '8px',
                                                            color: '#DC2626',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.15s'
                                                        }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220, 38, 38, 0.05)'; }}
                                                        title="Deactivate Product"
                                                    >
                                                        <Icon name="trash" size={15} color="#DC2626" strokeWidth={2} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Review Panel */}
                                    {isExpanded && (
                                        <tr key={`${product.id}-reviews`} style={{ background: 'var(--bg-surface)', borderBottom: '1px solid #F0EAE0' }}>
                                            <td colSpan="6" style={{ padding: '0 20px 24px 86px' }}>
                                                <div style={{
                                                    background: 'var(--bg-surface)',
                                                    border: '1px solid var(--border-cohesive)',
                                                    borderRadius: '12px',
                                                    padding: '20px',
                                                }}>
                                                    <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                                                        Customer Reviews
                                                    </div>

                                                    {product.reviews && product.reviews.length > 0 ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                            {product.reviews.map((review) => (
                                                                <div key={review.id} style={{
                                                                    borderBottom: '1px solid #F0EAE0',
                                                                    paddingBottom: '16px',
                                                                    display: 'flex',
                                                                    gap: '16px',
                                                                    alignItems: 'flex-start'
                                                                }}>
                                                                    <div style={{
                                                                        width: '34px', height: '34px', borderRadius: '50%',
                                                                        background: 'rgba(184,134,11,0.12)',
                                                                        border: '1px solid rgba(184,134,11,0.2)',
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                        fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary)',
                                                                        flexShrink: 0
                                                                    }}>
                                                                        {(review.user_name || 'U')[0].toUpperCase()}
                                                                    </div>
                                                                    <div style={{ flex: 1 }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                                                                            <span style={{ fontWeight: '700', color: '#1A1A1A', fontSize: '0.9rem' }}>{review.user_name}</span>
                                                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                                                {[...Array(5)].map((_, i) => (
                                                                                    <svg key={i} width="12" height="12" viewBox="0 0 24 24"
                                                                                        fill={i < review.rating ? "#D97706" : "none"}
                                                                                        stroke="#D97706" strokeWidth="1.5">
                                                                                        <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                                                    </svg>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                        <p style={{ margin: 0, color: '#555', fontSize: '0.88rem', lineHeight: '1.6' }}>{review.comment}</p>
                                                                        <div style={{ fontSize: '0.72rem', color: '#BBB', marginTop: '6px', fontWeight: '500' }}>
                                                                            {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div style={{ padding: '24px', textAlign: 'center', color: '#BBB', fontSize: '0.88rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px dashed #E8E2D4' }}>
                                                            No reviews yet for this product
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageProducts;



