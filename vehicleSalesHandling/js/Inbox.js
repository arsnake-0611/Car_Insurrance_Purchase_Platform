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
        // Load conversations based on orders data
        const orders = [
            {
                id: "LM2024001",
                customer: "Chris Wong",
                vehicle: "2024 Audi A8 L",
                date: "2024-03-15",
                amount: "$45,000",
                status: "processing",
            },
            {
                id: "LM2023089",
                customer: "Jane Smith",
                vehicle: "2023 Porsche 911 Carrera S",
                date: "2024-03-14",
                amount: "$55,000",
                status: "completed",
            },
            {
                id: "LM20230023",
                customer: "Mike Johnson",
                vehicle: "2024 BMW M4 Competition",
                date: "2024-03-13",
                amount: "$65,000",
                status: "cancelled",
            }
        ];

        // Convert orders to conversations
        this.conversations = orders.map(order => ({
            id: parseInt(order.id.replace(/\D/g, '')),
            customer: {
                name: order.customer,
                email: `${order.customer.toLowerCase().replace(' ', '.')}@example.com`,
                orderId: order.id
            },
            messages: [
                {
                    id: 1,
                    sender: "customer",
                    content: `Hi, I'm interested in the ${order.vehicle}. Can you provide more details?`,
                    timestamp: order.date + "T10:30:00",
                    isRead: order.status !== "processing"
                },
                {
                    id: 2,
                    sender: "agent",
                    content: `Hello ${order.customer.split(' ')[0]}! Thank you for your interest in the ${order.vehicle}. The price is ${order.amount}. Would you like to schedule a test drive?`,
                    timestamp: order.date + "T10:35:00",
                    isRead: true
                }
            ],
            lastUpdate: order.date + "T10:35:00",
            orderStatus: order.status
        }));

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

        // Add send button click handler
        document.addEventListener('click', (e) => {
            if (e.target.closest('.send-btn')) {
                this.sendNewMessage();
            }
        });

        // Add input focus handler
        document.addEventListener('focus', (e) => {
            if (e.target.id === 'messageInput') {
                this.markConversationAsRead();
            }
        }, true);
    }

    renderConversationList() {
        const conversationList = document.querySelector('.conversation-list');
        conversationList.innerHTML = this.conversations.map(conv => `
            <div class="conversation-item ${conv.id === this.currentConversation?.id ? 'active' : ''} ${conv.orderStatus}" 
                 data-id="${conv.id}">
                <div class="conversation-avatar">
                    ${this.getInitials(conv.customer.name)}
                </div>
                <div class="conversation-info">
                    <div class="conversation-header">
                        <span class="customer-name">${conv.customer.name}</span>
                        <span class="timestamp">${this.formatDate(conv.lastUpdate)}</span>
                    </div>
                    <div class="order-info">
                        <span class="order-id">Order: ${conv.customer.orderId}</span>
                        <span class="status-badge status-${conv.orderStatus}">
                            ${conv.orderStatus.charAt(0).toUpperCase() + conv.orderStatus.slice(1)}
                        </span>
                    </div>
                    <div class="last-message">${this.getLastMessage(conv)}</div>
                </div>
                ${this.getUnreadCount(conv) > 0 ? 
                    `<div class="unread-count">${this.getUnreadCount(conv)}</div>` : 
                    ''}
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
                    <textarea style="height: 50px;" id="messageInput" placeholder="Type your message..."></textarea>
                    <button class="send-btn">
                        <img style="width: 20px; height: 20px;" src="./icon/send-black.png" alt="Send Icon">
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
        const searchTerm = query.toLowerCase();
        const filteredConversations = this.conversations.filter(conv => 
            conv.customer.name.toLowerCase().includes(searchTerm) ||
            conv.customer.orderId.toLowerCase().includes(searchTerm) ||
            conv.messages.some(msg => msg.content.toLowerCase().includes(searchTerm))
        );
        
        const conversationList = document.querySelector('.conversation-list');
        conversationList.innerHTML = filteredConversations.map(conv => `
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

    sendNewMessage() {
        const input = document.getElementById('messageInput');
        const content = input.value.trim();
        
        if (!content || !this.currentConversation) return;

        const newMessage = {
            id: this.currentConversation.messages.length + 1,
            sender: 'agent',
            content: content,
            timestamp: new Date().toISOString()
        };

        this.currentConversation.messages.push(newMessage);
        this.currentConversation.lastUpdate = newMessage.timestamp;
        
        input.value = '';
        this.renderConversation();
        this.renderConversationList();
    }

    scrollToBottom() {
        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    markConversationAsRead() {
        if (this.currentConversation) {
            this.currentConversation.messages.forEach(msg => {
                if (msg.sender === 'customer') {
                    msg.isRead = true;
                }
            });
            this.renderConversationList();
        }
    }

    addConversationListeners() {
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', () => {
                const conversationId = parseInt(item.dataset.id);
                this.currentConversation = this.conversations.find(c => c.id === conversationId);
                this.renderConversation();
                this.renderConversationList(); // Re-render to update active state
            });
        });
    }

    renderMessage(msg) {
        const time = new Date(msg.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
            <div class="message ${msg.sender}">
                <div class="message-content">${msg.content}</div>
                <div class="message-timestamp">${time}</div>
            </div>
        `;
    }
}

// Initialize the inbox when document is ready
$(document).ready(function() {
    new Inbox();
});
