$(document).ready(function () {
    // 模拟车辆数据
    const vehicles = [
      { id: 1, name: 'Luxury Sedan', price: '$45,000', image: 'https://example.com/luxury-sedan.jpg' },
      { id: 2, name: 'Sport SUV', price: '$55,000', image: 'https://example.com/sport-suv.jpg' },
      { id: 3, name: 'Electric Hatchback', price: '$35,000', image: 'https://example.com/electric-hatchback.jpg' },
    ];
  
    // 显示车辆列表
    function displayVehicles() {
      const vehicleList = $('.vehicle-list');
      vehicles.forEach(vehicle => {
        const vehicleCard = $('<div>', { class: 'vehicle-card' });
        const img = $('<img>', { src: vehicle.image, alt: vehicle.name });
        const name = $('<h3>').text(vehicle.name);
        const price = $('<p>').text(vehicle.price);
        const addToWishlistBtn = $('<button>', {
          class: 'btn',
          text: 'Add to Wishlist',
          click: function () {
            addToWishlist(vehicle);
          }
        });
        vehicleCard.append(img, name, price, addToWishlistBtn);
        vehicleList.append(vehicleCard);
      });
    }
  
    // 初始化显示车辆列表
    displayVehicles();
  
    // 愿望清单数组
    const wishlist = [];
  
    // 添加到愿望清单
    function addToWishlist(vehicle) {
      if (!wishlist.find(item => item.id === vehicle.id)) {
        wishlist.push(vehicle);
        const wishlistItem = $('<li>').text(`${vehicle.name} - ${vehicle.price}`);
        const removeBtn = $('<button>', {
          text: 'Remove',
          click: function () {
            removeFromWishlist(vehicle);
          }
        });
        wishlistItem.append(removeBtn);
        $('section#wishlist ul').append(wishlistItem);
        updateRequestQuoteButton();
      }
    }
  
    // 从愿望清单移除
    function removeFromWishlist(vehicle) {
      wishlist.splice(wishlist.indexOf(vehicle), 1);
      $(`li:contains(${vehicle.name})`).remove();
      updateRequestQuoteButton();
    }
  
    // 更新请求报价按钮状态
    function updateRequestQuoteButton() {
      const requestQuoteButton = $('#request-quote');
      if (wishlist.length > 0) {
        requestQuoteButton.prop('disabled', false);
      } else {
        requestQuoteButton.prop('disabled', true);
      }
    }
  
    // 请求报价
    $('#request-quote').click(function () {
      // 这里可以添加实际的请求报价逻辑，如发送数据到后端
      alert('Your quote request has been submitted. We will contact you shortly.');
    });
  
    // 切换黑暗模式
    let darkMode = false;
    $('#dark-mode-toggle').click(function () {
      darkMode =!darkMode;
      $('body').toggleClass('dark-mode');
      if (darkMode) {
        $(this).text('☀️');
      } else {
        $(this).text('🌙');
      }
    });
  });