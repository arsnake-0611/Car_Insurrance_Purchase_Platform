$(document).ready(function() {
    // Sample car insurance client data
    const clients = [
        {
            id: 1,
            name: "John Smith",
            email: "john.smith@email.com",
            phone: "9876-5432",
            vehicle: {
                make: "Toyota",
                model: "Camry",
                year: "2022",
                plateNumber: "AB 1234",
                bodyType: "Sedan"
            },
            policy: {
                number: "POL-2024-001",
                type: "comprehensive",
                status: "active",
                startDate: "2024-01-01",
                endDate: "2024-12-31",
                premium: 12800,
                claims: 0
            }
        },
        {
            id: 2,
            name: "Sarah Johnson",
            email: "sarah.j@email.com",
            phone: "9123-4567",
            vehicle: {
                make: "BMW",
                model: "X5",
                year: "2023",
                plateNumber: "CD 5678",
                bodyType: "SUV"
            },
            policy: {
                number: "POL-2024-002",
                type: "comprehensive",
                status: "pending",
                startDate: "2023-12-31",
                endDate: "2024-01-31",
                premium: 25600,
                claims: 1
            }
        }
    ];

    function renderClients(clientsToRender) {
        const clientList = $('#clientList');
        clientList.empty();

        clientsToRender.forEach((client, index) => {
            const statusEmoji = {
                active: '🟢',
                pending: '🟡',
                expired: '🔴'
            };

            const card = $(`
                <div class="client-card">
                    <div class="client-header">
                        <h3>🚗 ${client.name}</h3>
                        <p>📧 ${client.email} | 📱 ${client.phone}</p>
                        <p>Policy Status: ${statusEmoji[client.policy.status]} ${client.policy.status.toUpperCase()}</p>
                    </div>
                    
                    <div class="vehicle-info">
                        <h4>Vehicle Details</h4>
                        <p>🚘 ${client.vehicle.make} ${client.vehicle.model} (${client.vehicle.year})</p>
                        <p>🔢 Plate: ${client.vehicle.plateNumber} | Type: ${client.vehicle.bodyType}</p>
                    </div>
                    
                    <div class="policy-details">
                        <div class="policy-item">
                            <div class="item-label">Policy Number</div>
                            <div class="item-value">📋 ${client.policy.number}</div>
                        </div>
                        <div class="policy-item">
                            <div class="item-label">Coverage</div>
                            <div class="item-value">🛡️ ${client.policy.type}</div>
                        </div>
                        <div class="policy-item">
                            <div class="item-label">Premium</div>
                            <div class="item-value">💰 HK$${client.policy.premium}</div>
                        </div>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="action-btn view-btn" data-id="${client.id}">
                            👁️ View Details
                        </button>
                        <button class="action-btn chat-btn" data-id="${client.id}">
                            💬 Chat
                        </button>
                        <button class="action-btn renew-btn" data-id="${client.id}">
                            🔄 Renew Policy
                        </button>
                    </div>
                </div>
            `);

            clientList.append(card);
            
            setTimeout(() => {
                card.addClass('visible');
            }, index * 100);
        });
    }

    // Initial render
    renderClients(clients);

    // Enhanced search functionality
    $('#searchClient').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        const filteredClients = clients.filter(client => 
            client.name.toLowerCase().includes(searchTerm) ||
            client.email.toLowerCase().includes(searchTerm) ||
            `${client.vehicle.make} ${client.vehicle.model}`.toLowerCase().includes(searchTerm) ||
            client.vehicle.plateNumber.toLowerCase().includes(searchTerm)
        );
        renderClients(filteredClients);
    });

    // Status filter
    $('#statusFilter').on('change', function() {
        const status = $(this).val();
        const filteredClients = status ? 
            clients.filter(client => client.policy.status === status) : 
            clients;
        renderClients(filteredClients);
    });

    // Coverage filter
    $('#coverageFilter').on('change', function() {
        const coverage = $(this).val();
        const filteredClients = coverage ? 
            clients.filter(client => client.policy.type === coverage) : 
            clients;
        renderClients(filteredClients);
    });

    // Button click handlers
    $(document).on('click', '.view-btn', function() {
        const clientId = $(this).data('id');
        showNotification(`Viewing details for client ID: ${clientId}`);
    });

    $(document).on('click', '.chat-btn', function() {
        const clientId = $(this).data('id');
        showNotification(`Opening chat for client ID: ${clientId}`);
    });

    $(document).on('click', '.renew-btn', function() {
        const clientId = $(this).data('id');
        showNotification(`Initiating policy renewal for client ID: ${clientId}`);
    });

    function showNotification(message) {
        const notification = $('#notification');
        notification.text(message)
            .fadeIn()
            .css({
                'transform': 'translateY(0)',
                'opacity': '1'
            });
        
        setTimeout(() => {
            notification.css({
                'transform': 'translateY(-20px)',
                'opacity': '0'
            }).fadeOut();
        }, 3000);
    }
});
