$(document).ready(function() {
    // Hide text class elements when page loads
    $('.text').hide();

    $('.cta-button').hover(
        function() {
            $(this).css('background-color', '#ffd700');
        },
        function() {
            $(this).css('background-color', '#ffcc00');
        }
    );

    $('.feature-card').each(function() {
        $(this).find('.feature-icon').hide();
    });

    $('.feature-card').hover(
        function() {
            $(this).css('transform', 'translateY(-10px)')
                   .css('box-shadow', '5px 5px 5px #ffe26e');
            $(this).find('.text').fadeIn(); // Show text on hover
        },
        function() {
            $(this).css('transform', 'translateY(0)')
                   .css('box-shadow', '5px 5px 5px #6e8bff');
            $(this).find('.text').fadeOut(); // Hide text when hover ends
        }
    );
});