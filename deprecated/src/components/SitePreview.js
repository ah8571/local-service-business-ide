import React from 'react';

function SitePreview({ siteHtml }) {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      border: '1px solid #e2e8f0', 
      borderRadius: '12px', 
      background: '#ffffff', 
      overflow: 'hidden',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    }}>
      {!siteHtml ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
          textAlign: 'center',
          padding: '40px'
        }}>
          <div style={{ 
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
          }}>
            <span style={{ fontSize: '36px' }}>�</span>
          </div>
          <h3 style={{ 
            margin: '0 0 12px 0', 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#1e40af',
            background: 'linear-gradient(135deg, #1e40af, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Your Website Preview
          </h3>
          <p style={{ 
            margin: '0 0 24px 0', 
            fontSize: '16px', 
            color: '#64748b',
            lineHeight: '1.5',
            maxWidth: '400px'
          }}>
            Answer the questions on the left, and watch your professional contractor website come to life in real-time!
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
            gap: '16px',
            marginTop: '20px',
            width: '100%',
            maxWidth: '400px'
          }}>
            {[
              { icon: '⚡', text: 'Instant Preview', color: '#f59e0b' },
              { icon: '📱', text: 'Mobile Ready', color: '#10b981' },
              { icon: '🎯', text: 'SEO Optimized', color: '#8b5cf6' }
            ].map((feature, i) => (
              <div key={i} style={{ 
                background: 'white',
                padding: '16px 12px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ 
                  fontSize: '24px', 
                  marginBottom: '8px'
                }}>
                  {feature.icon}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: '600',
                  color: feature.color
                }}>
                  {feature.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <iframe
          title="Site Preview"
          srcDoc={siteHtml}
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      )}
    </div>
  );
}

export default SitePreview;
