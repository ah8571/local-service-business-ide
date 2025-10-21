// Express server for Local Service Business IDE
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Helper: Generate sample HTML for a local service business
function generateSampleSite({ businessName, services, locations, hours, contact }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${businessName || 'Local Service Business'}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f8f8f8; }
    header { background: #0077cc; color: #fff; padding: 20px; text-align: center; }
    section { background: #fff; margin: 20px auto; padding: 20px; max-width: 600px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    h2 { color: #0077cc; }
    ul { list-style: none; padding: 0; }
    ul li { padding: 5px 0; }
    .contact { font-size: 1.1em; }
  </style>
</head>
<body>
  <header>
    <h1>${businessName || 'Your Business Name'}</h1>
    <p>${locations ? `Serving: ${locations}` : ''}</p>
  </header>
  <section>
    <h2>Our Services</h2>
    <ul>
      ${(services || '').split(',').map(s => `<li>${s.trim()}</li>`).join('')}
    </ul>
  </section>
  <section>
    <h2>Operating Hours</h2>
    <p>${hours || 'Please contact us for hours.'}</p>
  </section>
  <section>
    <h2>Contact Us</h2>
    <div class="contact">
      ${contact || 'Email/Phone/Address'}
    </div>
  </section>
</body>
</html>`;
}

// Updated chat endpoint to generate a sample site
app.post('/api/chat', (req, res) => {
  const { message, model } = req.body;

  // Simple extraction for demo (in real use, parse with LLM or structured form)
  // Example: "My business is Joe's Plumbing, services: plumbing, drain cleaning, location: Boston, hours: 9-5, contact: joe@email.com"
  const businessNameMatch = message.match(/business (is|name is|called) ([^,\n]+)/i);
  const servicesMatch = message.match(/services?: ([^,\n]+)/i);
  const locationsMatch = message.match(/location[s]?: ([^,\n]+)/i);
  const hoursMatch = message.match(/hours?: ([^,\n]+)/i);
  const contactMatch = message.match(/contact (is|:)? ([^,\n]+)/i);

  const businessName = businessNameMatch ? businessNameMatch[2].trim() : '';
  const services = servicesMatch ? servicesMatch[1].trim() : '';
  const locations = locationsMatch ? locationsMatch[1].trim() : '';
  const hours = hoursMatch ? hoursMatch[1].trim() : '';
  const contact = contactMatch ? contactMatch[2].trim() : '';

  const siteHtml = generateSampleSite({ businessName, services, locations, hours, contact });

  res.json({
    reply: `Here is a preview of your local service business website!`,
    siteHtml
  });
});

// Endpoint to generate static site (HTML/CSS)
app.post('/api/generate-site', (req, res) => {
  // TODO: Generate HTML/CSS based on user input
  res.json({ success: true, url: '/generated_sites/sample.html' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
