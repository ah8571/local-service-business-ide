/**
 * BusinessForm - Vanilla JavaScript Component
 * Handles business information form collection and validation
 * Size: ~200 lines (well under 500-line limit)
 */

class BusinessForm {
    constructor(containerId) {
        this.containerId = containerId;
        this.isInitialized = false;
        this.onFormSubmit = null; // Callback function for when form is submitted
        
        // Bind methods to preserve 'this' context
        this.generateFromForm = this.generateFromForm.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    init(onSubmitCallback) {
        if (this.isInitialized) {
            console.log('BusinessForm already initialized, skipping...');
            return;
        }
        
        this.onFormSubmit = onSubmitCallback;
        this.createFormInterface();
        this.attachEventListeners();
        this.isInitialized = true;
        console.log('BusinessForm component initialized');
    }

    createFormInterface() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with id '${this.containerId}' not found`);
            return;
        }

        container.innerHTML = `
            <div class="business-form" id="businessFormContainer">
                <div style="padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin: 16px 0;">
                    <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 16px;">Business Information</h3>
                    
                    <div class="form-row">
                        <label>Business Name *</label>
                        <input type="text" id="businessName" placeholder="e.g., Smith Plumbing Services" required>
                    </div>
                    
                    <div class="form-row">
                        <label>Primary Services/Skills *</label>
                        <input type="text" id="businessServices" placeholder="e.g., Emergency plumbing, drain cleaning, pipe repair" required>
                    </div>
                    
                    <div class="form-row">
                        <label>Service Area *</label>
                        <input type="text" id="serviceArea" placeholder="e.g., Dallas Metro Area, North Texas, 50 mile radius" required>
                    </div>
                    
                    <div class="form-row">
                        <label>Physical Location (if applicable)</label>
                        <input type="text" id="physicalLocation" placeholder="e.g., 123 Main St, Dallas, TX 75201">
                    </div>
                    
                    <div class="form-row">
                        <label>Phone Number *</label>
                        <input type="tel" id="phoneNumber" placeholder="e.g., (555) 123-4567" required>
                    </div>
                    
                    <div class="form-row">
                        <label>Email Address</label>
                        <input type="email" id="emailAddress" placeholder="e.g., info@smithplumbing.com">
                    </div>
                    
                    <div class="form-row">
                        <label>Working Hours</label>
                        <input type="text" id="workingHours" placeholder="e.g., Monday-Friday 7AM-6PM, Emergency 24/7">
                    </div>

                    <div class="form-row">
                        <label>AI Agent Selection</label>
                        <select id="aiAgent" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                            <option value="gemini">Gemini 2.0 Flash (Recommended - Fast & Reliable)</option>
                            <option value="gpt4">GPT-4o 2024-08-06 (Premium Quality)</option>
                            <option value="grok">Grok-3 Latest (Creative & Detailed)</option>
                            <option value="claude">Claude 3.5 Haiku (Balanced Performance)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="input-area" id="generateArea">
                <button class="send-button" id="generateButton" style="width: 100%; font-size: 16px; padding: 12px;">
                    Generate Professional Website
                </button>
            </div>
        `;
    }

    attachEventListeners() {
        const generateButton = document.getElementById('generateButton');
        if (generateButton) {
            generateButton.addEventListener('click', this.generateFromForm);
        }

        // Add real-time validation styling
        this.addValidationStyling();
    }

    addValidationStyling() {
        const requiredInputs = document.querySelectorAll('#businessName, #businessServices, #serviceArea, #phoneNumber');
        
        requiredInputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.style.borderLeft = '3px solid #16a34a';
                } else {
                    input.style.borderLeft = '3px solid #dc2626';
                }
            });
        });
    }

    validateForm() {
        const businessName = document.getElementById('businessName').value.trim();
        const businessServices = document.getElementById('businessServices').value.trim();
        const serviceArea = document.getElementById('serviceArea').value.trim();
        const phoneNumber = document.getElementById('phoneNumber').value.trim();
        
        const missingFields = [];
        if (!businessName) missingFields.push('Business Name');
        if (!businessServices) missingFields.push('Primary Services');
        if (!serviceArea) missingFields.push('Service Area');
        if (!phoneNumber) missingFields.push('Phone Number');
        
        if (missingFields.length > 0) {
            alert(`Please fill in the following required fields:\n• ${missingFields.join('\n• ')}`);
            return false;
        }

        return true;
    }

    collectFormData() {
        return {
            businessName: document.getElementById('businessName').value.trim(),
            services: document.getElementById('businessServices').value.trim(),
            serviceArea: document.getElementById('serviceArea').value.trim(),
            location: document.getElementById('physicalLocation').value.trim(),
            phone: document.getElementById('phoneNumber').value.trim(),
            email: document.getElementById('emailAddress').value.trim(),
            hours: document.getElementById('workingHours').value.trim(),
            aiAgent: document.getElementById('aiAgent').value
        };
    }

    async generateFromForm() {
        if (!this.validateForm()) {
            return;
        }
        
        const businessData = this.collectFormData();
        
        // Hide form and show loading
        this.hideForm();
        
        // Call the callback function with business data
        if (this.onFormSubmit) {
            await this.onFormSubmit(businessData);
        }
        
        console.log('Form submitted with data:', businessData);
    }

    hideForm() {
        const formContainer = document.getElementById('businessFormContainer');
        const generateArea = document.getElementById('generateArea');
        
        if (formContainer) formContainer.style.display = 'none';
        if (generateArea) generateArea.style.display = 'none';
    }

    showForm() {
        const formContainer = document.getElementById('businessFormContainer');
        const generateArea = document.getElementById('generateArea');
        
        if (formContainer) formContainer.style.display = 'block';
        if (generateArea) generateArea.style.display = 'flex';
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

IMPORTANT: Please respond with ONLY the complete HTML code. Start with <!DOCTYPE html> and end with </html>. Do not include any explanations, code blocks, or markdown formatting - just the raw HTML code that can be directly used in a browser.

The website should include:
- Professional header with ${businessData.businessName}
- Clear display of services: ${businessData.services}
- Contact information: ${businessData.phone}
- Service area: ${businessData.serviceArea}
- Mobile-responsive design
- Professional styling with embedded CSS
- Call-to-action buttons
- Local business optimization

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

    reset() {
        // Reset form fields
        const inputs = document.querySelectorAll('#businessName, #businessServices, #serviceArea, #physicalLocation, #phoneNumber, #emailAddress, #workingHours');
        inputs.forEach(input => {
            input.value = '';
            input.style.borderLeft = '3px solid #dc2626';
        });
        
        // Reset select
        const aiAgentSelect = document.getElementById('aiAgent');
        if (aiAgentSelect) {
            aiAgentSelect.value = 'gemini';
        }
        
        // Show form again
        this.showForm();
    }
}

// Export for global use
window.BusinessForm = BusinessForm;