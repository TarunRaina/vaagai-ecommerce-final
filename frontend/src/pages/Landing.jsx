import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const sections = {
    hero: {
      height: '90vh',
      display: 'flex',
      alignItems: 'center',
      padding: '0 8%',
      position: 'relative',
      backgroundImage: 'linear-gradient(to right, rgba(253,251,247,0.95) 30%, rgba(253,251,247,0.4) 100%), url("/hero.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    section: {
      padding: '100px 8%',
      background: 'var(--bg-main)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '40px',
      marginTop: '60px'
    }
  };

  return (
    <div className="animate-fade">
      {/* Hero Section */}
      <section style={sections.hero}>
        <div style={{ maxWidth: '600px' }}>
          <h1 style={{ fontSize: '4.5rem', lineHeight: '1.1', marginBottom: '24px' }}>
            Elevate Your <span style={{ color: 'var(--primary)' }}>Space</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '500px' }}>
            Bespoke furniture and premium doors crafted with the finest materials and timeless design. Vaagai brings luxury to every corner of your home.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button className="btn-premium" onClick={() => navigate('/customer/dashboard')}>
              Shop the Collection
            </button>
            <button style={{
              background: 'transparent',
              color: 'var(--text-main)',
              padding: '14px 28px',
              borderRadius: '8px',
              border: '2px solid var(--border-strong)',
              fontWeight: '700'
            }} onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section style={sections.section}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '16px' }}>Our Collections</h2>
          <p style={{ color: 'var(--text-muted)' }}>Premium designs for every room in your home.</p>
        </div>

        <div style={sections.grid}>
          {[
            { title: 'Signature Doors', desc: 'Handcrafted teak and rosewood entrances.', icon: '🚪' },
            { title: 'Modular Living', desc: 'Bespoke furniture for the contemporary home.', icon: '🛋️' },
            { title: 'Premium Plywood', desc: 'The architectural foundation of strength.', icon: '🏗️' }
          ].map((item, i) => (
            <div key={i} className="glass-card" style={{ textAlign: 'center', transition: 'transform 0.3s ease' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{item.icon}</div>
              <h3 style={{ marginBottom: '12px' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{
        ...sections.section,
        background: 'var(--bg-surface-elevated)',
        borderY: '1px solid var(--border-strong)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '40px'
        }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{ color: 'var(--primary)', fontWeight: '800', marginBottom: '16px', letterSpacing: '2px', textTransform: 'uppercase' }}>Partnership Opportunities</div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Are you a Business Professional?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              Join our business program. Get access to bulk pricing, priority manufacturing, and dedicated support for your projects.
            </p>
          </div>
          <button className="btn-primary" style={{ padding: '18px 40px', fontSize: '1rem' }} onClick={() => navigate('/register')}>
            Register as Business
          </button>
        </div>
      </section>

      {/* Quality Section */}
      <section style={sections.section}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div className="glass-panel" style={{ height: '400px', background: 'url("https://images.unsplash.com/photo-1556020685-ae41abfc9365?q=80&w=2000&auto=format&fit=crop") center/cover' }}></div>
          <div>
            <h2 style={{ fontSize: '2.8rem', marginBottom: '24px' }}>Uncompromising Quality</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
              We believe that quality is not just a standard, but a commitment. Every piece that leaves our workshop is a testament to our legacy of craftsmanship.
            </p>
            <ul style={{ listStyle: 'none' }}>
              {['Sustainably Sourced Timber', 'ISO Certified Processes', 'Lifetime Craftsmanship Warranty'].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', fontWeight: '500' }}>
                  <span style={{ color: 'var(--primary)' }}>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
