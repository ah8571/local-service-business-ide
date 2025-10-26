/**
 * ChatBox - Vanilla JavaScript Component
 * Handles chat interface, messaging, and AI agent switching
 * Size: ~250 lines (well under 500-line limit)
 */

class ChatBox {
    constructor(containerId) {
        this.containerId = containerId;
        this.messagesContainer = null;
        this.messageInput = null;
        this.imageInput = null;
        this.imageButton = null;
        this.imagePreview = null;
        this.currentAgent = 'gemini';
        this.currentBusinessData = null;
        this.selectedImage = null;
        this.isInitialized = false;
        
        // Bind methods to preserve 'this' context
        this.sendMessage = this.sendMessage.bind(this);
        this.switchAgent = this.switchAgent.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleImageSelect = this.handleImageSelect.bind(this);
        this.openImageDialog = this.openImageDialog.bind(this);
    }

    init() {
        if (this.isInitialized) {
            console.log('ChatBox already initialized, skipping...');
            return;
        }
        
        this.createChatInterface();
        this.attachEventListeners();
        this.showWelcomeMessage();
        this.isInitialized = true;
        console.log('ChatBox component initialized');
    }

    createChatInterface() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with id '${this.containerId}' not found`);
            return;
        }

        container.innerHTML = `
            <div class="messages" id="messages">
                <!-- Messages will be added dynamically -->
            </div>

