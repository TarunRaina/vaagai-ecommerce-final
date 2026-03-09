import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/Icons";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Technical Specifications
  const [material, setMaterial] = useState("");
  const [finish, setFinish] = useState("");
  const [buildTime, setBuildTime] = useState("");
  const [certification, setCertification] = useState("");

  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/products/categories/");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products/");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!name || !description || !category || !price || !stock || (!editingId && !image)) {
      setIsError(true);
      setMessage("All fields are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category_id", category);
      formData.append("is_active", isActive);

      // Technical Specifications
      formData.append("material", material);
      formData.append("finish", finish);
      formData.append("build_time", buildTime);
      formData.append("certification", certification);

      if (image) formData.append("image", image);

      if (editingId) {
        await api.put(`/products/update/${editingId}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Product updated successfully!");
      } else {
        await api.post("/products/create/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Product added successfully!");
      }

      setIsError(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.detail || "Operation failed");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setCategory("");
    setIsActive(true);
    setImage(null);
    setMaterial("");
    setFinish("");
    setBuildTime("");
    setCertification("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/delete/${id}/`);
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product");
    }
  };

  const inputStyle = { width: '100%', marginBottom: '0' };
  const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>Inventory</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.9rem' }}>Manage products and stock levels</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          style={{ padding: '10px 20px', fontSize: '0.85rem', borderRadius: '10px' }}
        >
          View All Products ↓
        </button>
      </div>

      <div style={{ background: 'var(--bg-surface)', padding: '36px', marginBottom: '40px', borderRadius: '16px', border: '1px solid var(--border-cohesive)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
          <div style={{ width: '5px', height: '22px', background: 'var(--primary)', borderRadius: '3px' }}></div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>
            {editingId ? "Edit Product" : "Add New Product"}
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Product Name</label>
                <input type="text" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Handcrafted Rosewood Door" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select style={{ ...inputStyle, padding: '14px', borderRadius: '12px' }} value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Price (₹)</label>
                  <input type="number" style={{ ...inputStyle, padding: '14px', borderRadius: '12px' }} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" />
                </div>
                <div>
                  <label style={labelStyle}>Total Stock</label>
                  <input type="number" style={{ ...inputStyle, padding: '14px', borderRadius: '12px' }} value={stock} onChange={(e) => setStock(e.target.value)} placeholder="0" />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea style={{ ...inputStyle, height: '120px', resize: 'none' }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the product, materials, and key details..." />
              </div>

              <div style={{ display: 'flex', gap: '25px', alignItems: 'center', background: 'var(--bg-surface-elevated)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-strong)' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ ...labelStyle, marginBottom: '5px' }}>Product Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} />
                </div>
                <div style={{ borderLeft: '1px solid var(--border-strong)', paddingLeft: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700' }}>
                    <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                    Active listing
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications Section */}
          <div style={{ marginTop: '30px', paddingTop: '30px', borderTop: '1px solid var(--border-strong)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.75rem' }}>Material</label>
                <input type="text" style={{ ...inputStyle, padding: '12px', borderRadius: '10px' }} value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Teak/Rosewood" />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.75rem' }}>Finish</label>
                <input type="text" style={{ ...inputStyle, padding: '12px', borderRadius: '10px' }} value={finish} onChange={(e) => setFinish(e.target.value)} placeholder="Natural Oil" />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.75rem' }}>Build Time</label>
                <input type="text" style={{ ...inputStyle, padding: '12px', borderRadius: '10px' }} value={buildTime} onChange={(e) => setBuildTime(e.target.value)} placeholder="4-6 Weeks" />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.75rem' }}>Certification</label>
                <input type="text" style={{ ...inputStyle, padding: '12px', borderRadius: '10px' }} value={certification} onChange={(e) => setCertification(e.target.value)} placeholder="Mastercraft" />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '20px', marginTop: '40px' }}>
            <button type="submit" className="btn-primary" style={{ padding: '13px 28px', borderRadius: '10px', fontSize: '0.9rem' }}>
              {editingId ? "Update Product" : "Save Product"}
            </button>
            {editingId && <button type="button" onClick={resetForm} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', color: 'var(--text-muted)', padding: '15px 30px', borderRadius: '14px', cursor: 'pointer', fontWeight: '700' }}>Discard Changes</button>}

            {message && (
              <div className="animate-fade" style={{
                color: isError ? '#dc2626' : '#16a34a',
                fontSize: '0.88rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                background: isError ? 'rgba(220,38,38,0.08)' : 'rgba(22,163,74,0.08)',
                border: `1px solid ${isError ? 'rgba(220,38,38,0.2)' : 'rgba(22,163,74,0.2)'}`
              }}>
                <Icon name={isError ? 'alert' : 'check'} size={16} color={isError ? '#dc2626' : '#16a34a'} /> {message}
              </div>
            )}
          </div>
        </form>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>Product Catalog</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '3px' }}>{products.length} products in catalog</p>
      </div>

      <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-cohesive)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-cohesive)' }}>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.72rem', textTransform: 'uppercase', color: '#999', letterSpacing: '1.2px', fontWeight: '700' }}>Product</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.72rem', textTransform: 'uppercase', color: '#999', letterSpacing: '1.2px', fontWeight: '700' }}>Category</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.72rem', textTransform: 'uppercase', color: '#999', letterSpacing: '1.2px', fontWeight: '700' }}>Price</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.72rem', textTransform: 'uppercase', color: '#999', letterSpacing: '1.2px', fontWeight: '700' }}>Stock</th>
              <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '0.72rem', textTransform: 'uppercase', color: '#999', letterSpacing: '1.2px', fontWeight: '700' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Synchronizing inventory data...</td></tr>
            ) : products.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid #F0EAE0', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = '#FAF7F2'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={product.image} alt={product.name} style={{ width: '64px', height: '64px', borderRadius: '14px', objectFit: 'cover', background: '#111', border: '1px solid var(--border-strong)' }} />
                      {!product.is_active && <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ff4444', border: '2px solid #000', width: '12px', height: '12px', borderRadius: '50%' }}></div>}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>{product.name}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '600', color: product.is_active ? '#16a34a' : '#dc2626', marginTop: '2px' }}>{product.is_active ? 'Active' : 'Hidden'}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '18px 25px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: '600' }}>{product.category?.name}</span>
                </td>
                <td style={{ padding: '18px 25px' }}>
                  <div style={{ fontWeight: '900', color: 'var(--primary)', fontSize: '1.2rem' }}>₹{Number(product.price).toLocaleString()}</div>
                </td>
                <td style={{ padding: '18px 25px' }}>
                  <div style={{ marginBottom: '8px', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>{product.stock} Units</div>
                  <div style={{
                    width: '80px', height: '4px', background: 'var(--border-strong)', borderRadius: '2px', overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min((product.stock / 20) * 100, 100)}%`,
                      height: '100%',
                      background: product.stock === 0 ? '#ff4444' : product.stock < 10 ? 'var(--primary)' : '#4ade80'
                    }}></div>
                  </div>
                </td>
                <td style={{ padding: '18px 25px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button
                      onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                      style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-cohesive)', color: '#555', padding: '8px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#EDE8DC'}
                      onMouseLeave={e => e.currentTarget.style.background = '#F5F0E8'}
                      title="Edit Product"
                    >
                      <Icon name="pencil" size={16} color="#666" /></button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)', color: '#dc2626', padding: '8px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.querySelector('svg').style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.06)'; }}
                      title="Delete Product"
                    >
                      <Icon name="trash" size={16} color="#dc2626" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  );
};

export default AdminDashboard;



