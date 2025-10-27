import React, { useState, useRef, useEffect } from 'react';
import PhotoUpload from './PhotoUpload';

// Guided prompts for contractors
const GUIDED_PROMPTS = [
  {
    id: 'welcome',
    title: '✨ Build Your Professional Website in Minutes',
    message: `Hi! I'm here to help you create a professional, SEO-optimized website for your local service business. 

Our AI assistant will guide you through the process - just answer a few simple questions about your business!

🎯 SEO Optimized • 📱 Mobile Ready • ⚡ Fast Loading • 💰 Completely Free

This will only take a few minutes and you'll have a professional website ready to go!`,
    type: 'info',
    nextPrompt: 'business-name'
  },
  {
    id: 'business-name',
    title: 'What\'s your business name?',
    message: 'Let\'s start with the basics. What\'s the name of your local service business?',
    placeholder: 'e.g., Smith Plumbing & Heating, ABC Landscaping Services, City Auto Repair',
    type: 'input',
    seoTip: 'Including your location in the business name can help with local SEO!',
    nextPrompt: 'services'
  },
  {
    id: 'services',
    title: 'What services do you offer?',
    message: 'Tell me about the main services you provide. Be specific!',
    placeholder: 'e.g., Emergency plumbing, bathroom remodeling, drain cleaning, water heater installation',
    type: 'textarea',
    seoTip: 'List specific services that people search for, like "emergency plumbing" or "bathroom remodeling"',
    examples: [
      'Emergency plumbing, bathroom remodeling, drain cleaning',
      'Roofing repairs, gutter installation, roof replacement',
      'HVAC installation, AC repair, heating maintenance',
      'Electrical repairs, panel upgrades, lighting installation',
      'Lawn care, landscaping, tree trimming, garden design',
      'Auto repair, oil changes, brake service, engine diagnostics'
    ],
    nextPrompt: 'location'
  },
  {
    id: 'location',
    title: 'Where do you serve customers?',
    message: 'What areas or cities do you serve? This helps customers find you!',
    placeholder: 'e.g., Seattle, Bellevue, Redmond and surrounding areas',
    type: 'input',
    seoTip: 'Mentioning specific cities and neighborhoods helps you appear in local searches',
    nextPrompt: 'contact'
  },
  {
    id: 'contact',
    title: 'How can customers reach you?',
    message: 'Provide your phone number and any other contact information.',
    placeholder: 'e.g., (555) 123-4567, info@smithplumbing.com',
    type: 'input',
    seoTip: 'A local phone number builds trust and helps with local SEO rankings',
    nextPrompt: 'hours'
  },
  {
    id: 'hours',
    title: 'When are you available?',
    message: 'What are your business hours? Include if you offer emergency services.',
    placeholder: 'e.g., Mon-Fri 8AM-6PM, Emergency services 24/7',
    type: 'input',
    seoTip: 'Mentioning 24/7 or emergency availability can help you stand out',
    nextPrompt: 'experience'
  },
  {
    id: 'experience',
    title: 'Tell us about your experience',
    message: 'How long have you been in business? Any certifications or special qualifications?',
    placeholder: 'e.g., 15+ years experience, licensed and insured, BBB A+ rating',
    type: 'textarea',
    seoTip: 'Experience and credentials build trust and can improve your search rankings',
    nextPrompt: 'photos'
  },
  {
    id: 'photos',
    title: '📸 Upload Your Photos (Optional)',
    message: 'Upload photos of your work, team, or business to make your website more engaging! Photos are automatically optimized for fast loading.',
    type: 'photos',
    seoTip: 'High-quality photos of your work build trust and can improve conversion rates',
    nextPrompt: 'generate',
    optional: true
  },
  {
    id: 'editing',
    title: 'Continue Editing Your Website',
    message: 'What would you like to change or improve on your website?',
    placeholder: 'e.g., Add a contact form, include photo gallery, change colors, add testimonials',
    type: 'textarea',
    seoTip: 'Iterative improvements help create the perfect website for your business!'
  }
];

const SEO_TIPS = [
  'Add customer reviews and testimonials to build trust',
  'Include before/after photos of your work',
  'Create a Google My Business profile',
  'Ask satisfied customers to leave reviews',
  'Use your city name throughout your content',
  'Add a FAQ section with common questions',
  'Include your license numbers if applicable',
  'Mention insurance and bonding status'
];

