/**
 * API Service - Handles all AI communication and website generation
 * Size: ~150 lines (well under 500-line limit)
 */

class APIService {
    constructor() {
        this.baseUrl = '';
        this.defaultTimeout = 150000; // 2.5 minutes
    }

    async generateWebsite(businessData, prompt) {
        console.log('Generating website with AI agent:', businessData.aiAgent);
        
        try {
            // Create AbortController for timeout handling
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.defaultTimeout);
            
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    businessData: businessData,
                    template: 'modern-professional',
                    aiAgent: businessData.aiAgent
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const data = await response.json();
                return {
                    success: true,
                    data: data
                };
            } else {
                const errorData = await response.json();
                return {
                    success: false,
                    error: errorData.error,
                    troubleshooting: errorData.troubleshooting
                };
            }
            
        } catch (error) {
            console.error('API Error:', error);
            
            if (error.name === 'AbortError') {
                return {
                    success: false,
                    error: 'Generation timeout: The AI is taking longer than expected.',
                    type: 'timeout'
                };
            }
            
            return {
                success: false,
                error: 'Unable to connect to AI service. Please check your connection and try again.',
                type: 'connection'
            };
        }
    }

    async sendChatMessage(message, aiAgent, businessData = null, imageData = null) {
        console.log('Sending chat message to AI agent:', aiAgent);
        
        try {
            const requestBody = {
                prompt: message, // Backend expects 'prompt' not 'message'
                aiAgent: aiAgent,
                currentHtml: window.sitePreview ? window.sitePreview.getOriginalHtml() : ''
            };

            // Include business data if available
            if (businessData) {
                requestBody.businessData = businessData;
            }
            
            // Include image data if available
            if (imageData) {
                requestBody.imageData = imageData;
            }

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const data = await response.json();
                return {
                    success: true,
                    data: data
                };
            } else {
                const errorData = await response.json();
                return {
                    success: false,
                    error: errorData.error || 'Something went wrong. Please try again.'
                };
            }
            
        } catch (error) {
            console.error('Chat API Error:', error);
            return {
                success: false,
                error: 'Unable to connect to AI service. Please check your connection and try again.'
            };
        }
    }

    async checkAIStatus() {
        try {
            const response = await fetch('/api/test-ai');
            
            if (response.ok) {
                const data = await response.json();
                return {
                    success: true,
                    data: data
                };
            } else {
                return {
                    success: false,
                    error: 'Unable to check AI status'
                };
            }
            
        } catch (error) {
            console.log('Could not check AI status:', error);
            return {
                success: false,
                error: 'Unable to connect to AI status endpoint'
            };
        }
    }

    createBusinessPrompt(businessData) {
        return `You are a professional web developer. Create a complete, professional website for "${businessData.businessName}".

BUSINESS INFORMATION:
- Company: ${businessData.businessName}
- Services: ${businessData.services}  
- Service Area: ${businessData.serviceArea}
${businessData.location ? `- Address: ${businessData.location}` : ''}
- Phone: ${businessData.phone}
${businessData.email ? `- Email: ${businessData.email}` : ''}
${businessData.hours ? `- Hours: ${businessData.hours}` : ''}

IMPORTANT REQUIREMENTS:
- Use current year (2025) for any copyright notices
- Create a modern, professional design
- Include responsive design and mobile optimization
- Please respond with ONLY the complete HTML code. Start with <!DOCTYPE html> and end with </html>. Do not include any explanations, code blocks, or markdown formatting - just the raw HTML code that can be directly used in a browser.

The website should include:
- Professional header with ${businessData.businessName}
- Clear display of services: ${businessData.services}
- Contact information: ${businessData.phone}
- Service area: ${businessData.serviceArea}
- Mobile-responsive design
- Professional styling with embedded CSS
- Call-to-action buttons
- Local business optimization
- Use current year (2025) for any copyright notices

Return ONLY the HTML code, nothing else.`;
    }

    getAgentDisplayName(agentValue) {
        const agents = {
            'gemini': 'Gemini 2.0 Flash (Fast & Reliable)',
            'gpt4': 'GPT-4o 2024-08-06 (Premium Quality)',
            'grok': 'Grok-3 Latest (Creative & Detailed)',
            'claude': 'Claude 3.5 Haiku (Balanced Performance)'
        };
        return agents[agentValue] || agentValue;
    }

    formatErrorMessage(error, type) {
        let errorMessage = '<div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px; font-weight: 500;">AI Assistant</div>';
        
        if (type === 'timeout') {
            errorMessage += '<strong>Generation Timeout:</strong> The AI is taking longer than expected to generate your website.<br><br>';
            errorMessage += '<strong>This can happen when:</strong><br>';
            errorMessage += '• The AI provider is experiencing high load<br>';
            errorMessage += '• Complex website requests require more processing time<br>';
            errorMessage += '• Network connectivity is slow<br><br>';
            errorMessage += '<strong>Recommended actions:</strong><br>';
            errorMessage += '• Try a different AI provider (Gemini or OpenAI are usually faster)<br>';
            errorMessage += '• Simplify your request and try again<br>';
            errorMessage += '• Check your internet connection<br>';
            errorMessage += '• Your business information is saved for easy retry<br>';
        } else if (type === 'connection') {
            errorMessage += '<strong>Connection error:</strong> Unable to connect to AI service.<br><br>';
            errorMessage += 'Please check your connection and try again.';
        } else {
            errorMessage += `<strong>Error:</strong> ${error}`;
        }
        
        return errorMessage;
    }

    formatSuccessMessage(businessName, serviceArea) {
        return `<div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px; font-weight: 500;">AI Assistant</div><strong>Website generated successfully!</strong><br><br><strong>SEO Features included:</strong><br>• Business schema markup for ${businessName}<br>• Local SEO optimization for ${serviceArea}<br>• Mobile-responsive design<br>• Automatic sitemap.xml generation<br>• Google Search Console ready<br>• Contact information structured data<br><br>Your website is displayed in the preview panel. You can download it, make changes, or ask questions about deployment!`;
    }
}

// Export for global use
window.APIService = APIService;