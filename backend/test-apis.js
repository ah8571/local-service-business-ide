#!/usr/bin/env node

// API Testing Script - Test individual providers manually
require('dotenv').config();
const axios = require('axios');

const testPrompt = "Hello! Please respond with 'AI connection successful!' in 10 words or less.";

// Test configurations matching your .env file
const tests = {
    grok: {
        endpoint: 'https://api.x.ai/v1/chat/completions',
        headers: {
            'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: {
            model: 'grok-3',
            messages: [{ role: 'user', content: testPrompt }],
            max_tokens: 100
        }
    },
    claude: {
        endpoint: 'https://api.anthropic.com/v1/messages',
        headers: {
            'x-api-key': process.env.CLAUDE_API_KEY,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
        },
        body: {
            model: 'claude-3-5-haiku-20241022',
            max_tokens: 100,
            messages: [{ role: 'user', content: testPrompt }]
        }
    },
    openai: {
        endpoint: 'https://api.openai.com/v1/chat/completions',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: {
            model: 'gpt-4o',
            messages: [{ role: 'user', content: testPrompt }],
            max_tokens: 100
        }
    },
    gemini: {
        endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            contents: [{
                parts: [{ text: testPrompt }]
            }]
        }
    }
};

async function testProvider(name, config) {
    console.log(`\n=== Testing ${name.toUpperCase()} ===`);
    
    if (!config.headers.Authorization && !config.headers['x-api-key'] && !process.env.GEMINI_API_KEY) {
        console.log(`❌ No API key found for ${name}`);
        return;
    }
    
    try {
        console.log(`📡 Endpoint: ${config.endpoint}`);
        console.log(`🔑 API Key: ${name === 'gemini' ? (process.env.GEMINI_API_KEY ? 'Present' : 'Missing') : 'Present'}`);
        console.log(`📋 Model: ${config.body.model || 'gemini-2.0-flash'}`);
        
        const response = await axios.post(config.endpoint, config.body, {
            headers: config.headers,
            timeout: 30000
        });
        
        console.log(`✅ Status: ${response.status}`);
        console.log(`📊 Response length: ${JSON.stringify(response.data).length} chars`);
        
        // Extract response content based on provider
        let content = '';
        if (name === 'claude') {
            content = response.data.content?.[0]?.text || 'No content';
        } else if (name === 'gemini') {
            content = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No content';
        } else {
            content = response.data.choices?.[0]?.message?.content || 'No content';
        }
        
        console.log(`💬 Response: "${content.substring(0, 100)}${content.length > 100 ? '...' : ''}"`);
        
    } catch (error) {
        console.log(`❌ Error: ${error.response?.status || 'Network'}`);
        console.log(`📝 Message: ${error.response?.data?.error?.message || error.message}`);
        if (error.response?.data) {
            console.log(`📄 Full error:`, JSON.stringify(error.response.data, null, 2));
        }
    }
}

async function runAllTests() {
    console.log('🚀 Starting API Provider Tests...');
    console.log('⏰ Timestamp:', new Date().toISOString());
    
    for (const [name, config] of Object.entries(tests)) {
        await testProvider(name, config);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
    }
    
    console.log('\n🎯 Test Summary Complete!');
    console.log('💡 Next steps:');
    console.log('   - Fix any failing API endpoints');
    console.log('   - Verify API keys have proper permissions');
    console.log('   - Check quota limits for failing providers');
}

// Run the tests
runAllTests().catch(console.error);