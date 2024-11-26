$(document).ready(function() {
    let isMenuOpen = false;

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

    // Mobile menu toggle handler
    $('.menu-toggle').click(function(e) {
        e.stopPropagation();
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            $('.sidebar').addClass('show');
            $('.sidebar-overlay').css('display', 'block');
            requestAnimationFrame(() => {
                $('.sidebar-overlay').addClass('show');
            });
            $('body').css('overflow', 'hidden');
        } else {
            closeMobileMenu();
        }
    });

    // Close menu when clicking overlay
    $('.sidebar-overlay').click(function() {
        closeMobileMenu();
    });

    function closeMobileMenu() {
        isMenuOpen = false;
        $('.sidebar').removeClass('show');
        $('.sidebar-overlay').removeClass('show');
        $('body').css('overflow', '');
        
        // Wait for transition to complete before hiding overlay
        setTimeout(() => {
            if (!$('.sidebar-overlay').hasClass('show')) {
                $('.sidebar-overlay').css('display', 'none');
            }
        }, 300);
    }

    // Update handleResize function
    function handleResize() {
        if (window.innerWidth <= 768) {
            // Mobile view - remove all hover handlers
            $('.sidebar').off('mouseenter mouseleave');
            
            // Force show text in mobile view
            $('.nav-text, .main-nav h3, .settings-nav h3').css({
                'opacity': '1',
                'visibility': 'visible',
                'position': 'static',
                'width': 'auto'
            });
            
            if (!isMenuOpen) {
                $('.sidebar').removeClass('show');
                $('.sidebar-overlay').removeClass('show').css('display', 'none');
            }
        } else {
            // Desktop view
            closeMobileMenu();
            $('.sidebar').css({
                'transform': '',
                'left': '',
                'width': ''
            });
            
            // Reattach hover handlers for desktop only
            initializeDesktopHover();
        }
    }

    // Separate function for desktop hover functionality
    function initializeDesktopHover() {
        if (window.innerWidth > 768) {
            $('.sidebar').hover(
                function() {
                    $(this).addClass('expanded');
                },
                function() {
                    $(this).removeClass('expanded');
                }
            );
        }
    }

    // Initial check and window resize handler
    handleResize();
    $(window).resize(handleResize);

    // Update chart responsiveness
    const updateChartResponsiveness = () => {
        if (window.innerWidth > 768) {
            salesChart.options.maintainAspectRatio = false;
            salesChart.options.plugins.legend.position = 'top';
            salesChart.options.scales.y.beginAtZero = true;
        }
        salesChart.update();
    };

    // Call on load and resize
    updateChartResponsiveness();
    $(window).resize(updateChartResponsiveness);

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

    // Theme handling
    function updateChartTheme(isDark) {
        const colors = {
            light: {
                grid: '#f0f0f0',
                text: '#333',
                muted: '#666',
                dataset1: {
                    border: '#A76F6F',
                    background: 'rgba(167, 111, 111, 0.1)'
                },
                dataset2: {
                    border: '#435B66',
                    background: 'rgba(67, 91, 102, 0.1)'
                }
            },
            dark: {
                grid: '#333333',
                text: '#E8E8E8',
                muted: '#BDBDBD',
                dataset1: {
                    border: '#8FB3D9',
                    background: 'rgba(143, 179, 217, 0.1)'
                },
                dataset2: {
                    border: '#E6C3C3',
                    background: 'rgba(230, 195, 195, 0.1)'
                }
            }
        };

        const theme = colors[isDark ? 'dark' : 'light'];
        
        // Update chart colors
        Object.assign(salesChart.options.scales.y.grid, { color: theme.grid });
        Object.assign(salesChart.options.scales.x.grid, { color: theme.grid });
        Object.assign(salesChart.options.plugins.legend.labels, { color: theme.text });
        Object.assign(salesChart.options.scales.y.ticks, { color: theme.muted });
        Object.assign(salesChart.options.scales.x.ticks, { color: theme.muted });
        
        // Update datasets
        Object.assign(salesChart.data.datasets[0], {
            borderColor: theme.dataset1.border,
            backgroundColor: theme.dataset1.background
        });
        Object.assign(salesChart.data.datasets[1], {
            borderColor: theme.dataset2.border,
            backgroundColor: theme.dataset2.background
        });
        
        salesChart.update();
    }

    // Update the setTheme function
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const isDark = theme === 'dark';
        updateChartTheme(isDark);
        
        // Toggle icon visibility
        $('.dark-icon').toggle(!isDark);
        $('.light-icon').toggle(isDark);
    }

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Theme toggle handler
    $('#theme-toggle').click(function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    // Update chart configuration
    const chartConfig = {
        // ... existing chart config ...
        options: {
            // ... existing options ...
            plugins: {
                legend: {
                    labels: {
                        color: savedTheme === 'dark' ? '#E1E1E1' : '#333'
                    }
                }
            },
            scales: {
                y: {
                    grid: {
                        color: savedTheme === 'dark' ? '#2D2D2D' : '#f0f0f0'
                    }
                },
                x: {
                    grid: {
                        color: savedTheme === 'dark' ? '#2D2D2D' : '#f0f0f0'
                    }
                }
            }
        }
    };

    // Sidebar hover handling with improved intent detection
    let hoverTimeout;
    let leaveTimeout;
    let hoverStartTime;
    let minHoverTime = 200; // Increased minimum hover time
    let isIntentional = false;

    $('.sidebar').hover(
        function() {
            // On mouse enter
            clearTimeout(leaveTimeout);
            hoverStartTime = Date.now();
            
            hoverTimeout = setTimeout(() => {
                // Only expand if mouse has been hovering for minimum time
                if (Date.now() - hoverStartTime >= minHoverTime) {
                    isIntentional = true;
                    $(this).addClass('expanded');
                }
            }, 200); // Increased delay to prevent accidental triggers
        },
        function() {
            // On mouse leave
            clearTimeout(hoverTimeout);
            isIntentional = false;
            $(this).removeClass('expanded');
        }
    );

    // Prevent hover state on mobile
    function handleResize() {
        if (window.innerWidth <= 768) {
            $('.sidebar').off('mouseenter mouseleave');
        } else {
            // Reattach hover handlers if needed
            $('.sidebar').hover(
                function() {
                    clearTimeout(leaveTimeout);
                    hoverTimeout = setTimeout(() => {
                        $(this).addClass('expanded');
                    }, 300);
                },
                function() {
                    clearTimeout(hoverTimeout);
                    leaveTimeout = setTimeout(() => {
                        $(this).removeClass('expanded');
                    }, 300);
                }
            );
        }
    }

    // Initial check and window resize handler
    handleResize();
    $(window).resize(handleResize);
});