// ===== CHATBOT WITH GROQ API =====
// Groq API Configuration
const GROQ_API_KEY = configSys.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

// Global variables
let selectedLocation = null;
let chatHistory = [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initChatbot();
});

function initChatbot() {
    const chatFloatBtn = document.getElementById('chatFloatBtn');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatPopup = document.getElementById('chatPopup');
    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');
    
    // Toggle chat popup
    chatFloatBtn.addEventListener('click', () => {
        chatPopup.classList.toggle('active');
        chatFloatBtn.classList.toggle('chat-open');
        
        if (chatPopup.classList.contains('active')) {
            chatInput.focus();
        }
    });
    
    // Close chat
    closeChatBtn.addEventListener('click', () => {
        chatPopup.classList.remove('active');
        chatFloatBtn.classList.remove('chat-open');
    });
    
    // Send message
    sendBtn.addEventListener('click', () => {
        sendMessage();
    });
    
    // Enter key to send
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Sample prompt buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('sample-prompt-btn')) {
            const prompt = e.target.getAttribute('data-prompt');
            if (prompt && selectedLocation) {
                chatInput.value = prompt;
                sendMessage();
                // Hide sample prompts after first use
                const samplePrompts = document.getElementById('samplePrompts');
                if (samplePrompts) {
                    samplePrompts.style.display = 'none';
                }
            }
        }
    });
}

// ===== LOCATION CONTEXT =====
function setLocationContext(feature) {
    selectedLocation = feature;
    const props = feature.properties;
    const coords = feature.geometry.coordinates;
    
    // Get species info
    const speciesInfo = speciesConfig[currentSpecies];
    
    // Update context display
    const contextInfo = document.getElementById('contextInfo');
    const chatContext = document.getElementById('chatContext');
    
    contextInfo.innerHTML = `
        <strong>${speciesInfo.name}</strong> - ${speciesInfo.location}<br>
        📅 ${formatDate(props.date)} | 
        📊 ${(props.bloom_probability * 100).toFixed(1)}% | 
        📍 ${coords[1].toFixed(4)}°N, ${coords[0].toFixed(4)}°E
    `;
    
    chatContext.style.display = 'block';
    
    // Enable chat input
    document.getElementById('chatInput').disabled = false;
    document.getElementById('sendBtn').disabled = false;
    document.getElementById('chatStatus').textContent = 'Point selected - Ask me!';
    
    // Show notification badge
    const badge = document.getElementById('chatBadge');
    badge.style.display = 'flex';
    badge.textContent = '!';
    
    // Add system message about new location
    addSystemMessage(`📍 Point selected: ${speciesInfo.name} at ${speciesInfo.location}. I can advise on routes, best timing, and nearby attractions!`);
}

// Update the marker click handler in app.js to call this
// Add this to the global scope to be called from app.js
window.updateChatbotLocation = setLocationContext;

// ===== MESSAGE HANDLING =====
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message || !selectedLocation) return;
    
    // Add user message to UI
    addUserMessage(message);
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Send to Groq API
    sendToGroq(message);
}

function addUserMessage(text) {
    const messagesContainer = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">👤</div>
        <div class="message-bubble">
            <p>${escapeHtml(text)}</p>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    
    // Add to history
    chatHistory.push({ role: 'user', content: text });
}

function addAssistantMessage(text) {
    const messagesContainer = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-bubble">
            <p>${formatMarkdown(text)}</p>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    
    // Add to history
    chatHistory.push({ role: 'assistant', content: text });
}

function addSystemMessage(text) {
    const messagesContainer = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">ℹ️</div>
        <div class="message-bubble">
            <p>${escapeHtml(text)}</p>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function showTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    indicator.style.display = 'flex';
    scrollToBottom();
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    indicator.style.display = 'none';
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ===== GROQ API INTEGRATION =====
async function sendToGroq(userMessage) {
    try {
        // Build context from selected location
        const context = buildLocationContext();
        
        // Prepare messages with context
        const messages = [
            {
                role: 'system',
                content: `You are an AI travel assistant specializing in flowers and ecotourism in Vietnam. You help tourists plan visits to flower viewing spots based on satellite-derived bloom forecast data.

Please respond in English, friendly, enthusiastic, and provide detailed information about:
- Travel routes from major cities (Hanoi, Ho Chi Minh City, Da Nang)
- Best times to visit based on bloom probability
- Nearby attractions, restaurants, and accommodations
- Travel tips and what to prepare
- Transportation methods and most convenient options

${context}`
            },
            ...chatHistory.slice(-10), // Last 10 messages for context
            {
                role: 'user',
                content: userMessage
            }
        ];
        
        // Call Groq API
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000,
                top_p: 1,
                stream: false
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'API request failed');
        }
        
        const data = await response.json();
        const assistantMessage = data.choices[0].message.content;
        
        // Hide typing indicator
        hideTypingIndicator();
        
        // Add assistant response
        addAssistantMessage(assistantMessage);
        
        // Hide badge
        document.getElementById('chatBadge').style.display = 'none';
        
    } catch (error) {
        console.error('❌ Groq API Error:', error);
        hideTypingIndicator();
        
        addAssistantMessage(`Sorry, I encountered an error processing your request. Please try again later. Error: ${error.message}`);
    }
}

function buildLocationContext() {
    if (!selectedLocation) return '';
    
    const props = selectedLocation.properties;
    const coords = selectedLocation.geometry.coordinates;
    const speciesInfo = speciesConfig[currentSpecies];
    
    // Determine quality assessment
    let quality = 'moderate';
    let recommendation = 'worth considering';
    
    if (props.bloom_probability >= 0.7) {
        quality = 'very high, excellent';
        recommendation = 'highly recommended, perfect timing';
    } else if (props.bloom_probability >= 0.6) {
        quality = 'high, very good';
        recommendation = 'recommended, favorable conditions';
    } else if (props.bloom_probability >= 0.5) {
        quality = 'fairly good';
        recommendation = 'worth visiting';
    }
    
    return `
SELECTED POINT INFORMATION:
- Flower species: ${speciesInfo.name} (${speciesInfo.icon})
- Location: ${speciesInfo.location}
- Coordinates: ${coords[1].toFixed(6)}°N, ${coords[0].toFixed(6)}°E
- Forecast date: ${formatDate(props.date)}
- Bloom probability: ${(props.bloom_probability * 100).toFixed(1)}%
- Assessment: ${quality}
- Recommendation: ${recommendation}

Use this information to advise the tourist.
`;
}

// ===== UTILITY FUNCTIONS =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatMarkdown(text) {
    // Simple markdown formatting
    let formatted = escapeHtml(text);
    
    // Bold **text**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic *text*
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Line breaks
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Lists
    formatted = formatted.replace(/^- (.+)$/gm, '• $1');
    
    return formatted;
}

console.log('✅ Chatbot initialized with Groq API');
