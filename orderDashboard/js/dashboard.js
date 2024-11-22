$(document).ready(function() {
    // Initialize sales chart with enhanced styling
    const ctx = document.getElementById('salesChart').getContext('2d');
    const salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Target',
                data: [5000, 6000, 7000, 8000, 9000, 8000],
                borderColor: '#A76F6F',
                backgroundColor: 'rgba(167, 111, 111, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 2
            },
            {
                label: 'Actual',
                data: [4000, 5500, 6500, 7800, 8500, 4000],
                borderColor: '#435B66',
                backgroundColor: 'rgba(67, 91, 102, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            family: "'Inter', sans-serif",
                            size: 12
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        color: '#f0f0f0'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });

    // Load vehicle orders
    function loadVehicleOrders() {
        const orders = [
            { model: 'Sedan Model Y', status: 'Booked', customer: 'Mathew' }
        ];

        const ordersList = orders.map(order => `
            <div class="order-item">
                <span class="model">${order.model}</span>
                <span class="status ${order.status.toLowerCase()}">${order.status}</span>
                <span class="customer">(${order.customer})</span>
            </div>
        `).join('');

        $('.target-list').html(ordersList);
    }

    // Initialize components
    loadVehicleOrders();

    // Event handlers
    $('.add-sale-btn').click(function() {
        // Implement add sale functionality
        console.log('Add sale clicked');
    });

    // Add tab indicator
    const tabsContainer = $('.analytics-tabs');
    tabsContainer.append('<div class="tab-indicator"></div>');
    const indicator = $('.tab-indicator');
    
    // Set initial indicator position
    function setIndicatorPosition(activeTab) {
        const tabPosition = activeTab.position();
        indicator.css({
            left: tabPosition.left,
            width: activeTab.outerWidth()
        });
    }
    
    // Set initial position
    setIndicatorPosition($('.tab.active'));

    // Enhanced tab switching functionality
    $('.tab').click(function() {
        const $this = $(this);
        if (!$this.hasClass('active')) {
            // Animate chart fade out
            $('.analytics-chart').addClass('chart-fade');
            
            // Update tabs
            $('.tab').removeClass('active');
            $this.addClass('active');
            
            // Animate indicator
            setIndicatorPosition($this);
            
            const selectedTab = $this.text().toLowerCase();
            
            // Update chart after short delay for animation
            setTimeout(() => {
                if (selectedTab === 'goal') {
                    salesChart.data.datasets[0].hidden = false;
                    salesChart.data.datasets[1].hidden = false;
                } else {
                    salesChart.data.datasets[0].hidden = true;
                    salesChart.data.datasets[1].hidden = false;
                }
                salesChart.update();
                
                // Animate chart fade in
                $('.analytics-chart').removeClass('chart-fade');
            }, 300);
        }
    });

    // Mobile menu toggle
    $('.menu-toggle').click(function() {
        $('.sidebar').toggleClass('show');
    });

    // Add daily tasks card next to sales target
    const dailyTasksCard = `
        <div class="daily-tasks">
            <h3>Daily Tasks</h3>
            <ul>
                <li>
                    <input type="checkbox" id="task1">
                    <label for="task1">Follow up with client A</label>
                </li>
                <li>
                    <input type="checkbox" id="task2">
                    <label for="task2">Prepare report for meeting</label>
                </li>
                <li>
                    <input type="checkbox" id="task3">
                    <label for="task3">Update sales pipeline</label>
                </li>
                <li>
                    <input type="checkbox" id="task4">
                    <label for="task4">Call supplier for inventory</label>
                </li>
            </ul>
            <button class="add-task-btn">Add Task</button>
        </div>
    `;
    $('.dashboard-grid').append(dailyTasksCard);

    // Move "Your sales" card below the sales target and daily tasks
    const yourSalesCard = $('.sales-analytics').detach();
    $('.dashboard-grid').append(yourSalesCard);

    // Add editable calendar
    const calendarCard = `
        <div class="calendar-card">
            <h3>Calendar</h3>
            <div id="calendar"></div>
        </div>
    `;
    $('.dashboard-grid').append(calendarCard);

    // Initialize calendar (using a simple example, you can replace it with a full-featured calendar library)
    $('#calendar').html('<p>Editable calendar goes here</p>');

    // Calendar Implementation
    function Calendar() {
        const today = new Date();
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();

        function generateCalendar(month, year) {
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            
            let calendarHTML = `
                <div class="calendar-header">
                    <div class="calendar-nav">
                        <button class="prev-month">←</button>
                        <h4>${monthNames[month]} ${year}</h4>
                        <button class="next-month">→</button>
                    </div>
                </div>
                <table class="calendar">
                    <thead>
                        <tr>
                            <th>Sun</th>
                            <th>Mon</th>
                            <th>Tue</th>
                            <th>Wed</th>
                            <th>Thu</th>
                            <th>Fri</th>
                            <th>Sat</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            let date = 1;
            for (let i = 0; i < 6; i++) {
                calendarHTML += "<tr>";
                for (let j = 0; j < 7; j++) {
                    if (i === 0 && j < firstDay.getDay()) {
                        calendarHTML += "<td></td>";
                    } else if (date > lastDay.getDate()) {
                        calendarHTML += "<td></td>";
                    } else {
                        const isToday = date === today.getDate() && 
                                      month === today.getMonth() && 
                                      year === today.getFullYear();
                        calendarHTML += `
                            <td class="${isToday ? 'today' : ''}" 
                                data-date="${year}-${month + 1}-${date}">
                                ${date}
                            </td>
                        `;
                        date++;
                    }
                }
                calendarHTML += "</tr>";
                if (date > lastDay.getDate()) break;
            }

            calendarHTML += "</tbody></table>";
            return calendarHTML;
        }

        // Initialize calendar
        $('.calendar-card').html(generateCalendar(currentMonth, currentYear));

        // Event handlers
        $('.calendar-card').on('click', '.prev-month', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            $('.calendar-card').html(generateCalendar(currentMonth, currentYear));
        });

        $('.calendar-card').on('click', '.next-month', function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            $('.calendar-card').html(generateCalendar(currentMonth, currentYear));
        });

        // Add event on date click
        $('.calendar-card').on('click', 'td[data-date]', function() {
            const date = $(this).data('date');
            const eventText = prompt('Add event for ' + date + ':');
            if (eventText) {
                $(this).addClass('has-event');
                $(this).attr('title', eventText);
            }
        });
    }

    // Initialize calendar
    Calendar();
});