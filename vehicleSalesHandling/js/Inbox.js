class Inbox {
    constructor() {
        this.conversations = [];
        this.currentConversation = null;
        this.init();
    }

    init() {
        this.loadConversations();
        this.setupEventListeners();
    }

    loadConversations() {
        // Simulated conversations data
        this.conversations = [
            {
                id: 1,
                customer: {
                    name: "John Doe",
                    email: "john.doe@example.com",
                    orderId: "ORD-1234"
                },
                messages: [
                    {
                        id: 1,
                        sender: "customer",
                        content: "Hi, I'm interested in the 2024 Model X SUV. Can you provide more details about available colors?",
                        timestamp: "2024-03-20T10:30:00"
                    },
                    {
                        id: 2,
                        sender: "agent",
                        content: "Hello John! The 2024 Model X SUV is available in Pearl White, Midnight Silver, Deep Blue, and Solid Black. Would you like to see some photos?",
                        timestamp: "2024-03-20T10:35:00"
                    }
                ],
                lastUpdate: "2024-03-20T10:35:00"
            }
            // Add more conversations as needed
        ];
        this.renderConversationList();
    }

    setupEventListeners() {
        document.getElementById('searchConversations').addEventListener('input', (e) => {
            this.searchConversations(e.target.value);
        });

        document.getElementById('messageInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendNewMessage();
            }
        });
    }

    renderConversationList() {
        const conversationList = document.querySelector('.conversation-list');
        conversationList.innerHTML = this.conversations.map(conv => `
            <div class="conversation-item ${conv.id === this.currentConversation?.id ? 'active' : ''}" 
                 data-id="${conv.id}">
                <div class="conversation-avatar">
                    ${this.getInitials(conv.customer.name)}
                </div>
                <div class="conversation-info">
                    <div class="conversation-header">
                        <span class="customer-name">${conv.customer.name}</span>
                        <span class="timestamp">${this.formatDate(conv.lastUpdate)}</span>
                    </div>
                    <div class="order-id">Order: ${conv.customer.orderId}</div>
                    <div class="last-message">${this.getLastMessage(conv)}</div>
                </div>
            </div>
        `).join('');

        this.addConversationListeners();
    }

    getInitials(name) {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();
    }

    renderConversation() {
        if (!this.currentConversation) return;

        const chatArea = document.querySelector('.chat-area');
        chatArea.innerHTML = `
            <div class="chat-header">
                <div class="conversation-avatar">
                    ${this.getInitials(this.currentConversation.customer.name)}
                </div>
                <div class="customer-info">
                    <h3>${this.currentConversation.customer.name}</h3>
                    <div class="order-id">Order: ${this.currentConversation.customer.orderId}</div>
                </div>
            </div>
            <div class="messages-container">
                ${this.currentConversation.messages.map(msg => this.renderMessage(msg)).join('')}
            </div>
            <div class="chat-input-area">
                <div class="chat-input-wrapper">
                    <textarea id="messageInput" placeholder="Type your message..."></textarea>
                    <button class="send-btn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        this.scrollToBottom();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    getLastMessage(conversation) {
        if (conversation.messages.length > 0) {
            return conversation.messages[conversation.messages.length - 1].content;
        }
        return "No messages yet";
    }

    getUnreadCount(conversation) {
        return conversation.messages.filter(m => !m.isRead).length;
    }

    searchConversations(query) {
        // Implement search conversations functionality
        alert('Search conversations functionality to be implemented');
    }

    sendNewMessage() {
        // Implement send new message functionality
        alert('Send new message functionality to be implemented');
    }

    scrollToBottom() {
        // Implement scroll to bottom functionality
        alert('Scroll to bottom functionality to be implemented');
    }
}

// Initialize the inbox when document is ready
$(document).ready(function() {
    new Inbox();
});
