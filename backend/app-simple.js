// Simplified Express server for Local Service Business IDE
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');

// Only import existing services
const LLMRouter = require('./services/llmRouter');

const app = express();
const llmRouter = new LLMRouter();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Basic health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Local Service Business IDE is running' });
});

// Website generation endpoint
app.post('/api/generate-website', async (req, res) => {
    try {
        console.log('📨 Website generation request received');
        const { businessData, selectedAgent = 'grok' } = req.body;
        
        if (!businessData) {
            return res.status(400).json({ error: 'Business data is required' });
        }

        console.log(`🤖 Using AI Agent: ${selectedAgent}`);
        console.log('📋 Business Data:', businessData);

        // Create prompt for website generation
        const prompt = `Create a complete, professional HTML website for this local service business:

Business Name: ${businessData.businessName}
Services: ${businessData.services}
Service Area: ${businessData.serviceArea}
Phone: ${businessData.phone}
Email: ${businessData.email || 'Not provided'}
Hours: ${businessData.hours}

Requirements:
- Complete HTML with inline CSS and any needed JavaScript
- Mobile responsive design
- Professional appearance suitable for a local service business
- Include contact information prominently
- Add schema.org structured data for local business SEO
- Use modern, clean design principles
- Include a clear call-to-action
- Make it conversion-optimized

Generate the complete HTML code:`;

        const response = await llmRouter.callProvider(selectedAgent, prompt);
        
        if (response && response.content) {
            console.log('✅ Website generated successfully');
            res.json({ 
                success: true, 
                html: response.content,
                agent: selectedAgent 
            });
        } else {
            console.error('❌ No content in LLM response');
            res.status(500).json({ error: 'Failed to generate website content' });
        }

    } catch (error) {
        console.error('❌ Error generating website:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Chat endpoint for website editing
app.post('/api/chat', async (req, res) => {
    try {
        console.log('📨 Chat endpoint hit!');
        const { prompt, businessData, currentHtml, aiAgent = 'grok' } = req.body;
        
        console.log(`🤖 Using AI Agent: ${aiAgent}`);
        console.log(`💭 Prompt: ${prompt}`);

        // Create enhanced prompt for website editing
        const enhancedPrompt = `You are helping edit a website for ${businessData.businessName}. 

Current website HTML:
${currentHtml}

User request: ${prompt}

Please provide your response in this exact format:

EXPLANATION:
[Provide a clear explanation of what changes you're making and why]

HTML_START:
[Complete updated HTML code here]
HTML_END:

Make sure the HTML is complete, functional, and incorporates the requested changes while maintaining the professional design and SEO elements.`;

        const response = await llmRouter.callProvider(aiAgent, enhancedPrompt);
        
        if (response && response.content) {
            console.log('✅ Chat response generated successfully');
            res.json({ 
                success: true, 
                response: response.content,
                agent: aiAgent 
            });
        } else {
            console.error('❌ No content in chat response');
            res.status(500).json({ error: 'Failed to generate response' });
        }

    } catch (error) {
        console.error('❌ Error in chat:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve the main IDE page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/ide.html'));
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`🚀 Local Service Business IDE running on port ${PORT}`);
    console.log(`📊 Frontend available at: http://localhost:${PORT}`);
    console.log('🔧 LLM Router initialized with available providers');
});