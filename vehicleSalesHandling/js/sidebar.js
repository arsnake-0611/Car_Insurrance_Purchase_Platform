class Sidebar {
    constructor() {
        this.sidebar = $('.sidebar');
        this.menuToggle = $('.menu-toggle');
        this.overlay = $('.sidebar-overlay');
        this.isMenuOpen = false;
        this.hoverTimeout = null;
        this.leaveTimeout = null;
        this.hoverStartTime = null;
        this.minHoverTime = 200;
        this.isIntentional = false;

        this.init();
    }

    init() {
        this.attachEventListeners();
        this.handleResize();
        $(window).resize(() => this.handleResize());

        this.initLogoutHandler();
    }

    initLogoutHandler() {
        $('.logout-btn').off('click');
        
        $('.logout-btn').on('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('Are you sure you want to logout?')) {
                window.location.href = '../signin/signin.html';
            }
        });
    }

    attachEventListeners() {
        // Mobile menu toggle
        this.menuToggle.click((e) => {
            e.stopPropagation();
            this.toggleMobileMenu();
        });

        // Overlay click
        this.overlay.click(() => this.closeMobileMenu());

        // Desktop hover handlers
        this.initializeDesktopHover();
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.isMenuOpen) {
            this.sidebar.addClass('show');
            this.overlay.css('display', 'block');
            requestAnimationFrame(() => {
                this.overlay.addClass('show');
            });
            $('body').css('overflow', 'hidden');
        } else {
            this.closeMobileMenu();
        }
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        this.sidebar.removeClass('show');
        this.overlay.removeClass('show');
        $('body').css('overflow', '');
        
        setTimeout(() => {
            if (!this.overlay.hasClass('show')) {
                this.overlay.css('display', 'none');
            }
        }, 300);
    }

    initializeDesktopHover() {
        if (window.innerWidth > 768) {
            this.sidebar.hover(
                () => {
                    clearTimeout(this.leaveTimeout);
                    this.hoverStartTime = Date.now();
                    
                    this.hoverTimeout = setTimeout(() => {
                        if (Date.now() - this.hoverStartTime >= this.minHoverTime) {
                            this.isIntentional = true;
                            this.sidebar.addClass('expanded');
                            $('.nav-text, .main-nav h3, .settings-nav h3, .logout-btn .nav-text').css({
                                'opacity': '1',
                                'visibility': 'visible',
                                'position': 'static'
                            });
                        }
                    }, 200);
                },
                () => {
                    clearTimeout(this.hoverTimeout);
                    this.isIntentional = false;
                    this.sidebar.removeClass('expanded');
                    if (window.innerWidth > 768) {
                        $('.nav-text, .main-nav h3, .settings-nav h3, .logout-btn .nav-text').css({
                            'opacity': '0',
                            'visibility': 'hidden',
                            'position': 'absolute'
                        });
                    }
                }
            );
        }
    }

    handleResize() {
        if (window.innerWidth <= 768) {
            this.sidebar.off('mouseenter mouseleave');
            
            if (!this.isMenuOpen) {
                this.sidebar.removeClass('show');
                this.overlay.removeClass('show').css('display', 'none');
            }
        } else {
            this.closeMobileMenu();
            this.sidebar.css({
                'transform': '',
                'left': '',
                'width': ''
            });
            
            this.initializeDesktopHover();
        }
    }
}

// Add this at the end of the file
$(document).ready(() => {
    new Sidebar();
});