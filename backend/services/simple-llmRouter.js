// Simple LLM Router with API key support
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const axios = require('axios');

class LLMRouter {
    constructor() {
        this.providers = {
            grok: {
                name: 'Grok-3 Latest',
                endpoint: 'https://api.x.ai/v1/chat/completions',
                apiKey: process.env.GROK_API_KEY,
                model: 'grok-3' // Updated from deprecated grok-beta
            },
            claude: {
                name: 'Claude 3.5 Haiku',
                endpoint: 'https://api.anthropic.com/v1/messages',
                apiKey: process.env.CLAUDE_API_KEY, // Updated to match .env file
                model: 'claude-3-5-haiku-20241022' // Match the .env file model
            },
            'gpt-4': {
                name: 'GPT-4o 2024-08-06',
                endpoint: 'https://api.openai.com/v1/chat/completions',
                apiKey: process.env.OPENAI_API_KEY,
                model: 'gpt-4o'
            },
            gemini: {
                name: 'Gemini 2.0 Flash',
                endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
                apiKey: process.env.GEMINI_API_KEY,
                model: 'gemini-2.0-flash'
            }
        };

        console.log('LLM Router initialized');
        this.checkAvailableProviders();
    }

    checkAvailableProviders() {
        const available = [];
        for (const [key, provider] of Object.entries(this.providers)) {
            if (provider.apiKey) {
                available.push(provider.name);
            }
        }
        console.log(`Available providers: ${available.length > 0 ? available.join(', ') : 'None (add API keys to .env)'}`);
    }

    async callProvider(providerKey, prompt, imageData = null) {
        const provider = this.providers[providerKey];
        
        if (!provider) {
            throw new Error(`Unknown provider: ${providerKey}. Available providers: ${Object.keys(this.providers).join(', ')}`);
        }

        if (!provider.apiKey) {
            throw new Error(`No API key found for ${provider.name}. Please add ${this.getApiKeyName(providerKey)} to your .env file.`);
        }

        console.log(`Calling ${provider.name}...`);

        try {
            if (providerKey === 'claude') {
                return await this.callClaude(prompt, provider, imageData);
            } else if (providerKey === 'gemini') {
                return await this.callGemini(prompt, provider, imageData);
            } else {
                return await this.callOpenAIStyle(prompt, provider, imageData);
            }
        } catch (error) {
            // Don't fall back to mock - throw the actual error for better debugging
            const errorMessage = error.response ? 
                `${provider.name} API Error: ${error.response.status} - ${error.response.data?.error?.message || error.response.statusText}` :
                `${provider.name} Connection Error: ${error.message}`;
            
            console.error(`Error calling ${provider.name}:`, errorMessage);
            throw new Error(errorMessage);
        }
    }

    getApiKeyName(providerKey) {
        const keyNames = {
            'grok': 'GROK_API_KEY',
            'claude': 'CLAUDE_API_KEY', // Updated to match .env file
            'gpt-4': 'OPENAI_API_KEY',
            'gemini': 'GEMINI_API_KEY'
        };
        return keyNames[providerKey] || 'API_KEY';
    }

