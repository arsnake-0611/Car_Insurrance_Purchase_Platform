class Sales {
    constructor() {
        this.currentTimeRange = 'monthly';
        this.salesData = {
            weekly: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                target: [10000, 12000, 15000, 13000, 16000, 14000, 11000],
                actual: [9500, 11800, 14500, 12800, 15800, 13500, 10800]
            },
            monthly: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                target: [50000, 60000, 70000, 80000, 90000, 100000],
                actual: [45000, 55000, 65000, 78000, 85000, 95000]
            },
            yearly: {
                labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
                target: [500000, 600000, 700000, 800000, 900000, 1000000],
                actual: [480000, 580000, 690000, 780000, 870000, 950000]
            }
        };
        
        this.initializeCharts();
        this.loadRecentSales();
        this.setupEventListeners();
        this.initializeAnimations();
    }

    initializeCharts() {
        const ctx = document.getElementById('detailedSalesChart').getContext('2d');
        this.salesChart = new Chart(ctx, {
            type: 'line',
            data: this.getChartData(this.currentTimeRange),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
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
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#333',
                        bodyColor: '#666',
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 12,
                        boxPadding: 6,
                        usePointStyle: true,
                        callbacks: {
                            label: (context) => {
                                return ` ${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => '$' + value.toLocaleString(),
                            font: {
                                family: "'Inter', sans-serif"
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: "'Inter', sans-serif"
                            }
                        }
                    }
                },
                animations: {
                    tension: {
                        duration: 1000,
                        easing: 'linear'
                    }
                }
            }
        });
    }

    getChartData(timeRange) {
        const data = this.salesData[timeRange];
        return {
            labels: data.labels,
            datasets: [{
                label: 'Sales Target',
                data: data.target,
                borderColor: '#A76F6F',
                backgroundColor: 'rgba(167, 111, 111, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            },
            {
                label: 'Actual Sales',
                data: data.actual,
                borderColor: '#435B66',
                backgroundColor: 'rgba(67, 91, 102, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        };
    }

    loadRecentSales() {
        const recentSales = [
            {
                customer: "Chris Wong",
                vehicle: "2024 Audi A8 L",
                amount: "$45,000",
                status: "Completed",
                date: "2024-03-15"
            },
            {
                customer: "Jane Smith",
                vehicle: "2023 BMW M4",
                amount: "$65,000",
                status: "Processing",
                date: "2024-03-14"
            },
            {
                customer: "Mike Johnson",
                vehicle: "2024 Mercedes S-Class",
                amount: "$55,000",
                status: "Completed",
                date: "2024-03-13"
            }
        ];

        const tbody = document.querySelector('.sales-table tbody');
        tbody.innerHTML = recentSales.map(sale => `
            <tr>
                <td>${sale.customer}</td>
                <td>${sale.vehicle}</td>
                <td>${sale.amount}</td>
                <td><span class="status-badge status-${sale.status.toLowerCase()}">${sale.status}</span></td>
            </tr>
        `).join('');

        // Add hover effect to table rows
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
                row.style.transition = 'background-color 0.3s ease';
            });
            row.addEventListener('mouseleave', () => {
                row.style.backgroundColor = '';
            });
        });
    }

    setupEventListeners() {
        document.getElementById('timeRange').addEventListener('change', (e) => {
            this.updateChartData(e.target.value);
        });

        // Add hover animations for cards
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
        });
    }

    updateChartData(timeRange) {
        this.currentTimeRange = timeRange;
        const newData = this.getChartData(timeRange);
        
        this.salesChart.data.labels = newData.labels;
        this.salesChart.data.datasets.forEach((dataset, index) => {
            dataset.data = newData.datasets[index].data;
        });
        
        this.salesChart.update('active');
    }

    initializeAnimations() {
        // Add entrance animations for cards
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    new Sales();
});