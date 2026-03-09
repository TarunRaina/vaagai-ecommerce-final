import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import Notification from "../../components/Notification";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "../../components/Icons";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [notification, setNotification] = useState("");
  const [notifType, setNotifType] = useState("success");
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStock, setFilterStock] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setSearchTerm(queryParams.get("search") || "");
  }, [location.search]);

  useEffect(() => {
    fetchProducts();
    if (isAuthenticated) fetchWishlist();
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products/");
      setProducts(response.data);
    } catch (err) {
      console.error("Failed to fetch products");
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await api.get("/products/wishlist/");
      const ids = new Set(response.data.map((item) => item.product.id));
      setWishlistIds(ids);
    } catch (err) {
      console.error("Failed to fetch wishlist");
    }
  };

  const handleWishlist = async (e, productId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setNotifType("error");
      setNotification("Please log in to save items");
      return;
    }
    if (wishlistIds.has(productId)) return;
    try {
      await api.post("/products/wishlist/add/", { product_id: productId });
      setWishlistIds((prev) => new Set(prev).add(productId));
      setNotifType("success");
      setNotification("Saved to wishlist");
    } catch (err) {
      setNotifType("error");
      setNotification("Could not save item");
    }
  };

  // Get all categories
  const categories = ["All", ...new Set(products.map(p => p.category?.name).filter(Boolean))];

  // Filter products
  let result = products.filter((p) => {
    const matchSearch = !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = activeCategory === "All" || p.category?.name === activeCategory;

    let matchStock = true;
    if (filterStock === "In Stock") matchStock = p.stock > 0;
    if (filterStock === "Out of Stock") matchStock = p.stock === 0;

    return matchSearch && matchCat && matchStock;
  });

  result.sort((a, b) => {
    let priceA = parseFloat(a.price || 0);
    let priceB = parseFloat(b.price || 0);

    if (sortBy === 'Newest') return b.id - a.id;
    if (sortBy === 'Price: Low-High') return priceA - priceB;
    if (sortBy === 'Price: High-Low') return priceB - priceA;
    if (sortBy === 'Most in Stock') return (b.stock || 0) - (a.stock || 0);
    if (sortBy === 'Highest Rated') return (parseFloat(b.average_rating) || 0) - (parseFloat(a.average_rating) || 0);
    return 0;
  });

  const filteredProducts = result;

  return (
    <div className="animate-fade" style={{
      width: '100%',
      margin: '0 auto',
      paddingBottom: '120px',
      minHeight: '100vh'
    }}>

      {/* Hero Header Section */}
      <div style={{
        padding: '20px 0 60px',
        marginBottom: '40px',
      }}>
        {searchTerm ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '1px', background: 'var(--primary)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: '900', letterSpacing: '2px', color: 'var(--primary)', textTransform: 'uppercase' }}>Search Results</span>
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, color: '#1A1A1A', letterSpacing: '-1px', lineHeight: 1 }}>
              "{searchTerm}"
            </h2>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '30px', height: '2px', background: 'var(--primary)' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: '900', letterSpacing: '2.5px', color: 'var(--primary)', textTransform: 'uppercase' }}>Our Collections</span>
            </div>
            <h2 style={{ fontSize: '3.2rem', fontWeight: '900', margin: 0, color: '#1A1A1A', letterSpacing: '-1.5px', lineHeight: 1 }}>
              Artisanal Pieces
            </h2>
            <p style={{ color: '#666', marginTop: '16px', fontSize: '1.1rem', fontWeight: '500', maxWidth: '650px', lineHeight: 1.4 }}>
              Explore our curated select of premium furniture and architectural hardware.
            </p>
          </div>
        )}
      </div>

      {/* Category Selection & Action Bar */}
      {!searchTerm && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '50px',
        }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '12px 32px',
                  borderRadius: '100px',
                  border: '1.5px solid',
                  borderColor: activeCategory === cat ? 'var(--primary)' : 'var(--border-cohesive)',
                  background: activeCategory === cat ? 'var(--primary)' : 'var(--bg-surface)',
                  color: activeCategory === cat ? '#fff' : 'var(--text-main)',
                  fontWeight: '800',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                  letterSpacing: '0.5px',
                  boxShadow: activeCategory === cat
                    ? '0 4px 20px rgba(184,134,11,0.25)'
                    : 'none',
                }}
                onMouseEnter={e => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.background = '#FFF';
                  }
                }}
                onMouseLeave={e => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.borderColor = 'var(--border-cohesive)';
                    e.currentTarget.style.background = 'var(--bg-surface)';
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px',
                background: showFilters ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                border: '1.5px solid',
                borderColor: showFilters ? 'var(--primary)' : 'var(--border-cohesive)',
                borderRadius: '100px',
                color: showFilters ? 'var(--primary)' : 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: '800',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon name="filter" size={16} color="currentColor" strokeWidth={2} />
              FILTERS & SORT
            </button>

            {/* Filter Popover */}
            {showFilters && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '12px',
                background: '#fff',
                border: '1px solid var(--border-cohesive)',
                borderRadius: '16px',
                padding: '24px',
                width: '280px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                zIndex: 100
              }}>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    Stock Status
                  </div>
                  <select
                    value={filterStock}
                    onChange={(e) => setFilterStock(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid var(--border-cohesive)',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="All">All Stock</option>
                    <option value="In Stock">In Stock Only</option>
                    <option value="Out of Stock">Include Out of Stock</option>
                  </select>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    Sort By
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid var(--border-cohesive)',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Newest">Newest Arrivals</option>
                    <option value="Price: Low-High">Price: Low to High</option>
                    <option value="Price: High-Low">Price: High to Low</option>
                    <option value="Most in Stock">Most in Stock</option>
                    <option value="Highest Rated">Highest Rated</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Content Area */}
      {filteredProducts.length === 0 ? (
        <div style={{
          padding: '120px 40px',
          textAlign: 'center',
          background: 'var(--bg-surface)',
          borderRadius: '24px',
          border: '1px solid var(--border-cohesive)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.3 }}>✧</div>
          <h3 style={{ fontSize: '1.3rem', color: '#1A1A1A', fontWeight: '900', margin: '0 0 10px' }}>No matches found</h3>
          <p style={{ color: '#888', fontSize: '1rem', maxWidth: '400px', margin: '0 auto' }}>Try selecting a different category from above.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          gap: '40px',
          width: '100%'
        }}>
          {filteredProducts.map((product) => {
            const isWishlisted = wishlistIds.has(product.id);
            const isOutOfStock = product.stock === 0;
            const isLowStock = product.stock > 0 && product.stock < 5;

            return (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                style={{
                  background: '#FEFCF8',
                  border: '1px solid #E5DFD3',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(184,134,11,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                  e.currentTarget.style.borderColor = '#E5DFD3';
                }}
              >
                {/* Product Image */}
                <div style={{ position: 'relative', height: '220px', background: '#F0EBE1', overflow: 'hidden' }}>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C8BFB0', fontSize: '0.85rem', fontWeight: '600' }}>
                      No Image
                    </div>
                  )}

                  {/* Stock overlay */}
                  {isOutOfStock && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(0,0,0,0.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ color: '#fff', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Out of Stock</span>
                    </div>
                  )}

                  {/* Low stock badge */}
                  {isLowStock && (
                    <div style={{
                      position: 'absolute', top: '12px', left: '12px',
                      background: '#DC2626', color: '#fff',
                      padding: '3px 10px', borderRadius: '100px',
                      fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.5px'
                    }}>
                      Only {product.stock} left
                    </div>
                  )}

                  {/* Category tag */}
                  <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(4px)',
                    padding: '3px 10px', borderRadius: '100px',
                    fontSize: '0.68rem', fontWeight: '700', color: '#666',
                    letterSpacing: '0.5px'
                  }}>
                    {product.category?.name}
                  </div>

                  {/* Wishlist button */}
                  <button
                    onClick={(e) => handleWishlist(e, product.id)}
                    style={{
                      position: 'absolute', bottom: '12px', right: '12px',
                      width: '34px', height: '34px', borderRadius: '50%',
                      background: isWishlisted ? 'rgba(220,38,38,0.9)' : 'rgba(255,255,255,0.9)',
                      border: 'none', cursor: isWishlisted ? 'default' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                      transition: 'all 0.15s',
                      backdropFilter: 'blur(4px)',
                    }}
                    title={isWishlisted ? "In your wishlist" : "Add to wishlist"}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24"
                      fill={isWishlisted ? "#fff" : "none"}
                      stroke={isWishlisted ? "#fff" : "#999"}
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>

                {/* Card Content */}
                <div style={{ padding: '18px 20px 20px' }}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    margin: '0 0 6px',
                    color: '#1A1A1A',
                    lineHeight: 1.3,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {product.name}
                  </h4>
                  <p style={{
                    fontSize: '0.82rem',
                    color: '#999',
                    margin: '0 0 14px',
                    lineHeight: 1.5,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {product.description || "Premium quality product with exceptional craftsmanship."}
                  </p>

                  {/* Price row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      {product.b2b_discounted_price ? (
                        <>
                          <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#16A34A' }}>
                            ₹{parseFloat(product.b2b_discounted_price).toLocaleString()}
                          </span>
                          <span style={{ fontSize: '0.85rem', color: '#BBB', textDecoration: 'line-through' }}>
                            ₹{parseFloat(product.price).toLocaleString()}
                          </span>
                          <span style={{
                            fontSize: '0.65rem', fontWeight: '800', color: '#16A34A',
                            background: 'rgba(22,163,74,0.1)', padding: '2px 6px', borderRadius: '4px',
                            border: '1px solid rgba(22,163,74,0.2)'
                          }}>B2B</span>
                        </>
                      ) : (
                        <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary)' }}>
                          ₹{parseFloat(product.price).toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    {product.average_rating && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="#D97706" stroke="none">
                          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                        <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#555' }}>{product.average_rating}</span>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isOutOfStock) navigate(`/customer/order/${product.id}`);
                    }}
                    disabled={isOutOfStock}
                    style={{
                      width: '100%',
                      marginTop: '14px',
                      padding: '11px',
                      background: isOutOfStock ? '#F0EBE1' : 'var(--primary)',
                      color: isOutOfStock ? '#BBB' : '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      cursor: isOutOfStock ? 'default' : 'pointer',
                      fontFamily: 'inherit',
                      transition: 'opacity 0.15s',
                      letterSpacing: '0.3px',
                    }}
                    onMouseEnter={e => { if (!isOutOfStock) e.currentTarget.style.opacity = '0.88'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                  >
                    {isOutOfStock ? 'Out of Stock' : 'Order Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Notification
        message={notification}
        type={notifType}
        onClose={() => setNotification("")}
      />
    </div>
  );
};

export default Dashboard;
