import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import Notification from "../../components/Notification";

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
                        background: '#f5f5f5',
                        height: '500px',
                        marginBottom: '40px'
                    }}>
                        {product.image ? (
                            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '4rem' }}>🏺</div>
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '1.1rem' }}>
                                    {'★'.repeat(Math.round(product.average_rating))}{'☆'.repeat(5 - Math.round(product.average_rating))}
                                </div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({product.review_count} reviews)</span>
                            </div>
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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                                    fontSize: '1rem',
                                    boxShadow: product.stock === 0 ? 'none' : '0 8px 24px rgba(184, 134, 11, 0.25)'
                                }}
                            >
                                {product.stock === 0 ? 'OUT OF STOCK' : 'ORDER NOW'}
                            </button>
                            <button
                                onClick={handleWishlist}
                                style={{
                                    background: 'transparent',
                                    color: 'var(--text-main)',
                                    padding: '16px',
                                    borderRadius: '14px',
                                    fontWeight: '700',
                                    border: '1.5px solid var(--border-strong)',
                                    cursor: 'pointer'
                                }}
                            >
                                ♡ SAVE TO WISHLIST
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
