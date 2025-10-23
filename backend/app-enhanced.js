// Enhanced Express server with AI integration
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');

// Import our simple LLM router
const LLMRouter = require('./services/simple-llmRouter');

const app = express();
const llmRouter = new LLMRouter();

// Helper function to extract HTML from AI response
function extractHtmlFromResponse(content) {
    if (!content) return null;
    
    // Look for HTML_START: and HTML_END: markers (primary method)
    const htmlStartMarker = 'HTML_START:';
    const htmlEndMarker = 'HTML_END:';
    
    let startIndex = content.indexOf(htmlStartMarker);
    let endIndex = content.indexOf(htmlEndMarker);
    
    if (startIndex !== -1 && endIndex !== -1) {
        // Extract content between markers
        let htmlContent = content.substring(startIndex + htmlStartMarker.length, endIndex).trim();
        
        // Remove code block markers if present
        htmlContent = htmlContent.replace(/^```html\s*/i, '').replace(/\s*```$/, '');
        
        return htmlContent;
    }
    
    // Look for ```html code blocks (secondary method)
    const codeBlockRegex = /```html\s*([\s\S]*?)\s*```/i;
    const codeBlockMatch = content.match(codeBlockRegex);
    
    if (codeBlockMatch && codeBlockMatch[1]) {
        return codeBlockMatch[1].trim();
    }
    
    // Look for DOCTYPE or html tags and extract complete HTML document
    const doctypeIndex = content.toLowerCase().indexOf('<!doctype');
    const htmlIndex = content.toLowerCase().indexOf('<html');
    
    if (doctypeIndex !== -1) {
        // Find the end of the HTML document
        const htmlEndIndex = content.toLowerCase().lastIndexOf('</html>');
        if (htmlEndIndex !== -1) {
            return content.substring(doctypeIndex, htmlEndIndex + 7).trim();
        }
        // If no closing html tag, take from DOCTYPE to end
        return content.substring(doctypeIndex).trim();
    }
    
    if (htmlIndex !== -1) {
        // Find the end of the HTML document
        const htmlEndIndex = content.toLowerCase().lastIndexOf('</html>');
        if (htmlEndIndex !== -1) {
            return content.substring(htmlIndex, htmlEndIndex + 7).trim();
        }
        // If no closing html tag, take from html tag to end
        return content.substring(htmlIndex).trim();
    }
    
    return null;
}

// Helper function to extract explanation from AI response
function extractExplanationFromResponse(content) {
    if (!content) return null;
    
    // Look for EXPLANATION: marker
    const explanationMarker = 'EXPLANATION:';
    const explanationIndex = content.indexOf(explanationMarker);
    
    if (explanationIndex !== -1) {
        // Find where explanation ends (look for HTML markers or code blocks)
        const htmlStartMarker = 'HTML_START:';
        const codeBlockMarker = '```html';
        const doctypeMarker = '<!DOCTYPE';
        const htmlTagMarker = '<html';
        
        let endIndex = content.length;
        
        // Check for various end markers
        const htmlStartIndex = content.indexOf(htmlStartMarker, explanationIndex);
        const codeBlockIndex = content.indexOf(codeBlockMarker, explanationIndex);
        const doctypeIndex = content.indexOf(doctypeMarker, explanationIndex);
        const htmlTagIndex = content.indexOf(htmlTagMarker, explanationIndex);
        
        // Use the earliest found marker as the end of explanation
        if (htmlStartIndex !== -1) endIndex = Math.min(endIndex, htmlStartIndex);
        if (codeBlockIndex !== -1) endIndex = Math.min(endIndex, codeBlockIndex);
        if (doctypeIndex !== -1) endIndex = Math.min(endIndex, doctypeIndex);
        if (htmlTagIndex !== -1) endIndex = Math.min(endIndex, htmlTagIndex);
        
        return content.substring(explanationIndex + explanationMarker.length, endIndex).trim();
    }
    
    // If no EXPLANATION: marker but response starts with explanation text and has HTML later
    const codeBlockIndex = content.indexOf('```html');
    const doctypeIndex = content.toLowerCase().indexOf('<!doctype');
    const htmlTagIndex = content.toLowerCase().indexOf('<html');
    
    let earliestHtmlIndex = -1;
    if (codeBlockIndex !== -1) earliestHtmlIndex = codeBlockIndex;
    if (doctypeIndex !== -1) {
        earliestHtmlIndex = earliestHtmlIndex === -1 ? doctypeIndex : Math.min(earliestHtmlIndex, doctypeIndex);
    }
    if (htmlTagIndex !== -1) {
        earliestHtmlIndex = earliestHtmlIndex === -1 ? htmlTagIndex : Math.min(earliestHtmlIndex, htmlTagIndex);
    }
    
    if (earliestHtmlIndex > 50) { // Only if there's substantial text before HTML
        return content.substring(0, earliestHtmlIndex).trim();
    }
    
    return null;
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Basic health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Local Service Business IDE is running with AI support!' });
});

