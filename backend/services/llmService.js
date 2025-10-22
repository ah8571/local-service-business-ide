const { Ollama } = require('ollama');

class LLMService {
  constructor() {
    this.ollama = new Ollama({ 
      host: process.env.OLLAMA_HOST || 'http://localhost:11434' 
    });
    this.model = process.env.OLLAMA_MODEL || 'llama3.1:8b';
  }

  /**
   * Generate a website for a contractor/local service business
   * @param {string} businessInfo - Information about the business
   * @returns {Promise<{reply: string, siteHtml: string}>}
   */
  async generateContractorWebsite(businessInfo) {
    console.log('🔄 Starting website generation...');
    console.log('📝 Business info:', businessInfo);
    console.log('🤖 Using model:', this.model);
    console.log('🌐 Ollama host:', this.ollama.host);
    
    try {
      const prompt = this.createWebsitePrompt(businessInfo);
      console.log('📋 Generated prompt length:', prompt.length);
      
      console.log('🔗 Attempting to connect to Ollama...');
      
      const response = await this.ollama.chat({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates simple, SEO-friendly websites for local service businesses including contractors, landscapers, auto repair shops, cleaning services, and other service providers. Always respond with valid HTML that includes proper meta tags, structured data, and mobile-responsive CSS.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      console.log('✅ Ollama response received');
      console.log('📄 Response length:', response.message.content.length);

      // Extract HTML from the response
      const htmlMatch = response.message.content.match(/```html\n([\s\S]*?)\n```/);
      const siteHtml = htmlMatch ? htmlMatch[1] : this.generateFallbackHtml(businessInfo);
      
      const reply = this.extractReplyText(response.message.content);

      console.log('🎉 Website generation complete!');
      return { reply, siteHtml };
    } catch (error) {
      console.error('❌ LLM Service Error:', error.message);
      console.error('📊 Error details:', error);
      console.log('🔄 Falling back to static HTML generation...');
      return this.generateFallbackResponse(businessInfo);
    }
  }

  /**
   * Create an optimized prompt for contractor website generation
   */
  createWebsitePrompt(businessInfo) {
    // Check if photos are mentioned in business info
    const hasPhotos = businessInfo.includes('Uploaded Photos');
    const photoMatches = businessInfo.match(/- Photo \d+: ([^(]+)/g);
    
    let photoInstructions = '';
    if (hasPhotos && photoMatches) {
      photoInstructions = `\n\nPHOTO INTEGRATION:
The business has uploaded ${photoMatches.length} photos that should be incorporated into the website:
${photoMatches.join('\n')}

For each photo, use the following HTML structure:
<picture class="responsive-image">
  <source srcset="/uploads/processed/[filename]-small.webp 400w, /uploads/processed/[filename]-medium.webp 800w, /uploads/processed/[filename]-large.webp 1200w" 
          sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px" 
          type="image/webp">
  <img src="/uploads/processed/[filename]-medium.jpg" 
       srcset="/uploads/processed/[filename]-small.jpg 400w, /uploads/processed/[filename]-medium.jpg 800w, /uploads/processed/[filename]-large.jpg 1200w"
       sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px"
       alt="Professional work by [business name]" 
       loading="lazy" 
       decoding="async">
</picture>

Place photos strategically:
- Hero/header photos: Use landscape orientation photos
- Gallery sections: Use all photos with proper grid layout
- Before/after: Use square or portrait photos
- Team photos: Use portrait orientation photos`;
    }

    return `Create a simple, professional website for a local service business with the following information:

${businessInfo}

Requirements:
1. Generate complete HTML with embedded CSS
2. Make it SEO-friendly with proper meta tags
3. Include structured data (JSON-LD) for local business
4. Make it mobile-responsive with fast loading
5. Use clean, professional styling with Google PageSpeed optimizations
6. Include sections for: Services, About, Contact, Service Areas
7. Add call-to-action buttons
8. Use professional colors appropriate for local service businesses (blues, grays, greens, professional tones)
9. Implement lazy loading for images and optimize for Core Web Vitals

${photoInstructions}

Please provide the complete HTML code wrapped in \`\`\`html code blocks, and then give a brief explanation of what you've created.

IMPORTANT: Include these essential elements:
- Hero header section with business name and tagline
- Contact form (name, email, phone, message fields)
- Photo gallery section with responsive images
- Service cards with icons or images
- Testimonials section
- Before/after gallery section for contractor work
- Multiple call-to-action buttons throughout
- Professional color scheme and modern styling
- Email collection for lead generation
- Responsive image CSS with srcset and WebP support
- Performance optimizations (lazy loading, proper sizing)`;
  }

  /**
   * Extract reply text from LLM response (everything outside HTML blocks)
   */
  extractReplyText(content) {
    // Remove HTML code blocks
    const withoutHtml = content.replace(/```html\n[\s\S]*?\n```/g, '');
    // Clean up and return the explanation
    return withoutHtml.trim() || 'I\'ve created a professional website preview for your business!';
  }

  /**
   * Generate fallback HTML when LLM fails
   */
  generateFallbackHtml(businessInfo) {
    // Simple extraction for fallback (similar to original pattern matching)
    const businessNameMatch = businessInfo.match(/business (is|name is|called) ([^,\n]+)/i);
    const servicesMatch = businessInfo.match(/services?: ([^,\n]+)/i);
    const locationsMatch = businessInfo.match(/location[s]?: ([^,\n]+)/i);
    const hoursMatch = businessInfo.match(/hours?: ([^,\n]+)/i);
    const contactMatch = businessInfo.match(/contact (is|:)? ([^,\n]+)/i);

    const businessName = businessNameMatch ? businessNameMatch[2].trim() : 'Your Business Name';
    const services = servicesMatch ? servicesMatch[1].trim() : 'Professional Services';
    const locations = locationsMatch ? locationsMatch[1].trim() : '';
    const hours = hoursMatch ? hoursMatch[1].trim() : 'Please contact us for hours';
    const contact = contactMatch ? contactMatch[2].trim() : 'Contact information';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${businessName} - ${services} serving ${locations}">
  <title>${businessName} | Local Service Professional</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    header { background: linear-gradient(135deg, #2c3e50, #3498db); color: white; padding: 2rem 0; text-align: center; }
    header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    header p { font-size: 1.2rem; opacity: 0.9; }
    .cta-button { display: inline-block; background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 10px 0; font-weight: bold; transition: background 0.3s; }
    .cta-button:hover { background: #c0392b; }
    .section { padding: 3rem 0; }
    .section:nth-child(even) { background: #f8f9fa; }
    h2 { color: #2c3e50; margin-bottom: 1.5rem; text-align: center; font-size: 2rem; }
    .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-top: 2rem; }
    .service-card { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center; }
    .contact-info { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center; }
    .contact-info h3 { color: #2c3e50; margin-bottom: 1rem; }
    @media (max-width: 768px) { header h1 { font-size: 2rem; } .services-grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <h1>${businessName}</h1>
      <p>${services}${locations ? ` • Serving ${locations}` : ''}</p>
      <a href="#contact" class="cta-button">Get Free Quote</a>
      <a href="tel:+1234567890" class="cta-button">Call Now</a>
    </div>
  </header>

  <section class="section">
    <div class="container">
      <h2>Our Services</h2>
      <div class="services-grid">
        ${services.split(',').map(service => `
          <div class="service-card">
            <h3>${service.trim()}</h3>
            <p>Professional ${service.trim().toLowerCase()} services with quality guaranteed.</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <h2>Why Choose Us?</h2>
      <div class="services-grid">
        <div class="service-card">
          <h3>Licensed & Insured</h3>
          <p>Fully licensed and insured for your peace of mind.</p>
        </div>
        <div class="service-card">
          <h3>Local Experts</h3>
          <p>We know the area and understand local requirements.</p>
        </div>
        <div class="service-card">
          <h3>Quality Guaranteed</h3>
          <p>We stand behind our work with satisfaction guarantee.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="contact">
    <div class="container">
      <h2>Contact Us Today</h2>
      <div class="contact-info">
        <h3>Get Your Free Estimate</h3>
        <p><strong>Business Hours:</strong> ${hours}</p>
        <p><strong>Contact:</strong> ${contact}</p>
        <a href="#" class="cta-button">Request Quote</a>
      </div>
    </div>
  </section>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "${businessName}",
    "description": "${services}",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "${locations}"
    }
  }
  </script>
</body>
</html>`;
  }

  /**
   * Generate fallback response when LLM is unavailable
   */
  generateFallbackResponse(businessInfo) {
    return {
      reply: "I've created a professional website preview for your business using our fallback system. For the best results, please ensure Ollama is running with a suitable model.",
      siteHtml: this.generateFallbackHtml(businessInfo)
    };
  }

  /**
   * Check if Ollama is available
   */
  async checkHealth() {
    try {
      const response = await this.ollama.list();
      return { healthy: true, models: response.models || [] };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }
}

module.exports = LLMService;