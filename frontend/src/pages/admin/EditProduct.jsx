import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [existingImage, setExistingImage] = useState(null);
  const [image, setImage] = useState(null);

  // Technical Specifications
  const [material, setMaterial] = useState("");
  const [finish, setFinish] = useState("");
  const [buildTime, setBuildTime] = useState("");
  const [certification, setCertification] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/admin/${id}/`);
        const product = res.data;
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setStock(product.stock);
        setCategory(product.category?.id || "");
        setIsActive(product.is_active);
        setExistingImage(product.image);

        // Populate tech specs
        setMaterial(product.material || "");
        setFinish(product.finish || "");
        setBuildTime(product.build_time || "");
        setCertification(product.certification || "");

        setLoading(false);
      } catch (err) {
        console.error("Failed to load product");
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!name || !description || !category || !price || !stock) {
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

      await api.put(`/products/update/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsError(false);
      setMessage("Product updated successfully!");
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (err) {
      setIsError(true);
      setMessage("Update failed. Please check your inputs.");
    }
  };

  if (loading) return <div style={{ color: 'var(--text-muted)', padding: '40px' }}>Loading product details...</div>;

  const inputStyle = { width: '100%', marginBottom: '15px' };
  const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' };

  return (
    <div className="animate-fade" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>Edit Product</h2>
        <p style={{ color: 'var(--text-muted)' }}>ID: {id}</p>
      </div>

      <div className="glass-card" style={{ padding: '50px', border: '1px solid var(--border-subtle)' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div>
              <label style={labelStyle}>Product Name</label>
              <input type="text" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />

              <label style={labelStyle}>Category</label>
              <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Price (₹)</label>
                  <input type="number" style={inputStyle} value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Inventory Stock</label>
                  <input type="number" style={inputStyle} value={stock} onChange={(e) => setStock(e.target.value)} />
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                  Active Listing
                </label>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Full Description</label>
              <textarea style={{ ...inputStyle, height: '115px' }} value={description} onChange={(e) => setDescription(e.target.value)} />

              <div style={{ display: 'flex', gap: '30px', marginTop: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Current Image</label>
                  <img src={existingImage} alt="Current" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #333', background: '#111' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Replace Image</label>
                  <div style={{ border: '1px dashed #444', height: '120px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer' }} />
                    <span style={{ fontSize: '0.7rem', color: '#666', textAlign: 'center', padding: '10px' }}>{image ? image.name : 'Click to Upload\nNew Image'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications Section */}
          <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '30px', fontWeight: '800' }}>Technical Specifications</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              <div>
                <label style={labelStyle}>Material</label>
                <input type="text" style={inputStyle} value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="e.g. Sustainable Hardwood / Teak" />

                <label style={labelStyle}>Finish</label>
                <input type="text" style={inputStyle} value={finish} onChange={(e) => setFinish(e.target.value)} placeholder="e.g. Natural Oil Rubbed" />
              </div>
              <div>
                <label style={labelStyle}>Build Time</label>
                <input type="text" style={inputStyle} value={buildTime} onChange={(e) => setBuildTime(e.target.value)} placeholder="e.g. 4-6 Weeks" />

                <label style={labelStyle}>Certification</label>
                <input type="text" style={inputStyle} value={certification} onChange={(e) => setCertification(e.target.value)} placeholder="e.g. Vaagai Mastercraft Certified" />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '50px', alignItems: 'center' }}>
            <button type="submit" className="btn-premium" style={{ minWidth: '220px' }}>Save Changes</button>
            <button type="button" onClick={() => navigate("/admin/dashboard")} style={{ background: 'var(--bg-surface)', border: '1px solid #444', color: '#888', padding: '14px 28px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700' }}>Cancel</button>

            {message && (
              <div style={{
                marginLeft: '20px',
                color: isError ? '#ff4444' : '#4ade80',
                fontSize: '0.9rem',
                fontWeight: '700'
              }}>
                {isError ? '✕' : '✓'} {message}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;