function GuidedChatBox({ setSiteHtml }) {
  const [currentPrompt, setCurrentPrompt] = useState('welcome');
  const [responses, setResponses] = useState({});
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSeoTips, setShowSeoTips] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const messagesEndRef = useRef(null);

  const currentPromptData = GUIDED_PROMPTS.find(p => p.id === currentPrompt);
  const progress = GUIDED_PROMPTS.findIndex(p => p.id === currentPrompt);
  const totalPrompts = GUIDED_PROMPTS.length - 1; // Excluding welcome

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      const welcomePrompt = GUIDED_PROMPTS[0];
      setMessages([{ 
        bot: welcomePrompt.message, 
        type: 'info',
        title: welcomePrompt.title 
      }]);
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handlePhotosUploaded = (newPhotos) => {
    console.log('📸 Photos uploaded:', newPhotos);
    setUploadedPhotos(prev => [...prev, ...newPhotos]);
    
    // Add confirmation message
    setMessages(prev => [
      ...prev,
      { 
        bot: `✅ Great! Uploaded ${newPhotos.length} photo${newPhotos.length > 1 ? 's' : ''}. These will be optimized and included in your website.`,
        type: 'success'
      }
    ]);
  };

  const handleSkipPhotos = () => {
    console.log('🔄 Skipping photo upload...');
    setMessages(prev => [
      ...prev,
      { user: 'Skip photos for now' },
      { 
        bot: "No problem! You can always add photos later. Let's generate your website now!",
        type: 'info'
      }
    ]);
    setTimeout(() => generateWebsite(), 1500);
  };

  const handleGenerateWithPhotos = () => {
    console.log('🎯 Generating website with photos...');
    setMessages(prev => [
      ...prev,
      { 
        bot: `Perfect! I'll create your website now${uploadedPhotos.length > 0 ? ` with your ${uploadedPhotos.length} uploaded photo${uploadedPhotos.length > 1 ? 's' : ''}` : ''}.`,
        type: 'info'
      }
    ]);
    setTimeout(() => generateWebsite(), 1500);
  };

  const handleContinue = async () => {
    console.log('🔄 Continue button clicked, current prompt:', currentPrompt);
    
    if (currentPrompt === 'welcome') {
      moveToNext();
      return;
    }

    if (!input.trim()) return;

    // Save response
    const updatedResponses = {
      ...responses,
      [currentPrompt]: input
    };
    setResponses(updatedResponses);
    console.log('💾 Saved responses:', updatedResponses);

    // Add user message
    setMessages(prev => [
      ...prev,
      { user: input }
    ]);

    // Add SEO tip if available
    if (currentPromptData.seoTip) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          bot: `✅ Great! ${currentPromptData.seoTip}`, 
          type: 'tip' 
        }]);
      }, 500);
    }

    setInput('');

    // Move to next step first
    if (currentPrompt === 'experience') {
      console.log('🎯 Moving to photo upload step...');
      setTimeout(() => moveToNext(), 1000);
    } else if (currentPrompt === 'editing') {
      // Handle editing requests
      console.log('🎨 Processing editing request...');
      setTimeout(() => processEditingRequest(input), 1000);
    } else {
      // Move to next step and potentially show preview update
      setTimeout(() => {
        moveToNext();
        
        // Show progressive preview updates for key steps
        if (['business-name', 'services'].includes(currentPrompt)) {
          updatePreview(updatedResponses);
        }
      }, 1000);
    }
  };

  const moveToNext = () => {
    const nextPromptId = currentPromptData.nextPrompt;
    if (nextPromptId && nextPromptId !== 'generate') {
      setCurrentPrompt(nextPromptId);
      const nextPromptData = GUIDED_PROMPTS.find(p => p.id === nextPromptId);
      setMessages(prev => [...prev, { 
        bot: nextPromptData.message, 
        type: 'question',
        title: nextPromptData.title 
      }]);
    }
  };

  const updatePreview = async (currentResponses) => {
    // Only show preview if we have business name and services
    if (!currentResponses['business-name'] || !currentResponses.services) return;
    
    console.log('🔄 Updating preview with partial data...');
    
    const partialDescription = `Business Name: ${currentResponses['business-name']}
Services: ${currentResponses.services}
Service Areas: ${currentResponses.location || 'Local area'}
Contact: ${currentResponses.contact || 'Contact information'}
Hours: ${currentResponses.hours || 'Business hours available'}
Experience: ${currentResponses.experience || 'Professional service provider'}`;

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: partialDescription })
      });
      
      const data = await res.json();
      if (data.siteHtml) {
        console.log('🌟 Progressive preview updated!');
        setSiteHtml(data.siteHtml);
      }
    } catch (error) {
      console.log('⚠️ Preview update failed, continuing...');
    }
  };

  const processEditingRequest = async (editRequest) => {
    console.log('🎨 Processing edit request:', editRequest);
    setIsGenerating(true);
    
    setMessages(prev => [...prev, { 
      bot: `Great idea! Let me update your website with: ${editRequest}`, 
      type: 'generating' 
    }]);

    // Create enhanced prompt with current business info + edit request
    const enhancedPrompt = `Please improve this website for ${responses['business-name'] || 'this business'}:

Current Business Info:
- Business: ${responses['business-name'] || 'Local Service Business'}
- Services: ${responses.services || 'Professional services'}
- Location: ${responses.location || 'Local area'}
- Contact: ${responses.contact || 'Contact information'}
- Hours: ${responses.hours || 'Business hours'}
- Experience: ${responses.experience || 'Professional experience'}

IMPROVEMENT REQUEST: ${editRequest}

Please create an enhanced website that includes this improvement. Make sure to include:
- Contact forms if requested
- Photo gallery sections if requested
- Enhanced styling and visual appeal
- Professional header sections
- Call-to-action elements
- Any other requested features`;

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: enhancedPrompt })
      });
      
      const data = await res.json();
      
      if (data.siteHtml) {
        console.log('✅ Website updated with improvements!');
        setSiteHtml(data.siteHtml);
        setMessages(prev => [...prev, { 
          bot: `Perfect! I've updated your website with: ${editRequest}. What else would you like to improve?`, 
          type: 'success' 
        }]);
      }
    } catch (error) {
      console.error('❌ Edit request failed:', error);
      setMessages(prev => [...prev, { 
        bot: 'Sorry, I had trouble making that change. Please try again with a different request.', 
        type: 'warning' 
      }]);
    }

    setIsGenerating(false);
    setInput('');
  };

  const generateWebsite = async () => {
    console.log('🚀 Starting website generation via guided flow...');
    setIsGenerating(true);
    setMessages(prev => [...prev, { 
      bot: 'Perfect! Let me create your professional website now. This will take just a moment...', 
      type: 'generating' 
    }]);

    // Compile all responses into a comprehensive business description
    let businessDescription = `Business Name: ${responses['business-name'] || 'My Business'}
Services: ${responses.services || 'Professional services'}
Service Areas: ${responses.location || 'Local area'}
Contact: ${responses.contact || 'Contact information'}
Hours: ${responses.hours || 'Standard business hours'}
Experience: ${responses.experience || 'Professional contractor'}`;

    // Add photo information if available
    if (uploadedPhotos.length > 0) {
      businessDescription += `\n\nUploaded Photos (${uploadedPhotos.length} total):`;
      uploadedPhotos.forEach((photo, index) => {
        businessDescription += `\n- Photo ${index + 1}: ${photo.originalName}`;
        if (photo.analysis) {
          businessDescription += ` (${photo.analysis.dimensions}, suitable for: ${photo.analysis.suitableFor?.join(', ')})`;
        }
      });
      businessDescription += `\n\nPlease incorporate these photos into the website design with proper optimization, responsive sizing, and appropriate placement based on their characteristics.`;
    }

    console.log('📝 Compiled business description:', businessDescription);

    try {
      console.log('📡 Sending guided flow request to backend...');
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: businessDescription })
      });
      
      console.log('📨 Guided flow response status:', res.status);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('📄 Guided flow response data:', data);
      console.log('📏 Response reply length:', data.reply?.length || 0);
      console.log('🌐 Response HTML length:', data.siteHtml?.length || 0);
      
      setMessages(prev => [...prev, { 
        bot: data.reply || 'Your professional website is ready!', 
        type: 'success' 
      }]);
      
      if (data.siteHtml && data.siteHtml.length > 0) {
        console.log('✅ Website HTML received from guided flow, setting...');
        setSiteHtml(data.siteHtml);
        console.log('� setSiteHtml called successfully!');
      } else {
        console.log('❌ No valid siteHtml in guided flow response');
        console.log('🔄 Generating fallback HTML...');
        const fallbackHtml = generateFallbackWebsite(responses);
        setSiteHtml(fallbackHtml);
      }
    } catch (error) {
      console.error('❌ Guided flow error:', error);
      setMessages(prev => [...prev, { 
        bot: 'I had trouble connecting to generate your website, but I\'ve created a basic version for you!', 
        type: 'warning' 
      }]);
      
      // Generate fallback HTML
      const fallbackHtml = generateFallbackWebsite(responses);
      console.log('🔄 Using fallback HTML from error, length:', fallbackHtml.length);
      setSiteHtml(fallbackHtml);
    }

    setIsGenerating(false);
    setShowSeoTips(true);
    
    // Enable continued editing after initial generation
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        bot: '✨ Your website is ready! You can now ask me to make changes like:\n\n• "Add a contact form"\n• "Include more photos sections"\n• "Add testimonials"\n• "Change the colors"\n• "Add more services"\n\nJust tell me what you\'d like to improve!', 
        type: 'info',
        title: 'Continue Editing Your Website'
      }]);
      setCurrentPrompt('editing');
    }, 2000);
    
    console.log('🏁 Website generation process completed');
  };

  const generateFallbackWebsite = (responses) => {
    const businessName = responses['business-name'] || 'Your Business';
    const services = responses.services || 'Professional Services';
    const location = responses.location || 'Local Area';
    const contact = responses.contact || 'Contact Us';
    const hours = responses.hours || 'Business Hours Available';
    const experience = responses.experience || 'Professional contractor with quality service';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${businessName} - ${services} serving ${location}. ${experience}">
  <title>${businessName} | Professional Contractor Services</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 3rem 0; text-align: center; }
    header h1 { font-size: 3rem; margin-bottom: 1rem; }
    header p { font-size: 1.3rem; opacity: 0.9; margin-bottom: 2rem; }
    .cta-buttons a { display: inline-block; background: #ef4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 0 10px; font-weight: bold; transition: all 0.3s; }
    .cta-buttons a:hover { background: #dc2626; transform: translateY(-2px); }
    .section { padding: 4rem 0; }
    .section:nth-child(even) { background: #f8fafc; }
    h2 { color: #1e40af; margin-bottom: 2rem; text-align: center; font-size: 2.5rem; }
    .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem; }
    .service-card { background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); text-align: center; transition: transform 0.3s; }
    .service-card:hover { transform: translateY(-5px); }
    .contact-section { background: #1e40af; color: white; text-align: center; }
    .contact-card { background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 12px; }
    @media (max-width: 768px) { header h1 { font-size: 2rem; } .services-grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <h1>${businessName}</h1>
      <p>${services}</p>
      <p>Serving ${location}</p>
      <div class="cta-buttons">
        <a href="tel:+1234567890">Call Now</a>
        <a href="#contact">Get Free Quote</a>
      </div>
    </div>
  </header>

  <section class="section">
    <div class="container">
      <h2>Our Services</h2>
      <div class="services-grid">
        ${services.split(',').map(service => `
          <div class="service-card">
            <h3>${service.trim()}</h3>
            <p>Professional ${service.trim().toLowerCase()} with guaranteed quality and customer satisfaction.</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <h2>Why Choose ${businessName}?</h2>
      <div class="services-grid">
        <div class="service-card">
          <h3>Licensed & Insured</h3>
          <p>Fully licensed and insured for your complete peace of mind.</p>
        </div>
        <div class="service-card">
          <h3>Local Experts</h3>
          <p>We know ${location} and understand local building codes and requirements.</p>
        </div>
        <div class="service-card">
          <h3>Quality Guaranteed</h3>
          <p>${experience}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section contact-section" id="contact">
    <div class="container">
      <h2>Contact Us Today</h2>
      <div class="contact-card">
        <h3>Ready to Get Started?</h3>
        <p><strong>Contact:</strong> ${contact}</p>
        <p><strong>Hours:</strong> ${hours}</p>
        <p><strong>Service Area:</strong> ${location}</p>
        <div class="cta-buttons" style="margin-top: 2rem;">
          <a href="tel:+1234567890">Call Now</a>
          <a href="mailto:info@business.com">Email Us</a>
        </div>
      </div>
    </div>
  </section>
</body>
</html>`;
  };

  const useExample = (example) => {
    setInput(example);
  };

  const progressPercentage = Math.round((progress / totalPrompts) * 100);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Progress Bar */}
      {currentPrompt !== 'welcome' && !showSeoTips && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
              Step {progress} of {totalPrompts}
            </span>
            <span style={{ fontSize: '14px', color: '#64748b' }}>
              {progressPercentage}% Complete
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${progressPercentage}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
                transition: 'width 0.5s ease' 
              }} 
            />
          </div>
        </div>
      )}

      {/* Chat Messages Area */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        marginBottom: '16px', 
        minHeight: 0,
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '20px' }}>
            {msg.user && (
              <div style={{ 
                background: '#f1f5f9',
                padding: '16px 20px',
                borderRadius: '16px',
                marginBottom: '8px',
                marginLeft: '40px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: '500' }}>You</div>
                <div style={{ color: '#334155', fontSize: '15px' }}>{msg.user}</div>
              </div>
            )}
              {msg.bot && (
                <div style={{ 
                  background: msg.type === 'tip' ? '#dcfce7' : 
                            msg.type === 'warning' ? '#fef3c7' :
                            msg.type === 'success' ? '#dcfce7' :
                            msg.type === 'generating' ? '#dbeafe' : '#f8fafc',
                  color: msg.type === 'tip' ? '#166534' :
                         msg.type === 'warning' ? '#92400e' :
                         msg.type === 'success' ? '#166534' :
                         msg.type === 'generating' ? '#1e40af' : '#334155',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  marginRight: '40px',
                  border: '1px solid #e2e8f0'
                }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: msg.type === 'tip' ? '#22c55e' :
                         msg.type === 'warning' ? '#f59e0b' :
                         msg.type === 'success' ? '#22c55e' :
                         msg.type === 'generating' ? '#3b82f6' : '#64748b', 
                  marginBottom: '6px', 
                  fontWeight: '500' 
                }}>
                  {msg.type === 'tip' ? '💡 SEO Tip' :
                   msg.type === 'warning' ? '⚠️ Notice' :
                   msg.type === 'success' ? '✅ Complete' :
                   msg.type === 'generating' ? '🔄 Generating...' : 'AI Assistant'}
                </div>
                {msg.title && (
                  <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '8px' }}>
                    {msg.title}
                  </div>
                )}
                <div style={{ fontSize: '15px', lineHeight: '1.5' }}>{msg.bot}</div>
              </div>
            )}
          </div>
        ))}
        
        {/* SEO Tips Section */}
        {showSeoTips && (
          <div style={{ 
            background: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '20px'
          }}>
            <h3 style={{ color: '#0c4a6e', marginBottom: '16px', fontSize: '18px' }}>
              🚀 SEO Tips to Boost Your Website
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {SEO_TIPS.map((tip, i) => (
                <div key={i} style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  color: '#0f172a',
                  fontSize: '14px'
                }}>
                  <span style={{ color: '#0ea5e9', marginRight: '8px', fontWeight: 'bold' }}>•</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      {(currentPrompt === 'editing' || !showSeoTips) && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {currentPrompt === 'welcome' ? (
            <button 
              onClick={handleContinue}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Let's Get Started! 🚀
            </button>
          ) : (
            <>
              {currentPromptData.type === 'photos' ? (
                <PhotoUpload 
                  onPhotosUploaded={handlePhotosUploaded}
                  uploadedPhotos={uploadedPhotos}
                />
              ) : currentPromptData.type === 'textarea' ? (
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  rows={3}
                  style={{ 
                    padding: '16px', 
                    borderRadius: '12px', 
                    border: '2px solid #e2e8f0', 
                    resize: 'vertical', 
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  placeholder={currentPromptData.placeholder}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              ) : (
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  style={{ 
                    padding: '16px', 
                    borderRadius: '12px', 
                    border: '2px solid #e2e8f0', 
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  placeholder={currentPromptData.placeholder}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  onKeyPress={(e) => e.key === 'Enter' && handleContinue()}
                />
              )}
              
              {/* Examples */}
              {currentPromptData.examples && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                    Quick examples:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {currentPromptData.examples.map((example, i) => (
                      <button
                        key={i}
                        onClick={() => useExample(example)}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          color: '#475569',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = '#e2e8f0';
                          e.target.style.borderColor = '#3b82f6';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = '#f8fafc';
                          e.target.style.borderColor = '#e2e8f0';
                        }}
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Continue/Action Buttons */}
              {currentPromptData.type === 'photos' ? (
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button 
                    onClick={handleSkipPhotos}
                    disabled={isGenerating}
                    style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '14px 20px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: isGenerating ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      flex: 1
                    }}
                  >
                    Skip Photos
                  </button>
                  <button 
                    onClick={handleGenerateWithPhotos}
                    disabled={isGenerating}
                    style={{
                      background: isGenerating ? '#e2e8f0' : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                      color: isGenerating ? '#94a3b8' : 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '14px 20px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: isGenerating ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      flex: 2
                    }}
                  >
                    {isGenerating ? 'Generating...' : 'Create My Website! 🎉'}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleContinue}
                  disabled={!input.trim() || isGenerating}
                  style={{
                    background: !input.trim() || isGenerating ? '#e2e8f0' : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                    color: !input.trim() || isGenerating ? '#94a3b8' : 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 24px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: !input.trim() || isGenerating ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    marginTop: '16px',
                    alignSelf: 'flex-end'
                  }}
                  onMouseOver={(e) => {
                    if (input.trim() && !isGenerating) {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {isGenerating ? 'Generating...' : 'Continue'}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default GuidedChatBox;