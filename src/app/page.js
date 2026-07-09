import React from 'react';

export default function Home() {
  return (
    <main className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h1 className="headline headline-lg" style={{ marginBottom: '16px', color: 'var(--primary)' }}>
          PDF to Website Generator
        </h1>
        <p className="body-lg" style={{ color: 'var(--on-surface-variant)', maxWidth: '600px', margin: '0 auto 32px' }}>
          Instantly transform your static educational materials and financial literacy guides into beautiful, interactive, glassmorphic websites.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button className="btn btn-primary">
            Get Started <span style={{ fontSize: '18px' }}>✦</span>
          </button>
          <button className="btn btn-glass">
            Watch Demo
          </button>
        </div>
      </section>

      {/* Main Glass Panel */}
      <section className="glass-panel" style={{ padding: '40px', marginBottom: '64px' }}>
        <h2 className="headline headline-md" style={{ marginBottom: '24px' }}>How it Works</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
          {/* Step 1 */}
          <div>
            <div className="label-sm" style={{ color: 'var(--secondary)', marginBottom: '8px' }}>Step 01</div>
            <h3 className="headline" style={{ fontSize: '20px', marginBottom: '12px' }}>Upload Your PDF</h3>
            <p className="body-md" style={{ color: 'var(--on-surface-variant)', marginBottom: '16px' }}>
              Upload your documents securely. Our system supports various formats tailored for educational content.
            </p>
            <input type="text" className="input-glass" placeholder="Paste a document URL instead..." />
          </div>

          {/* Step 2 */}
          <div>
            <div className="label-sm" style={{ color: 'var(--secondary)', marginBottom: '8px' }}>Step 02</div>
            <h3 className="headline" style={{ fontSize: '20px', marginBottom: '12px' }}>Apply HerNova Design</h3>
            <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
              We automatically apply the quiet luminance aesthetic—bringing frosted glass panels, deep magenta accents, and beautiful typography to your content.
            </p>
          </div>

          {/* Step 3 */}
          <div>
            <div className="label-sm" style={{ color: 'var(--secondary)', marginBottom: '8px' }}>Step 03</div>
            <h3 className="headline" style={{ fontSize: '20px', marginBottom: '12px' }}>Publish & Empower</h3>
            <p className="body-md" style={{ color: 'var(--on-surface-variant)', marginBottom: '16px' }}>
              Your new interactive platform is ready to inspire and educate women everywhere.
            </p>
            <button className="btn btn-accent" style={{ width: '100%' }}>
              Publish Now
            </button>
          </div>
        </div>
      </section>

      {/* FinHer Widget Preview */}
      <section style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '24px', maxWidth: '400px', width: '100%' }}>
          {/* Mock Score Ring */}
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'conic-gradient(var(--accent-golden) 75%, var(--inverse-surface) 0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: 'var(--surface-bright)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-epilogue)',
              fontWeight: '600',
              fontSize: '20px'
            }}>
              75
            </div>
          </div>
          <div>
            <h3 className="headline" style={{ fontSize: '18px', marginBottom: '4px' }}>FinHer Score</h3>
            <p className="body-md" style={{ color: 'var(--on-surface-variant)', fontSize: '14px' }}>
              Your financial literacy progress is looking great!
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
