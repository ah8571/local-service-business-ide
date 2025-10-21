import React, { useState } from 'react';
import ChatBox from './components/ChatBox';
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

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f9f9f9' }}>
      {/* Left: Chat */}
      <div style={{ flex: 1, padding: 32, borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ marginBottom: 16 }}>Local Service Business IDE</h2>
        <div style={{ marginBottom: 24, color: '#444', fontSize: 16 }}>
          <b>Get started:</b><br />
          Provide us information on your business, including:<br />
          <ul style={{ margin: '8px 0 0 18px' }}>
            <li>Name of business</li>
            <li>Main services</li>
            <li>Locations</li>
            <li>Operating hours</li>
            <li>Contact information</li>
          </ul>
          <span style={{ color: '#888', fontSize: 14 }}>
            (You can also ask questions or request help at any time!)
          </span>
        </div>
        <ChatBox setSiteHtml={setSiteHtml} />
      </div>
      {/* Right: Live Preview */}
      <div style={{ flex: 2, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3 style={{ marginBottom: 16 }}>Live Website Preview</h3>
        <SitePreview siteHtml={siteHtml} />
        <div style={{ marginTop: 32 }}>
          <button style={{ marginRight: 16 }}>Save</button>
          <button style={{ marginRight: 16 }} onClick={handleDownload}>Download</button>
          <button>Publish</button>
        </div>
      </div>
    </div>
  );
}

export default Layout;