                <!-- Chat input (initially hidden) -->
                <div class="input-area" id="chatArea" style="display: none;">
                    <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                        <input 
                            type="text" 
                            class="message-input" 
                            id="messageInput" 
                            placeholder="Ask questions or request changes..."
                        >
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input 
                                type="file" 
                                id="imageInput" 
                                accept="image/*" 
                                style="display: none;"
                            >
                            <button 
                                type="button" 
                                id="imageButton" 
                                style="padding: 6px 12px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 12px; cursor: pointer;">
                                📷 Add Image
                            </button>
                            <div id="imagePreview" style="display: none; font-size: 12px; color: #64748b;"></div>
                        </div>
                    </div>
                    <button class="send-button" id="sendButton">Send</button>
                </div>            <!-- AI Agent Selector -->
            <div class="agent-selector" id="agentSelector" style="display: none; margin-top: 12px;">
                <label for="aiAgentSelect" class="agent-label">AI Agent:</label>
                <select id="aiAgentSelect" class="agent-dropdown">
                    <option value="gemini">Gemini 2.0 Flash (Fast & Reliable)</option>
                    <option value="gpt-4">GPT-4o 2024-08-06 (Premium Quality)</option>
                    <option value="grok">Grok-3 Latest (Creative & Detailed)</option>
                    <option value="claude">Claude 3.5 Haiku (Balanced)</option>
                </select>
                <div id="agent-status" class="agent-status" style="display: none; margin-top: 8px; font-size: 12px;"></div>
            </div>
        `;

        this.messagesContainer = document.getElementById('messages');
        this.messageInput = document.getElementById('messageInput');
        this.imageInput = document.getElementById('imageInput');
        this.imageButton = document.getElementById('imageButton');
        this.imagePreview = document.getElementById('imagePreview');
    }

    attachEventListeners() {
        const sendButton = document.getElementById('sendButton');
        const aiAgentSelect = document.getElementById('aiAgentSelect');
        
        if (sendButton) sendButton.addEventListener('click', this.sendMessage);
        if (this.messageInput) this.messageInput.addEventListener('keypress', this.handleKeyPress);
        if (aiAgentSelect) aiAgentSelect.addEventListener('change', this.switchAgent);
        
        // Image upload events
        if (this.imageButton) this.imageButton.addEventListener('click', this.openImageDialog);
        if (this.imageInput) this.imageInput.addEventListener('change', this.handleImageSelect);
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    }

    openImageDialog() {
        if (this.imageInput) {
            this.imageInput.click();
        }
    }

    handleImageSelect(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.selectedImage = file;
            
            // Show image preview
            if (this.imagePreview) {
                this.imagePreview.textContent = `📷 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
                this.imagePreview.style.display = 'block';
            }
            
            console.log('Image selected:', file.name);
        } else {
            this.clearSelectedImage();
        }
    }

    clearSelectedImage() {
        this.selectedImage = null;
        if (this.imageInput) this.imageInput.value = '';
        if (this.imagePreview) {
            this.imagePreview.style.display = 'none';
            this.imagePreview.textContent = '';
        }
    }

    async convertImageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    showWelcomeMessage() {
        this.addMessage(`
            <div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px; font-weight: 500;">AI Assistant</div>
            Welcome to Connectionism! I will help you create a professional, SEO-optimized website for your local service business.
            <br><br>
            Please provide the following information to ensure the best results:
        `, false);
    }

    addMessage(content, isUser = false, isLoading = false) {
        if (!this.messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'message user-message' : 'message ai-message';
        messageDiv.innerHTML = content;
        
        // Mark loading messages for easy removal
        if (isLoading) {
            messageDiv.classList.add('loading-message');
        }
        
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        return messageDiv;
    }

    removeLoadingMessages() {
        if (!this.messagesContainer) return;
        
        const loadingMessages = this.messagesContainer.querySelectorAll('.loading-message');
        loadingMessages.forEach(msg => msg.remove());
    }

    showChatInterface() {
        const chatArea = document.getElementById('chatArea');
        const agentSelector = document.getElementById('agentSelector');
        const aiAgentSelect = document.getElementById('aiAgentSelect');
        
        if (chatArea) chatArea.style.display = 'flex';
        if (agentSelector) agentSelector.style.display = 'flex';
        if (aiAgentSelect) aiAgentSelect.value = this.currentAgent;
    }

    hideChatInterface() {
        const chatArea = document.getElementById('chatArea');
        const agentSelector = document.getElementById('agentSelector');
        
        if (chatArea) chatArea.style.display = 'none';
        if (agentSelector) agentSelector.style.display = 'none';
    }

    async sendMessage() {
        if (!this.messageInput) {
            console.error('messageInput element not found!');
            return;
        }

        const message = this.messageInput.value.trim();
        const hasImage = this.selectedImage !== null;
        
        if (!message && !hasImage) return;

        // Prepare user message content
        let userMessageContent = message || 'Shared an image';
        if (hasImage) {
            userMessageContent += hasImage && message ? '<br>📷 Image attached' : '📷 Image shared';
        }

        // Add user message
        this.addMessage(userMessageContent, true);
        this.messageInput.value = '';
        
        // Prepare image data if present
        let imageData = null;
        if (hasImage) {
            try {
                const dataUrl = await this.convertImageToBase64(this.selectedImage);
                // Parse the data URL to extract mime type and base64 data
                const [mimeInfo, base64Data] = dataUrl.split(',');
                const mimeType = mimeInfo.match(/:(.*?);/)[1];
                
                imageData = {
                    data: base64Data,
                    mimeType: mimeType
                };
            } catch (error) {
                console.error('Error converting image:', error);
                this.addMessage('Error processing image. Please try again.', false);
                this.clearSelectedImage();
                return;
            }
        }
        
        // Clear selected image after processing
        this.clearSelectedImage();

        // Determine if this is a follow-up question or new website request
        const isFollowUp = this.isFollowUpQuestion(message);

        // Show loading message
        this.addMessage(`
            <div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px; font-weight: 500;">AI Assistant</div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <div class="thinking-spinner"></div>
                <span>${isFollowUp ? 'Thinking...' : 'Generating website...'}</span>
            </div>
        `, false, true); // Mark as loading message

        try {
            if (isFollowUp) {
                // Use APIService for chat messages
                const result = await window.apiService.sendChatMessage(message, this.currentAgent, this.currentBusinessData, imageData);
                
                // Remove loading messages before showing response
                this.removeLoadingMessages();
                
                if (result.success) {
                    // Check if response contains HTML (website update)
                    if (result.data.html) {
                        // Update preview with new HTML
                        if (window.sitePreview) {
                            window.sitePreview.updatePreview(result.data.html);
                        }
                        
                        this.addMessage(`
                            <div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px; font-weight: 500;">AI Assistant</div>
                            ${result.data.response || result.data.message || 'Your website has been updated based on your request.'}
                        `, false);
                    } else {
                        // Regular chat response
                        this.addMessage(`
                            <div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px; font-weight: 500;">AI Assistant</div>
                            ${result.data.response || result.data.message}
                        `, false);
                    }
                } else {
                    this.addMessage(`
                        <div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px; font-weight: 500;">AI Assistant</div>
                        <strong>Error:</strong> ${result.error}
                    `, false);
                }
            } else {
                // Generate new website - this should not happen from chat, but handle it
                this.addMessage(`
                    <div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px; font-weight: 500;">AI Assistant</div>
                    Please use the form above to generate a new website, or ask me questions about your existing website.
                `, false);
            }
        } catch (error) {
            console.error('Error:', error);
            // Remove loading messages before showing error
            this.removeLoadingMessages();
            
            this.addMessage(`
                <div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px; font-weight: 500;">AI Assistant</div>
                <strong>Connection error:</strong> Unable to connect to AI service. Please check your connection and try again.
            `, false);
        }
    }

    switchAgent() {
        const aiAgentSelect = document.getElementById('aiAgentSelect');
        if (!aiAgentSelect) return;
        
        const selectedAgent = aiAgentSelect.value;
        const agentNames = {
            'gemini': 'Gemini 2.0 Flash',
            'gpt-4': 'GPT-4o 2024-08-06', 
            'grok': 'Grok-3 Latest',
            'claude': 'Claude 3.5 Haiku'
        };

        this.currentAgent = selectedAgent;

        // Update current business data with new agent
        if (this.currentBusinessData) {
            this.currentBusinessData.aiAgent = selectedAgent;
        }

        // Show confirmation message
        this.addMessage(`Switched to <strong>${agentNames[selectedAgent]}</strong>. Continue the conversation with your new AI assistant!`, false);
        console.log('Agent switched to:', selectedAgent);
    }

    setBusinessData(businessData) {
        this.currentBusinessData = businessData;
        this.currentAgent = businessData.aiAgent || 'gemini';
        
        // Update the dropdown to reflect the selected agent
        const aiAgentSelect = document.getElementById('aiAgentSelect');
        if (aiAgentSelect) {
            aiAgentSelect.value = this.currentAgent;
        }
    }

    isFollowUpQuestion(message) {
        const websiteKeywords = [
            'create website', 'build website', 'generate website', 'new website',
            'make a website', 'design website', 'website for', 'build a site',
            'create a site', 'generate site', 'new site', 'redesign'
        ];
        
        const chatKeywords = [
            'can you', 'are you able', 'could you', 'would you', 'do you',
            'how do i', 'how can i', 'what about', 'also', 'additionally',
            'furthermore', 'moreover', 'in addition', 'besides',
            'thank you', 'thanks', 'great', 'perfect', 'excellent',
            'help with', 'suggestions', 'advice', 'recommend', 'find',
            'images', 'photos', 'seo', 'marketing', 'improve', 'optimize',
            'copyright', 'hero image', 'pull', 'download'
        ];
        
        const lowerMessage = message.toLowerCase();
        
        // If it explicitly asks for website creation, treat as website request
        if (websiteKeywords.some(keyword => lowerMessage.includes(keyword))) {
            return false;
        }
        
        // If it contains chat keywords or we have existing business data, treat as follow-up
        return chatKeywords.some(keyword => lowerMessage.includes(keyword)) || this.currentBusinessData;
    }
}

// Export for global use
window.ChatBox = ChatBox;