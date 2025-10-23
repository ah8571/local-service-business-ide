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
        this.currentAgent = 'gemini';
        this.currentBusinessData = null;
        this.isInitialized = false;
        
        // Bind methods to preserve 'this' context
        this.sendMessage = this.sendMessage.bind(this);
        this.switchAgent = this.switchAgent.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
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
                <input 
                    type="text" 
                    class="message-input" 
                    id="messageInput" 
                    placeholder="Ask questions or request changes..."
                >
                <button class="send-button" id="sendButton">Send</button>
            </div>

            <!-- AI Agent Selector -->
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
    }

    attachEventListeners() {
        const sendButton = document.getElementById('sendButton');
        const aiAgentSelect = document.getElementById('aiAgentSelect');
        
        if (sendButton) sendButton.addEventListener('click', this.sendMessage);
        if (this.messageInput) this.messageInput.addEventListener('keypress', this.handleKeyPress);
        if (aiAgentSelect) aiAgentSelect.addEventListener('change', this.switchAgent);
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    }

    showWelcomeMessage() {
        this.addMessage(`
            <div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px; font-weight: 500;">AI Assistant</div>
            Welcome to Connectionism! I will help you create a professional, SEO-optimized website for your local service business.
            <br><br>
            Please provide the following information to ensure the best results:
        `, false);
    }

    addMessage(content, isUser = false) {
        if (!this.messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'message user-message' : 'message ai-message';
        messageDiv.innerHTML = content;
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
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
        if (!message) return;

        // Add user message
        this.addMessage(message, true);
        this.messageInput.value = '';

        // Determine if this is a follow-up question or new website request
        const isFollowUp = this.isFollowUpQuestion(message);

        // Show loading message
        this.addMessage(`
            <div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px; font-weight: 500;">AI Assistant</div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <div class="thinking-spinner"></div>
                <span>${isFollowUp ? 'Thinking...' : 'Generating website...'}</span>
            </div>
        `, false);

        try {
            if (isFollowUp) {
                // Use APIService for chat messages
                const result = await window.apiService.sendChatMessage(message, this.currentAgent, this.currentBusinessData);
                
                if (result.success) {
                    // Check if response contains HTML (website update)
                    if (result.data.html) {
                        // Update preview with new HTML
                        if (window.sitePreview) {
                            window.sitePreview.updatePreview(result.data.html);
                        }
                        
                        this.addMessage(`
                            <div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px; font-weight: 500;">AI Assistant</div>
                            <strong>Website updated!</strong><br><br>
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