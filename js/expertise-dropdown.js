// Expertise Dropdown and Mobile Navigation
class ExpertiseNavigation {
    constructor() {
        this.init();
    }

    init() {
        this.setupExpertiseDropdown();
        this.setupMobileExpertiseToggle();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupAccessibility();
    }

    setupExpertiseDropdown() {
        const dropdownButtons = document.querySelectorAll('.expertise-dropdown button');
        
        dropdownButtons.forEach(button => {
            // Handle keyboard navigation
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleDesktopDropdown(button.parentElement);
                }
                if (e.key === 'Escape') {
                    this.closeAllDropdowns();
                    button.focus();
                }
            });

            // Handle mouse enter/leave for desktop
            const dropdown = button.parentElement;
            
            dropdown.addEventListener('mouseenter', () => {
                if (window.innerWidth >= 1024) {
                    this.openDesktopDropdown(dropdown);
                }
            });

            dropdown.addEventListener('mouseleave', () => {
                if (window.innerWidth >= 1024) {
                    this.closeDesktopDropdown(dropdown);
                }
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.expertise-dropdown')) {
                this.closeAllDropdowns();
            }
        });
    }

    setupMobileExpertiseToggle() {
        // This function works with the onclick attribute in HTML
        window.toggleMobileExpertise = function() {
            const submenu = document.getElementById('mobile-expertise-submenu');
            const chevron = document.getElementById('mobile-expertise-chevron');
            const button = document.querySelector('.mobile-expertise-section button');
            
            if (submenu.classList.contains('hidden')) {
                submenu.classList.remove('hidden');
                chevron.style.transform = 'rotate(180deg)';
                button.setAttribute('aria-expanded', 'true');
            } else {
                submenu.classList.add('hidden');
                chevron.style.transform = 'rotate(0deg)';
                button.setAttribute('aria-expanded', 'false');
            }
        };
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuOverlay = document.getElementById('menu-overlay');

        if (mobileMenuBtn && mobileMenu && menuOverlay) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            menuOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });

            // Close mobile menu when clicking on a link
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });
        }
    }

    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offset = 80; // Header height
                    const targetPosition = targetElement.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupAccessibility() {
        // Handle ESC key to close dropdowns and mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
                this.closeMobileMenu();
            }
        });

        // Add ARIA attributes dynamically
        const dropdownButtons = document.querySelectorAll('.expertise-dropdown button');
        dropdownButtons.forEach(button => {
            button.setAttribute('aria-haspopup', 'true');
            button.setAttribute('aria-expanded', 'false');
        });
    }

    toggleDesktopDropdown(dropdown) {
        const menu = dropdown.querySelector('.expertise-dropdown-menu');
        const button = dropdown.querySelector('button');
        const chevron = button.querySelector('i');

        if (menu.classList.contains('opacity-0')) {
            this.openDesktopDropdown(dropdown);
        } else {
            this.closeDesktopDropdown(dropdown);
        }
    }

    openDesktopDropdown(dropdown) {
        const menu = dropdown.querySelector('.expertise-dropdown-menu');
        const button = dropdown.querySelector('button');
        const chevron = button.querySelector('i');

        menu.classList.remove('opacity-0', 'invisible', '-translate-y-2');
        menu.classList.add('opacity-100', 'visible', 'translate-y-0');
        button.setAttribute('aria-expanded', 'true');
    }

    closeDesktopDropdown(dropdown) {
        const menu = dropdown.querySelector('.expertise-dropdown-menu');
        const button = dropdown.querySelector('button');
        const chevron = button.querySelector('i');

        menu.classList.add('opacity-0', 'invisible', '-translate-y-2');
        menu.classList.remove('opacity-100', 'visible', 'translate-y-0');
        button.setAttribute('aria-expanded', 'false');
    }

    closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.expertise-dropdown');
        dropdowns.forEach(dropdown => {
            this.closeDesktopDropdown(dropdown);
        });
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const menuOverlay = document.getElementById('menu-overlay');
        const hamburger = document.getElementById('mobile-menu-btn');

        if (mobileMenu.classList.contains('translate-x-full')) {
            this.openMobileMenu();
        } else {
            this.closeMobileMenu();
        }
    }

    openMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const menuOverlay = document.getElementById('menu-overlay');
        const hamburger = document.getElementById('mobile-menu-btn');

        mobileMenu.classList.remove('translate-x-full');
        mobileMenu.classList.add('translate-x-0');
        menuOverlay.classList.add('active');
        hamburger.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const menuOverlay = document.getElementById('menu-overlay');
        const hamburger = document.getElementById('mobile-menu-btn');

        mobileMenu.classList.add('translate-x-full');
        mobileMenu.classList.remove('translate-x-0');
        menuOverlay.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';

        // Reset mobile expertise submenu
        const submenu = document.getElementById('mobile-expertise-submenu');
        const chevron = document.getElementById('mobile-expertise-chevron');
        const button = document.querySelector('.mobile-expertise-section button');
        
        if (submenu && !submenu.classList.contains('hidden')) {
            submenu.classList.add('hidden');
            chevron.style.transform = 'rotate(0deg)';
            button.setAttribute('aria-expanded', 'false');
        }
    }
}

// Initialize the expertise navigation
document.addEventListener('DOMContentLoaded', () => {
    new ExpertiseNavigation();
});
