import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import Notification from "../../components/Notification";
import Icon from "../../components/Icons";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState("");
    const [notifType, setNotifType] = useState("success");

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}/`);
            setProduct(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch product");
            setLoading(false);
        }
    };

    const handleWishlist = async () => {
        if (!isAuthenticated) {
            setNotifType("error");
            setNotification("Please login to add to wishlist");
            return;
        }
        try {
            await api.post("/products/wishlist/add/", { product_id: id });
            setNotifType("success");
            setNotification("Added to wishlist");
        } catch (err) {
            setNotifType("error");
            setNotification("Already in wishlist or error");
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            setNotifType("error");
            setNotification("Please login to add to cart");
            return;
        }
        try {
            await api.post("/products/cart/add/", { product_id: id, quantity });
            setNotifType("success");
            setNotification("Added to cart!");
        } catch (err) {
            setNotifType("error");
            setNotification("Failed to add to cart");
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            setNotifType("error");
            setNotification("Please login to post a review");
            return;
        }

        try {
            await api.post(`/products/${id}/reviews/`, { rating, comment });
            setNotifType("success");
            setNotification("Review posted!");
            setComment("");
            fetchProduct();
        } catch (err) {
            setNotifType("error");
            setNotification("Failed to post review. Have you already reviewed this?");
        }
    };

    if (loading) return <div style={{ color: 'var(--text-main)', textAlign: 'center', padding: '100px' }}>Loading product details...</div>;
    if (!product) return <div style={{ color: 'var(--text-main)', textAlign: 'center', padding: '100px' }}>Product not found.</div>;

    const cardStyle = {
        background: 'var(--bg-surface)',
        borderRadius: '24px',
        border: '1px solid var(--border-strong)',
        padding: '40px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
    };

    return (
        <div className="animate-fade" style={{ maxWidth: '1200px', margin: '0 auto', color: 'var(--text-main)', padding: '40px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 400px', gap: '60px' }}>

                {/* Product Image & Specs */}
                <div>
                    <div style={{
                        borderRadius: '24px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-strong)',
                        background: '#fff',
                        height: '500px',
                        marginBottom: '40px'
                    }}>
                        {product.image ? (
                            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '20px' }} />
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.1 }}>
                                <Icon name="vase" size={120} color="var(--text-main)" />
                            </div>
                        )}
                    </div>

                    <div style={cardStyle}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '20px', color: 'var(--text-main)' }}>Product Details</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { label: 'Material', value: product.material || 'Sustainable Hardwood' },
                                { label: 'Finish', value: product.finish || 'Natural Oil Rubbed' },
                                { label: 'Build Time', value: product.build_time || '4–6 Weeks' },
                                { label: 'Certification', value: product.certification || 'Vaagai Certified' },
                            ].map(({ label, value }) => (
                                <div key={label} style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
                                    <span style={{ width: '140px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.9rem' }}>{label}</span>
                                    <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{value}</span>
                                </div>
                            ))}
                        </div>

                        {product.description && (
                            <div style={{ marginTop: '30px' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '12px', color: 'var(--text-main)' }}>About this Product</h3>
                                <p style={{ color: 'var(--text-dim)', lineHeight: '1.8', margin: 0 }}>{product.description}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pricing & CTA Column */}
                <div style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
                    <div style={cardStyle}>
                        <div style={{ marginBottom: '28px' }}>
                            <h1 style={{ fontSize: '1.8rem', fontWeight: '900', margin: '0 0 12px 0', color: 'var(--text-main)' }}>{product.name}</h1>
                            {product.average_rating > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ color: 'var(--primary)', display: 'flex', gap: '2px' }}>
                                        {[...Array(5)].map((_, i) => (
                                            <Icon 
                                                key={i} 
                                                name="star" 
                                                size={16} 
                                                color={i < Math.round(product.average_rating) ? 'var(--primary)' : 'var(--border-strong)'} 
                                                strokeWidth={i < Math.round(product.average_rating) ? 0 : 2}
                                                fill={i < Math.round(product.average_rating) ? 'var(--primary)' : 'none'}
                                            />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dim)' }}>
                                        ({product.review_count} {product.review_count === 1 ? 'review' : 'reviews'})
                                    </span>
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                <span style={{ fontSize: '2.2rem', fontWeight: '900', color: product.b2b_discounted_price ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: product.b2b_discounted_price ? 'line-through' : 'none' }}>₹{product.price}</span>
                            </div>
                            {product.b2b_discounted_price && (
                                <div style={{ marginTop: '10px' }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)' }}>₹{product.b2b_discounted_price}</span>
                                    <div style={{ background: 'rgba(74, 222, 128, 0.12)', color: '#16a34a', border: '1px solid rgba(74,222,128,0.3)', padding: '4px 12px', borderRadius: '100px', display: 'inline-block', fontSize: '0.7rem', fontWeight: '900', marginTop: '10px' }}>
                                        PARTNER EXCLUSIVE RATE
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase' }}>Quantity</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'rgba(0,0,0,0.03)', padding: '10px 20px', borderRadius: '12px', width: 'fit-content' }}>
                            <button 
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '1.2rem', fontWeight: '700' }}
                            >-</button>
                            <span style={{ fontWeight: '800', color: 'var(--text-main)', minWidth: '20px', textAlign: 'center' }}>{quantity}</span>
                            <button 
                              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                              style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '1.2rem', fontWeight: '700' }}
                            >+</button>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                              <button
                                  onClick={handleAddToCart}
                                  disabled={product.stock === 0}
                                  style={{
                                      background: 'rgba(0,0,0,0.03)',
                                      color: product.stock === 0 ? '#BBB' : 'var(--text-main)',
                                      padding: '18px',
                                      borderRadius: '14px',
                                      fontWeight: '900',
                                      border: '1.5px solid var(--border-strong)',
                                      cursor: product.stock === 0 ? 'default' : 'pointer',
                                      fontSize: '0.9rem',
                                      transition: 'all 0.2s ease'
                                  }}
                                  onMouseEnter={e => { if (product.stock > 0) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; } }}
                                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                              >
                                  ADD TO CART
                              </button>
                              <button
                                  onClick={() => navigate(`/customer/order/${product.id}`)}
                                  disabled={product.stock === 0}
                                  style={{
                                      background: product.stock === 0 ? 'var(--border-strong)' : 'var(--primary)',
                                      color: '#fff',
                                      padding: '18px',
                                      borderRadius: '14px',
                                      fontWeight: '900',
                                      border: 'none',
                                      cursor: product.stock === 0 ? 'default' : 'pointer',
                                      fontSize: '0.9rem',
                                      boxShadow: product.stock === 0 ? 'none' : '0 8px 24px rgba(184, 134, 11, 0.25)'
                                  }}
                              >
                                  BUY NOW
                              </button>
                            </div>
                            <button
                                onClick={handleWishlist}
                                style={{
                                    background: 'transparent',
                                    color: 'var(--text-main)',
                                    padding: '16px',
                                    borderRadius: '14px',
                                    fontWeight: '800',
                                    border: '1.5px solid var(--border-strong)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
                            >
                                <Icon name="heartOutline" size={18} color="var(--primary)" /> SAVE TO WISHLIST
                            </button>
                        </div>

                        <div style={{ marginTop: '24px', color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
                            Secure checkout. Free consultation available.
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div style={{ marginTop: '80px', maxWidth: '800px' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '40px', color: 'var(--text-main)' }}>Customer Reviews</h2>

                {/* Write Review */}
                <div style={{ ...cardStyle, marginBottom: '50px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px', color: 'var(--text-main)' }}>Write a Review</h3>
                    <form onSubmit={handleReviewSubmit}>
                        <div style={{ marginBottom: '18px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase' }}>Rating</label>
                            <select
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                            >
                                <option value="5">★★★★★ — Excellent</option>
                                <option value="4">★★★★☆ — Very Good</option>
                                <option value="3">★★★☆☆ — Good</option>
                                <option value="2">★★☆☆☆ — Fair</option>
                                <option value="1">★☆☆☆☆ — Poor</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase' }}>Your Review</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your experience with this product..."
                                style={{ height: '110px', resize: 'none' }}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ padding: '12px 28px', borderRadius: '10px' }}>
                            POST REVIEW
                        </button>
                    </form>
                </div>

                {/* Reviews List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map(review => (
                            <div key={review.id} style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: '800', color: 'var(--text-main)' }}>{review.user_name}</span>
                                    <span style={{ color: 'var(--primary)', letterSpacing: '2px', fontSize: '0.9rem' }}>{'★'.repeat(review.rating)}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(review.created_at).toLocaleDateString()}</span>
                                </div>
                                <p style={{ color: 'var(--text-dim)', lineHeight: '1.6', margin: 0 }}>{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '30px', textAlign: 'center', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                            No reviews yet. Be the first to review this product!
                        </div>
                    )}
                </div>
            </div>

            <Notification message={notification} type={notifType} onClose={() => setNotification("")} />
        </div>
    );
};

export default ProductDetail;
