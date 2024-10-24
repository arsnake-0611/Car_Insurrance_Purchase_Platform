  // Remove from wishlist functionality
   document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', function() {
        const wishlistItem = this.closest('.wishlist-item');
        wishlistItem.style.opacity = '0';
        setTimeout(() => {
            wishlistItem.remove();
            // Check if wishlist is empty
            if (document.querySelectorAll('.wishlist-item').length === 0) {
                const emptyState = document.createElement('div');
                emptyState.className = 'empty-wishlist';
                emptyState.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <h2>Your wishlist is empty</h2>
                    <p>Start adding vehicles to your wishlist to keep track of your favorites</p>
                    <a href="https://legendmotor.com/vehicles" class="btn btn-primary">Browse Vehicles</a>
                `;
                document.querySelector('.wishlist-container').appendChild(emptyState);
            }
        }, 300);
    });
});