import React from 'react';

function SitePreview({ siteHtml }) {
  return (
    <div style={{ width: '100%', height: '70vh', border: '1px solid #ddd', borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
      <iframe
        title="Site Preview"
        srcDoc={siteHtml || '<h2>Your site preview will appear here.</h2>'}
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
}

export default SitePreview;