    async callOpenAIStyle(prompt, provider, imageData = null) {
        // Prepare message content
        let messageContent = prompt;
        if (imageData && (provider.model.includes('gpt-4') || provider.model.includes('grok'))) {
            // OpenAI/Grok vision format
            messageContent = [
                {
                    type: 'text',
                    text: prompt
                },
                {
                    type: 'image_url',
                    image_url: {
                        url: `data:${imageData.mimeType || 'image/jpeg'};base64,${imageData.data}`
                    }
                }
            ];
        }

        const response = await axios.post(provider.endpoint, {
            model: provider.model,
            messages: [{ role: 'user', content: messageContent }],
            max_tokens: 4000,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${provider.apiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 120000 // Increased to 2 minutes for website generation
        });

        return {
            content: response.data.choices[0].message.content,
            provider: provider.name
        };
    }

    async callClaude(prompt, provider, imageData = null) {
        // Prepare message content
        let messageContent = prompt;
        if (imageData) {
            // Claude vision format
            messageContent = [
                {
                    type: 'text',
                    text: prompt
                },
                {
                    type: 'image',
                    source: {
                        type: 'base64',
                        media_type: imageData.mimeType || 'image/jpeg',
                        data: imageData.data // Use the base64 data directly from the object
                    }
                }
            ];
        }

        const response = await axios.post(provider.endpoint, {
            model: provider.model,
            max_tokens: 4000,
            messages: [{ role: 'user', content: messageContent }]
        }, {
            headers: {
                'x-api-key': provider.apiKey,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01'
            },
            timeout: 120000 // Increased to 2 minutes
        });

        return {
            content: response.data.content[0].text,
            provider: provider.name
        };
    }

    async callGemini(prompt, provider, imageData = null) {
        const url = `${provider.endpoint}?key=${provider.apiKey}`;
        
        // Prepare parts array
        const parts = [{ text: prompt }];
        
        if (imageData) {
            // Gemini vision format
            parts.push({
                inline_data: {
                    mime_type: imageData.mimeType || 'image/jpeg',
                    data: imageData.data // Use the base64 data directly from the object
                }
            });
        }
        
        const response = await axios.post(url, {
            contents: [{
                parts: parts
            }]
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 120000 // Increased to 2 minutes
        });

        return {
            content: response.data.candidates[0].content.parts[0].text,
            provider: provider.name
        };
    }

    // Fallback method for demo purposes
    async callMockProvider(prompt) {
        console.log('Using mock provider (API key missing or API call failed)');
        
        // Simple mock response for testing
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        return {
            content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo Website - Local Service Business</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f8fafc; line-height: 1.6; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        h1 { color: #1e293b; text-align: center; margin-bottom: 8px; font-size: 2.5em; font-weight: 700; }
        .subtitle { text-align: center; color: #64748b; margin-bottom: 40px; font-size: 1.1em; }
        .contact { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; border-radius: 8px; text-align: center; margin: 30px 0; }
        .contact h2 { margin: 0 0 10px 0; font-size: 1.8em; }
        .contact p { margin: 0; font-size: 1.1em; opacity: 0.95; }
        .services { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin: 40px 0; }
        .service { background: #f8fafc; padding: 24px; border-radius: 8px; border-left: 4px solid #3b82f6; transition: transform 0.2s ease; }
        .service:hover { transform: translateY(-2px); }
        .service h3 { color: #1e293b; margin: 0 0 12px 0; font-size: 1.3em; }
        .service p { color: #475569; margin: 0; }
        .setup-notice { background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 30px 0; }
        .setup-notice h3 { color: #92400e; margin: 0 0 12px 0; }
        .setup-notice ul { color: #92400e; margin: 0; padding-left: 20px; }
        .setup-notice li { margin: 4px 0; }
        @media (max-width: 768px) { .container { padding: 20px; margin: 10px; } .services { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <div class="container">
        <h1>Professional Service Website</h1>
        <p class="subtitle">Demo generated by Local Service Business IDE</p>
        
        <div class="contact">
            <h2>Get Your Real Website</h2>
            <p>This is a demo. Add AI provider API keys to generate custom business websites.</p>
        </div>
        
        <div class="services">
            <div class="service">
                <h3>Service 1</h3>
                <p>Professional service description tailored to your business needs and local market.</p>
            </div>
            <div class="service">
                <h3>Service 2</h3>
                <p>Quality service delivery with attention to detail and customer satisfaction.</p>
            </div>
            <div class="service">
                <h3>Service 3</h3>
                <p>Comprehensive solutions designed to meet your specific requirements.</p>
            </div>
        </div>
        
        <div class="setup-notice">
            <h3>Enable AI-Generated Websites</h3>
            <ul>
                <li>Add <strong>GROK_API_KEY</strong> for creative Grok Beta v1.0 designs</li>
                <li>Add <strong>ANTHROPIC_API_KEY</strong> for Claude 3.5 Sonnet 20241022</li>
                <li>Add <strong>OPENAI_API_KEY</strong> for GPT-4o 2024-08-06 websites</li>
                <li>Add <strong>GEMINI_API_KEY</strong> for Gemini 2.0 Flash generation</li>
            </ul>
        </div>
        
        <p style="text-align: center; color: #64748b; margin-top: 40px; font-size: 0.95em;">
            Create professional websites for local service businesses with full model version transparency
        </p>
    </div>
</body>
</html>`,
            provider: 'Demo Mode - Add API Keys'
        };
    }
}

module.exports = LLMRouter;