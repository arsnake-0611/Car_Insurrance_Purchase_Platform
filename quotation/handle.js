  $(document).ready(function() {
      // Search functionality
      $('#searchQuotes').on('keyup', function() {
          const searchValue = $(this).val().toLowerCase();
          $('.quote-card').each(function() {
              const cardText = $(this).text().toLowerCase();
              $(this).toggle(cardText.includes(searchValue));
          });
      });
  
      // Filter functionality
      $('.filter-select').on('change', function() {
          const statusFilter = $('#statusFilter').val();
          const dateFilter = $('#dateFilter').val();
  
          $('.quote-card').each(function() {
              const status = $(this).find('.status-badge').data('status');
              const date = $(this).data('date');
              
              let showCard = true;
              
              if (statusFilter && status !== statusFilter) showCard = false;
              if (dateFilter && !matchesDateFilter(date, dateFilter)) showCard = false;
              
              $(this).toggle(showCard);
          });
      });
  
      // Hover animations
      $('.quote-card').hover(
          function() {
              $(this).find('.btn').css('transform', 'translateY(-2px)');
          },
          function() {
              $(this).find('.btn').css('transform', 'translateY(0)');
          }
      );
  
      // Dark mode toggle
      $('#themeSwitch').change(function() {
          $('body').toggleClass('theme-dark');
          $('.quote-card, .search-filter').toggleClass('theme-dark');
      });
  });
  
  const quoteData = {
      'AQ-2023-001': {
          vehicleMake: 'Toyota',
          vehicleModel: 'Camry',
          vehicleYear: '2020',
          bodyType: 'Sedan',
          seatingCapacity: '5',
          cylinderCapacity: '2000',
          vehicleValue: '200000',
          fullName: 'John Smith',
          email: 'john.smith@email.com',
          phoneNumber: '+852 1234 5678',
          drivingExperience: '5',
          coveragePlan: 'comprehensive',
          paymentMethod: 'CreditCard'
      },
      'AQ-2023-002': {
          vehicleMake: 'Honda',
          vehicleModel: 'Civic',
          vehicleYear: '2021',
          bodyType: 'Sedan',
          seatingCapacity: '5',
          cylinderCapacity: '1600',
          vehicleValue: '150000',
          fullName: 'Mary Johnson',
          email: 'mary.j@email.com',
          phoneNumber: '+852 2345 6789',
          drivingExperience: '3',
          coveragePlan: 'third party',
          paymentMethod: 'PayPal'
      },
      'AQ-2023-003': {
          vehicleMake: 'BMW',
          vehicleModel: 'X5',
          vehicleYear: '2019',
          bodyType: 'SUV',
          seatingCapacity: '5',
          cylinderCapacity: '3000',
          vehicleValue: '400000',
          fullName: 'David Lee',
          email: 'david.lee@email.com',
          phoneNumber: '+852 3456 7890',
          drivingExperience: '10',
          coveragePlan: 'comprehensive',
          paymentMethod: 'Bank Transfer'
      }
  };
  
  function viewQuoteDetails(quoteId) {
      const data = quoteData[quoteId];
      const modal = document.getElementById('quoteModal');
      const detailsHTML = `
          <div class="detail-section">
              <h3>Vehicle Information</h3>
              <div class="detail-row"><span class="label">Vehicle Brand:</span><span class="value">${data.vehicleMake}</span></div>
              <div class="detail-row"><span class="label">Vehicle Model:</span><span class="value">${data.vehicleModel}</span></div>
              <div class="detail-row"><span class="label">Manufacturing Year:</span><span class="value">${data.vehicleYear}</span></div>
              <div class="detail-row"><span class="label">Body Type:</span><span class="value">${data.bodyType}</span></div>
              <div class="detail-row"><span class="label">Seating Capacity:</span><span class="value">${data.seatingCapacity}</span></div>
              <div class="detail-row"><span class="label">Cylinder Capacity (C.C.):</span><span class="value">${data.cylinderCapacity}</span></div>
              <div class="detail-row"><span class="label">Estimated Vehicle Value (HK$):</span><span class="value">${data.vehicleValue}</span></div>
          </div>
          <div class="detail-section">
              <h3>Personal Information</h3>
              <div class="detail-row"><span class="label">Full Name:</span><span class="value">${data.fullName}</span></div>
              <div class="detail-row"><span class="label">Email Address:</span><span class="value">${data.email}</span></div>
              <div class="detail-row"><span class="label">Phone Number:</span><span class="value">${data.phoneNumber}</span></div>
              <div class="detail-row"><span class="label">Driving Experience:</span><span class="value">${data.drivingExperience} years</span></div>
          </div>
          <div class="detail-section">
              <h3>Coverage & Payment</h3>
              <div class="detail-row"><span class="label">Coverage Plan:</span><span class="value">${data.coveragePlan}</span></div>
              <div class="detail-row"><span class="label">Payment Method:</span><span class="value">${data.paymentMethod}</span></div>
          </div>
      `;
      
      modal.querySelector('.quote-full-details').innerHTML = detailsHTML;
      modal.style.display = 'block';
      
      // Close modal functionality
      modal.querySelector('.close-modal').onclick = () => {
          modal.style.display = 'none';
      };
      
      modal.querySelector('.close-modal').onclick = closeModal;
      
      // Close on clicking outside the modal
      window.onclick = (event) => {
          if (event.target === modal) {
              closeModal();
          }
      };
      
      // Close on escape key
      document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
              closeModal();
          }
      });
  }
  
  function matchesDateFilter(date, filter) {
      const quoteDate = new Date(date);
      const today = new Date();
      
      switch(filter) {
          case 'today':
              return quoteDate.toDateString() === today.toDateString();
          case 'week':
              const weekAgo = new Date(today.setDate(today.getDate() - 7));
              return quoteDate >= weekAgo;
          case 'month':
              const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
              return quoteDate >= monthAgo;
          default:
              return true;
      }
  }
  
  function editQuote(quoteId) {
      const data = quoteData[quoteId];
      const modal = document.getElementById('quoteModal');
      
      const editHTML = `
          <h2>Edit Quote ${quoteId}</h2>
          <form id="editQuoteForm">
              <div class="detail-section">
                  <h3>Vehicle Information</h3>
                  <div class="form-row">
                      <label>Vehicle Brand:</label>
                      <input type="text" name="vehicleMake" value="${data.vehicleMake}">
                  </div>
                  <div class="form-row">
                      <label>Vehicle Model:</label>
                      <input type="text" name="vehicleModel" value="${data.vehicleModel}">
                  </div>
                  <div class="form-row">
                      <label>Manufacturing Year:</label>
                      <input type="text" name="vehicleYear" value="${data.vehicleYear}">
                  </div>
                  <div class="form-row">
                      <label>Body Type:</label>
                      <input type="text" name="bodyType" value="${data.bodyType}">
                  </div>
                  <div class="form-row">
                      <label>Seating Capacity:</label>
                      <input type="text" name="seatingCapacity" value="${data.seatingCapacity}">
                  </div>
                  <div class="form-row">
                      <label>Cylinder Capacity:</label>
                      <input type="text" name="cylinderCapacity" value="${data.cylinderCapacity}">
                  </div>
                  <div class="form-row">
                      <label>Vehicle Value:</label>
                      <input type="text" name="vehicleValue" value="${data.vehicleValue}">
                  </div>
              </div>
              <div class="detail-section">
                  <h3>Personal Information</h3>
                  <div class="form-row">
                      <label>Full Name:</label>
                      <input type="text" name="fullName" value="${data.fullName}">
                  </div>
                  <div class="form-row">
                      <label>Email:</label>
                      <input type="email" name="email" value="${data.email}">
                  </div>
                  <div class="form-row">
                      <label>Phone:</label>
                      <input type="text" name="phoneNumber" value="${data.phoneNumber}">
                  </div>
                  <div class="form-row">
                      <label>Driving Experience:</label>
                      <input type="text" name="drivingExperience" value="${data.drivingExperience}">
                  </div>
              </div>
              <div class="detail-section">
                  <h3>Coverage & Payment</h3>
                  <div class="form-row">
                      <label>Coverage Plan:</label>
                      <select name="coveragePlan">
                          <option value="comprehensive" ${data.coveragePlan === 'comprehensive' ? 'selected' : ''}>Comprehensive</option>
                          <option value="third party" ${data.coveragePlan === 'third party' ? 'selected' : ''}>Third Party</option>
                      </select>
                  </div>
                  <div class="form-row">
                      <label>Payment Method:</label>
                      <select name="paymentMethod">
                          <option value="CreditCard" ${data.paymentMethod === 'CreditCard' ? 'selected' : ''}>Credit Card</option>
                          <option value="BankTransfer" ${data.paymentMethod === 'BankTransfer' ? 'selected' : ''}>Bank Transfer</option>
                          <option value="PayPal" ${data.paymentMethod === 'PayPal' ? 'selected' : ''}>PayPal</option>
                      </select>
                  </div>
              </div>
              <div class="form-actions">
                  <button type="submit" class="btn btn-primary">Save Changes</button>
                  <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
              </div>
          </form>
      `;
      
      modal.querySelector('.quote-full-details').innerHTML = editHTML;
      modal.style.display = 'block';
      
      // Handle form submission
      document.getElementById('editQuoteForm').onsubmit = function(e) {
          e.preventDefault();
          const formData = new FormData(e.target);
          const updatedData = Object.fromEntries(formData);
          
          // Update the quote data
          quoteData[quoteId] = {...quoteData[quoteId], ...updatedData};
          
          // Update the card display
          updateQuoteCard(quoteId, updatedData);
          
          closeModal();
      };
  }
  
  function closeModal() {
      document.getElementById('quoteModal').style.display = 'none';
  }
  
  function updateQuoteCard(quoteId, data) {
      const card = document.querySelector(`.quote-card[data-quote-id="${quoteId}"]`);
      if (card) {
          card.querySelector('.quote-details .detail-row:nth-child(1) .value').textContent = data.fullName;
          
          // Update vehicle info
          card.querySelector('.quote-details .detail-row:nth-child(2) .value').textContent = 
              `${data.vehicleMake} ${data.vehicleModel} ${data.vehicleYear}`;
              
          // Update coverage
          card.querySelector('.quote-details .detail-row:nth-child(3) .value').textContent = data.coveragePlan;
      }
  }