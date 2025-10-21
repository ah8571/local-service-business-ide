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
          color: '#94a3b8',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏗️</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#64748b' }}>
            Ready to build your site?
          </h3>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Start chatting to see your website come to life
          </p>
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
