/**
 * Main App Controller - Orchestrates all components
 * Size: ~200 lines (well under 500-line limit)
 */

class WebsiteBuilderApp {
    constructor() {
        this.components = {
            chatBox: null,
            businessForm: null,
            sitePreview: null
        };
        this.services = {
            api: null
        };
        this.isInitialized = false;
        
        // Bind methods
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.init = this.init.bind(this);
    }

    async init() {
        if (this.isInitialized) {
            console.log('App already initialized');
            return;
        }

        console.log('Initializing Website Builder App...');

        try {
            // Initialize services
            this.services.api = new APIService();

            // Initialize components
            await this.initializeComponents();

            // Check AI status
            await this.checkInitialAIStatus();

            // Set up global references for component communication
            this.setupGlobalReferences();

            this.isInitialized = true;
            console.log('Website Builder App initialized successfully');

        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showInitializationError();
        }
    }

    async initializeComponents() {
        console.log('Initializing components...');
        
        // Check if containers exist
        const containers = {
            'chat-container': document.getElementById('chat-container'),
            'form-container': document.getElementById('form-container'),
            'preview-container': document.getElementById('preview-container')
        };
        
        for (const [containerId, container] of Object.entries(containers)) {
            if (!container) {
                console.error(`Container not found: ${containerId}`);
                throw new Error(`Required container ${containerId} not found in DOM`);
            }
        }

        // Initialize ChatBox component
        this.components.chatBox = new ChatBox('chat-container');
        this.components.chatBox.init();

        // Initialize BusinessForm component
        this.components.businessForm = new BusinessForm('form-container');
        this.components.businessForm.init(this.handleFormSubmit);

        // Initialize SitePreview component
        this.components.sitePreview = new SitePreview('preview-container');
        this.components.sitePreview.init();

        console.log('All components initialized successfully');
    }

    setupGlobalReferences() {
        // Make key components available globally for cross-component communication
        window.chatBox = this.components.chatBox;
        window.businessForm = this.components.businessForm;
        window.sitePreview = this.components.sitePreview;
        window.apiService = this.services.api;
        
        // Make the main app available globally
        window.websiteApp = this;
    }

    async handleFormSubmit(businessData) {
        console.log('Form submitted with business data:', businessData);

        try {
            // Show chat interface and pass business data
            this.components.chatBox.setBusinessData(businessData);
            this.components.chatBox.showChatInterface();

            // Create business prompt
            const prompt = this.services.api.createBusinessPrompt(businessData);

            // Add user message showing collected info
            const businessSummary = this.formatBusinessSummary(businessData);
            this.components.chatBox.addMessage(businessSummary, true);

            // Show loading state in preview
            this.components.sitePreview.showLoadingState();

            // Add loading message with extended timeout warning
            this.components.chatBox.addMessage(`
                <div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px; font-weight: 500;">AI Assistant</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="thinking-spinner"></div>
                    <span>Generating your professional website with SEO optimization...</span>
                </div>
                <br>
                <div style="color: #64748b; font-size: 13px; margin-top: 8px;">⏱️ This may take 1-2 minutes for complex websites. Please wait...</div>
            `, false, true); // Mark as loading message

            // Generate website
            const result = await this.services.api.generateWebsite(businessData, prompt);

            if (result.success) {
                // Remove loading messages before showing success
                this.components.chatBox.removeLoadingMessages();
                
                // Update preview with generated HTML
                this.components.sitePreview.updatePreview(result.data.html);

                // Show success message
                const successMessage = this.services.api.formatSuccessMessage(
                    businessData.businessName, 
                    businessData.serviceArea
                );
                this.components.chatBox.addMessage(successMessage, false);

            } else {
                // Remove loading messages before showing error
                this.components.chatBox.removeLoadingMessages();
                
                // Handle error
                this.handleGenerationError(result);
            }

        } catch (error) {
            console.error('Error during form submission:', error);
            // Remove loading messages before showing error
            this.components.chatBox.removeLoadingMessages();
            
            this.components.chatBox.addMessage(
                this.services.api.formatErrorMessage('Unexpected error during website generation', 'connection'),
                false
            );
            // Reset preview to empty state
            this.components.sitePreview.showEmptyState();
        }
    }

    formatBusinessSummary(businessData) {
        return `<strong>Business Information Collected:</strong><br>
            • Business: ${businessData.businessName}<br>
            • Services: ${businessData.services}<br>
            • Area: ${businessData.serviceArea}<br>
            • Phone: ${businessData.phone}${businessData.email ? '<br>• Email: ' + businessData.email : ''}${businessData.location ? '<br>• Location: ' + businessData.location : ''}${businessData.hours ? '<br>• Hours: ' + businessData.hours : ''}<br>
            • AI Agent: ${this.services.api.getAgentDisplayName(businessData.aiAgent)}`;
    }

    handleGenerationError(result) {
        // Reset preview to empty state
        this.components.sitePreview.showEmptyState();

        // Handle detailed error response
        let errorMessage = '<div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px; font-weight: 500;">AI Assistant</div><strong>Website Generation Error</strong><br><br>';
        errorMessage += `<div style="color: #dc2626; margin: 12px 0;">${result.error}</div>`;
        
        if (result.troubleshooting) {
            errorMessage += '<strong>Troubleshooting Steps:</strong><br>';
            result.troubleshooting.forEach(step => {
                errorMessage += `• ${step}<br>`;
            });
            errorMessage += '<br>';
        }
        
        errorMessage += '<strong>What you can do:</strong><br>';
        errorMessage += '• Try a different AI provider from the dropdown<br>';
        errorMessage += '• Check the API status at <a href="/api/test-ai" target="_blank">test endpoint</a><br>';
        errorMessage += '• Your business information is saved and ready for retry<br>';
        
        this.components.chatBox.addMessage(errorMessage, false);
    }

    async checkInitialAIStatus() {
        const statusResult = await this.services.api.checkAIStatus();
        if (!statusResult.success) {
            console.log('Could not check initial AI status');
            return;
        }

        // Update ChatBox with AI status if needed
        if (this.components.chatBox && this.components.chatBox.checkAIStatus) {
            await this.components.chatBox.checkAIStatus();
        }
    }

    showInitializationError() {
        const errorHtml = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: Arial; color: #dc2626; text-align: center;">
                <div>
                    <h2>Initialization Error</h2>
                    <p>Failed to start the Website Builder application.</p>
                    <p style="font-size: 14px; color: #6b7280;">Please refresh the page and try again.</p>
                </div>
            </div>
        `;
        document.body.innerHTML = errorHtml;
    }

    // Utility methods for other components to use
    reset() {
        console.log('Resetting application...');
        
        // Reset all components
        if (this.components.businessForm) {
            this.components.businessForm.reset();
        }
        if (this.components.sitePreview) {
            this.components.sitePreview.reset();
        }
        if (this.components.chatBox) {
            this.components.chatBox.hideChatInterface();
            this.components.chatBox.currentBusinessData = null;
        }
    }

    // Method for manual component re-initialization if needed
    async reinitialize() {
        this.isInitialized = false;
        await this.init();
    }
}

// Export for global use and auto-initialize
window.WebsiteBuilderApp = WebsiteBuilderApp;

// Auto-initialize when DOM is ready (with guard to prevent multiple initialization)
document.addEventListener('DOMContentLoaded', async () => {
    // Prevent multiple initialization
    if (window.app && window.app.isInitialized) {
        console.log('App already initialized, skipping...');
        return;
    }
    
    console.log('DOM loaded, initializing Website Builder App...');
    window.app = new WebsiteBuilderApp();
    await window.app.init();
});