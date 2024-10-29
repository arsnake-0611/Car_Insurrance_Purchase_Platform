
$(document).ready(function() {
    $('.feature-card').each(function() {
      const observerOptions = {
        threshold: 0.2
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, observerOptions);

      observer.observe(this);
    });

    $('.faq-question').click(function() {
      $(this).next('.faq-answer').slideToggle(300);
      $(this).toggleClass('active');
    });

    $('.cta-button').click(function() {
      alert("In accordance with insurance regulations, all quotes are subject to verification and final approval. Insurance products and their features are subject to underwriting criteria and may not be available in all states.");
      window.location.href = 'quotation.html';
    });
  });