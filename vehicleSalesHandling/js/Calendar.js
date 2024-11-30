class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.events = this.loadEvents() || [];
        this.selectedDate = null;
        
        // Add resize listener
        window.addEventListener('resize', () => {
            this.renderCalendar();
        });
        
        this.init();
    }

    init() {
        this.renderCalendar();
        this.setupEventListeners();
    }

    loadEvents() {
        try {
            const savedEvents = localStorage.getItem('calendarEvents');
            if (savedEvents) {
                this.events = JSON.parse(savedEvents);
                console.log('Loaded events from localStorage:', this.events);
            } else {
                this.events = [];
                console.log('No saved events found in localStorage');
            }
        } catch (e) {
            console.error('Error loading events from localStorage:', e);
            this.events = [];
        }
    }

    saveEvents() {
        localStorage.setItem('calendarEvents', JSON.stringify(this.events));
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        document.getElementById('currentMonth').textContent = 
            new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });

        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';

        // Check if mobile view (can be adjusted based on your breakpoint)
        const isMobile = window.innerWidth <= 768;
        const totalDaysToShow = isMobile ? 35 : 42; // 5 rows for mobile, 6 for desktop

        // Previous month's days
        const prevMonthDays = new Date(year, month, 0).getDate();
        for (let i = startingDay - 1; i >= 0; i--) {
            const dayDiv = this.createDayElement(prevMonthDays - i, true);
            calendarDays.appendChild(dayDiv);
        }

        // Current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = this.createDayElement(day, false);
            if (this.isToday(year, month, day)) {
                dayDiv.classList.add('today');
            }
            calendarDays.appendChild(dayDiv);
        }

        // Next month's days
        const remainingDays = totalDaysToShow - (startingDay + daysInMonth);
        for (let day = 1; day <= remainingDays; day++) {
            const dayDiv = this.createDayElement(day, true);
            calendarDays.appendChild(dayDiv);
        }

        // Render events after calendar is built
        this.renderEvents();
    }

    renderEvents() {
        console.log('Rendering events:', this.events);
        
        const eventContainers = document.querySelectorAll('.events-container');
        eventContainers.forEach(container => container.innerHTML = '');

        this.events.forEach(event => {
            const eventDate = new Date(event.date + 'T00:00:00');
            
            if (eventDate.getMonth() === this.currentDate.getMonth() &&
                eventDate.getFullYear() === this.currentDate.getFullYear()) {
                
                const dayElement = this.getDayElement(eventDate.getDate());
                
                if (dayElement) {
                    const eventDiv = document.createElement('div');
                    eventDiv.className = 'event';
                    eventDiv.innerHTML = `<div class="event-title">${event.title}</div>`;

                    // Add click handler for event details
                    eventDiv.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.showEventDetails(event);
                    });
                    
                    const eventsContainer = dayElement.querySelector('.events-container');
                    if (eventsContainer) {
                        eventsContainer.appendChild(eventDiv);
                    }
                }
            }
        });
    }

    showEventDetails(event) {
        const modal = document.getElementById('eventModal');
        const form = document.getElementById('eventForm');
        const modalTitle = modal.querySelector('.modal-header h3');
        const saveBtn = modal.querySelector('.save-btn');
        const deleteBtn = document.createElement('button');
        
        // Set modal for editing
        modalTitle.textContent = 'Edit Event';
        saveBtn.textContent = 'Update Event';
        
        // Add delete button
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete Event';
        deleteBtn.onclick = () => this.deleteEvent(event.id);
        
        // Set form values
        form.querySelector('#eventTitle').value = event.title;
        form.querySelector('#eventDate').value = event.date;
        form.querySelector('#eventDescription').value = event.description || '';
        
        // Store event ID for updating
        form.dataset.eventId = event.id;
        
        // Add delete button to modal footer
        const modalFooter = modal.querySelector('.modal-footer');
        modalFooter.innerHTML = ''; // Clear existing buttons
        modalFooter.appendChild(deleteBtn);
        modalFooter.appendChild(document.createElement('button')).outerHTML = 
            '<button type="submit" class="save-btn">Update Event</button>';
        
        // Show modal
        modal.style.display = 'flex';
    }

    showEventModal(dateString) {
        const modal = document.getElementById('eventModal');
        const form = document.getElementById('eventForm');
        const modalTitle = modal.querySelector('.modal-header h3');
        const saveBtn = modal.querySelector('.save-btn');
        
        // Reset form and set for new event
        form.reset();
        delete form.dataset.eventId;
        modalTitle.textContent = 'Add New Event';
        saveBtn.textContent = 'Save Event';
        
        // Set date if provided
        if (dateString) {
            document.getElementById('eventDate').value = dateString;
        }
        
        // Reset modal footer to default state
        const modalFooter = modal.querySelector('.modal-footer');
        modalFooter.innerHTML = `
            <button type="submit" class="save-btn">Save Event</button>
        `;
        
        modal.style.display = 'flex';
    }

    hideEventModal() {
        const modal = document.getElementById('eventModal');
        modal.style.display = 'none';
        document.getElementById('eventForm').reset();
        this.selectedDate = null;
    }

    setupEventListeners() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });

        document.querySelector('.close-modal').addEventListener('click', () => {
            this.hideEventModal();
        });

        document.querySelector('.cancel-btn').addEventListener('click', () => {
            this.hideEventModal();
        });

        // Form submission
        const form = document.getElementById('eventForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Form submitted'); // Debug log
            this.saveEvent();
        });

        // Make time inputs optional
        const timeInputs = document.querySelectorAll('input[type="time"]');
        timeInputs.forEach(input => {
            input.removeAttribute('required');
        });
    }

    saveEvent() {
        const form = document.getElementById('eventForm');
        const eventId = form.dataset.eventId;
        const title = form.querySelector('#eventTitle').value.trim();
        const date = form.querySelector('#eventDate').value;
        const description = form.querySelector('#eventDescription').value.trim();

        if (!title) {
            return;
        }

        if (!date) {
            return;
        }

        const eventData = {
            id: eventId ? parseInt(eventId) : Date.now(),
            title: title,
            date: date,
            description: description || ''
        };

        if (eventId) {
            // Update existing event
            const eventIndex = this.events.findIndex(e => e.id === parseInt(eventId));
            if (eventIndex !== -1) {
                this.events[eventIndex] = eventData;
            }
        } else {
            // Add new event
            this.events.push(eventData);
        }

        // Save to localStorage
        try {
            localStorage.setItem('calendarEvents', JSON.stringify(this.events));
            console.log('Successfully saved events to localStorage:', this.events);
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            alert('Error saving event. Please try again.');
            return;
        }

        // Hide modal and reset form
        this.hideEventModal();
        form.reset();

        // Re-render calendar
        this.renderCalendar();
    }

    deleteEvent(eventId) {
        if (confirm('Are you sure you want to delete this event?')) {
            this.events = this.events.filter(event => event.id !== eventId);
            
            // Save to localStorage
            try {
                localStorage.setItem('calendarEvents', JSON.stringify(this.events));
                console.log('Successfully deleted event and updated localStorage');
            } catch (e) {
                console.error('Error saving to localStorage:', e);
                alert('Error deleting event. Please try again.');
                return;
            }

            // Hide modal and re-render calendar
            this.hideEventModal();
            this.renderCalendar();
        }
    }

    getDayElement(day) {
        const days = document.querySelectorAll('.calendar-day:not(.other-month)');
        return Array.from(days).find(element => {
            const dayNumber = element.querySelector('.day-number').textContent;
            return parseInt(dayNumber) === day;
        });
    }

    isToday(year, month, day) {
        const today = new Date();
        return today.getDate() === day &&
               today.getMonth() === month &&
               today.getFullYear() === year;
    }

    createDayElement(day, isOtherMonth) {
        const dayDiv = document.createElement('div');
        dayDiv.className = `calendar-day${isOtherMonth ? ' other-month' : ''}`;
        
        // Add day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayDiv.appendChild(dayNumber);
        
        // Add add-event button
        const addEventBtn = document.createElement('button');
        addEventBtn.className = 'add-event-btn';
        addEventBtn.innerHTML = '<img src="./icon/plus-black.png" alt="Add">';
        addEventBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth() + 1;
            const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            this.showEventModal(dateString);
        });
        dayDiv.appendChild(addEventBtn);
        
        // Add events container
        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'events-container';
        dayDiv.appendChild(eventsContainer);
        
        return dayDiv;
    }
}

// Initialize when document is ready
$(document).ready(function() {
    new Calendar();
}); 