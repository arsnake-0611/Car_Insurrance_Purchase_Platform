$(document).ready(function() {
  $('a[href^="#"]').on('click', function(event) {
      var target = $(this.hash);
      if (target.length) {
          event.preventDefault();
          $('html, body').animate({
              scrollTop: target.offset().top
          }, 500);
      }
  });

  $(window).scroll(function() {
      $('.feature-card').each(function() {
          let position = $(this).offset().top;
          let scroll = $(window).scrollTop();
          let windowHeight = $(window).height();
          
          if (scroll > position - windowHeight + 200) {
              $(this).addClass('animate');
          }
      });
  });

  $('.cta-button').hover(
      function() {
          $(this).css('background-color', '#ffd700');
      },
      function() {
          $(this).css('background-color', '#ffcc00');
      }
  );
});