// Website generation endpoint
app.post('/api/generate-website', async (req, res) => {
    try {
        console.log('Website generation request received');
        const { businessData, selectedAgent = 'grok' } = req.body;
        
        if (!businessData) {
            return res.status(400).json({ error: 'Business data is required' });
        }

        console.log(`Using AI Agent: ${selectedAgent}`);
        console.log('Business Data:', businessData);

        // Create comprehensive prompt for website generation
        const prompt = `Create a complete, professional HTML website for this local service business:

Business Name: ${businessData.businessName}
Services: ${businessData.services}
Service Area: ${businessData.serviceArea}
Phone: ${businessData.phone}
Email: ${businessData.email || 'Not provided'}
Hours: ${businessData.hours}

Requirements:
- Complete HTML document with inline CSS and any needed JavaScript
- Mobile responsive design with modern, clean aesthetics
- Professional appearance suitable for a local service business
- Include contact information prominently displayed
- Add schema.org structured data for local business SEO
- Use modern design principles with good typography
- Include clear call-to-action buttons
- Make it conversion-optimized for local customers
- Use appropriate colors and layout for the service type
- Include sections for: header, services, about, contact, footer
- IMPORTANT: Use anchor navigation (href="#services", "#about", "#contact") for single-page navigation
- IMPORTANT: Add smooth scrolling CSS: html { scroll-behavior: smooth; }
- IMPORTANT: Include a subtle footer credit "Powered by Connectedism" with link to https://connectedism.com - style it discretely but visibly
- IMPORTANT: Include HTML comment in head: <!-- Generated by Connectedism - AI-powered website builder - https://connectedism.com -->
- IMPORTANT: Include meta tag: <meta name="generator" content="Connectedism AI Website Builder">

Generate ONLY the complete HTML code with no additional text or explanations:`;

        let response;
        try {
            response = await llmRouter.callProvider(selectedAgent, prompt);
        } catch (error) {
            console.log('AI provider error:', error.message);
            
            // Instead of using mock, provide helpful error message
            const errorResponse = {
                success: false,
                error: `AI Provider Error: ${error.message}`,
                troubleshooting: [
                    "Check if your API keys are properly configured in the .env file",
                    "Verify your API provider quotas and billing status",
                    "Try a different AI provider from the dropdown",
                    "Check your internet connection"
                ],
                businessData: businessData // Return the business data for retry
            };
            
            return res.status(500).json(errorResponse);
        }
        
        if (response && response.content) {
            console.log('Website generated successfully');
            
            // Extract HTML from the AI response
            const extractedHtml = extractHtmlFromResponse(response.content);
            
            if (extractedHtml) {
                res.json({ 
                    success: true, 
                    html: extractedHtml,
                    agent: selectedAgent,
                    provider: response.provider
                });
            } else {
                // If no HTML found, return the raw content and let frontend handle it
                res.json({ 
                    success: true, 
                    html: response.content,
                    agent: selectedAgent,
                    provider: response.provider,
                    rawResponse: true
                });
            }
        } else {
            console.error('No content in response');
            res.status(500).json({ error: 'Failed to generate website content' });
        }

    } catch (error) {
        console.error('Error generating website:', error);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});

// Chat endpoint for website editing
app.post('/api/chat', async (req, res) => {
    try {
        console.log('Chat endpoint hit!');
        const { prompt, businessData, currentHtml, aiAgent = 'grok' } = req.body;
        
        console.log(`Using AI Agent: ${aiAgent}`);
        console.log(`Prompt: ${prompt}`);

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

Make sure the HTML is complete, functional, and incorporates the requested changes while maintaining the professional design and SEO elements. IMPORTANT: Always preserve the "Powered by Connectedism" footer credit link unless specifically asked to remove it. If asked to remove the visible branding, you should remove the footer link but ALWAYS maintain these hidden elements: the HTML comment "<!-- Generated by Connectedism - AI-powered website builder - https://connectedism.com -->" in the head and the meta tag "<meta name=\"generator\" content=\"Connectedism AI Website Builder\">" for licensing purposes.`;

        let response;
        try {
            response = await llmRouter.callProvider(aiAgent, enhancedPrompt);
        } catch (error) {
            console.log('AI provider error for chat:', error.message);
            
            // Provide helpful error message instead of mock response
            const errorMessage = `**AI Provider Issue**: ${error.message}

**Troubleshooting Steps:**
• Check if API keys are configured in the .env file
• Verify API provider quotas and billing status  
• Try switching to a different AI provider
• Check network connectivity

**Available Actions:**
• Switch to another AI agent using the dropdown below
• Try your request again after checking the above
• Contact support if the issue persists

The business information you entered is saved, so you can retry without re-entering it.`;

            return res.json({ 
                success: true, 
                response: errorMessage,
                agent: aiAgent,
                provider: 'Error Handler',
                isError: true
            });
        }
        
        if (response && response.content) {
            console.log('Chat response generated successfully');
            console.log('Response content preview:', response.content.substring(0, 200) + '...');
            
            // Extract HTML and explanation from the response
            const extractedHtml = extractHtmlFromResponse(response.content);
            const explanation = extractExplanationFromResponse(response.content);
            
            console.log('Extracted HTML length:', extractedHtml ? extractedHtml.length : 0);
            console.log('Extracted explanation length:', explanation ? explanation.length : 0);
            
            if (extractedHtml) {
                // This is a website update with HTML
                console.log('Sending HTML update to frontend');
                res.json({ 
                    success: true, 
                    html: extractedHtml,
                    message: explanation || 'Website updated successfully!',
                    agent: aiAgent,
                    provider: response.provider,
                    isWebsiteUpdate: true
                });
            } else {
                // This is a regular chat response
                console.log('Sending regular chat response to frontend');
                res.json({ 
                    success: true, 
                    response: response.content,
                    agent: aiAgent,
                    provider: response.provider
                });
            }
        } else {
            console.error('No content in chat response');
            res.status(500).json({ error: 'Failed to generate response' });
        }

    } catch (error) {
        console.error('Error in chat:', error);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});

// Test AI connection endpoint with detailed diagnostics
app.get('/api/test-ai', async (req, res) => {
    try {
        const testPrompt = "Hello! Please respond with 'AI connection successful!'";
        const results = {};
        
        // Test each provider individually with detailed error information
        for (const provider of ['grok', 'claude', 'gpt-4', 'gemini']) {
            try {
                console.log(`Testing ${provider}...`);
                const response = await llmRouter.callProvider(provider, testPrompt);
                results[provider] = { 
                    status: 'success', 
                    provider: response.provider,
                    response: response.content?.substring(0, 100) + '...' // Show first 100 chars
                };
                console.log(`✓ ${provider} working`);
            } catch (error) {
                console.log(`✗ ${provider} failed: ${error.message}`);
                results[provider] = { 
                    status: 'error', 
                    error: error.message,
                    apiKey: llmRouter.providers[provider]?.apiKey ? 'Present' : 'Missing',
                    endpoint: llmRouter.providers[provider]?.endpoint || 'Unknown'
                };
            }
        }
        
        // Also check environment variables
        const envCheck = {
            GROK_API_KEY: process.env.GROK_API_KEY ? 'Present' : 'Missing',
            CLAUDE_API_KEY: process.env.CLAUDE_API_KEY ? 'Present' : 'Missing', 
            OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'Present' : 'Missing',
            GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'Present' : 'Missing'
        };
        
        res.json({ 
            results,
            environment: envCheck,
            timestamp: new Date().toISOString(),
            recommendations: generateRecommendations(results, envCheck)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Helper function to generate recommendations based on test results
function generateRecommendations(results, envCheck) {
    const recommendations = [];
    
    Object.entries(results).forEach(([provider, result]) => {
        if (result.status === 'error') {
            if (result.apiKey === 'Missing') {
                recommendations.push(`Add ${provider.toUpperCase()}_API_KEY to your .env file`);
            } else if (result.error.includes('404')) {
                recommendations.push(`Check ${provider} endpoint URL - may need updating`);
            } else if (result.error.includes('401') || result.error.includes('403')) {
                recommendations.push(`Verify ${provider} API key is valid and has proper permissions`);
            } else if (result.error.includes('quota') || result.error.includes('limit')) {
                recommendations.push(`${provider} API quota exceeded - check billing or wait for reset`);
            } else {
                recommendations.push(`${provider} connection issue - check network and endpoint`);
            }
        }
    });
    
    if (recommendations.length === 0) {
        recommendations.push('All API providers are working correctly!');
    }
    
    return recommendations;
}

// Serve the main IDE page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Keep the old IDE available at /ide
app.get('/ide', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/ide.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Local Service Business IDE running on port ${PORT}`);
    console.log(`Frontend available at: http://localhost:${PORT}`);
    console.log(`AI endpoints ready (add API keys to .env for full functionality)`);
    console.log(`Test AI connection at: http://localhost:${PORT}/api/test-ai`);
});