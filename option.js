$(document).ready(function() {
    $('.option-card').hover(
        function() {
            $(this).animate({
                top: '-5px',
                borderColor: '#007bff'
            }, 300);
            $(this).css({
                'box-shadow': '0 5px 15px rgba(0,0,0,0.1)',
                'border-color': '#007bff'
            });
        },
        function() {
            $(this).animate({
                top: '0px'
            }, 300);
            $(this).css({
                'box-shadow': 'none',
                'border-color': '#e1e1e1'
            });
        }
    );

    $('.option-card').click(function() {
        location.href = $(this).data('href');
    });

    $('.logout-btn').click(function() {
        location.href = $(this).data('href');
    });
});