import React, { useState } from 'react';
import GuidedChatBox from './components/GuidedChatBox';
import SitePreview from './components/SitePreview';

function Layout() {
  const [siteHtml, setSiteHtml] = useState('');

  // Placeholder for download functionality
  const handleDownload = () => {
    const blob = new Blob([siteHtml || ''], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const buttonStyle = {
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginRight: '12px'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: '#f1f5f9',
    color: '#475569',
    border: '1px solid #e2e8f0'
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      {/* Left: Chat */}
      <div style={{ 
        flex: 1, 
        padding: '24px', 
        borderRight: '1px solid #e2e8f0', 
        display: 'flex', 
        flexDirection: 'column',
        background: '#fefefe'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              color: '#0f172a', 
              margin: 0,
              background: 'linear-gradient(135deg, #1e40af, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: '1.2'
            }}>
              Local Service Business Website Builder
            </h1>
            <p style={{ 
              color: '#64748b', 
              fontSize: '16px',
              margin: '8px 0 0 0'
            }}>
              Free professional websites for local service providers
            </p>
          </div>
        </div>
        
        <GuidedChatBox setSiteHtml={setSiteHtml} />
      </div>
      
      {/* Right: Live Preview */}
      <div style={{ 
        flex: 2, 
        padding: '24px', 
        display: 'flex', 
        flexDirection: 'column',
        background: '#ffffff'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#0f172a',
            margin: 0
          }}>
            Live Preview
          </h2>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
              style={secondaryButtonStyle}
              onMouseOver={(e) => e.target.style.background = '#e2e8f0'}
              onMouseOut={(e) => e.target.style.background = '#f1f5f9'}
            >
              Save
            </button>
            <button 
              style={secondaryButtonStyle}
              onClick={handleDownload}
              onMouseOver={(e) => e.target.style.background = '#e2e8f0'}
              onMouseOut={(e) => e.target.style.background = '#f1f5f9'}
            >
              Download
            </button>
            <button 
              style={{...buttonStyle, marginRight: 0}}
              onMouseOver={(e) => e.target.style.background = '#1d4ed8'}
              onMouseOut={(e) => e.target.style.background = '#2563eb'}
            >
              Publish
            </button>
          </div>
        </div>
        
        <SitePreview siteHtml={siteHtml} />
      </div>
    </div>
  );
}

export default Layout;
