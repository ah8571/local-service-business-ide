// Quick test of AI providers
const LLMRouter = require('./services/simple-llmRouter');

async function testProviders() {
    const llmRouter = new LLMRouter();
    
    console.log('\n=== Testing AI Providers ===\n');
    
    const providers = ['grok', 'claude', 'gpt-4', 'gemini'];
    const testPrompt = "Hello! Please respond with 'AI connection successful!'";
    
    for (const provider of providers) {
        try {
            console.log(`Testing ${provider}...`);
            const response = await llmRouter.callProvider(provider, testPrompt);
            console.log(`✓ ${provider}: SUCCESS - ${response.provider}`);
        } catch (error) {
            console.log(`✗ ${provider}: ERROR - ${error.message}`);
        }
        console.log('');
    }
}

testProviders().catch(console.error);