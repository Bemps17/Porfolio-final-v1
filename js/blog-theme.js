// Blog Theme Manager - Dark/Light Mode Only
class BlogThemeManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupThemeToggle();
        this.loadSavedTheme();
        this.setupThemePanel();
    }
    
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const themePanel = document.getElementById('theme-panel');
        
        if (themeToggle && themePanel) {
            themeToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                themePanel.classList.toggle('hidden');
            });
            
            // Close panel when clicking outside
            document.addEventListener('click', (e) => {
                if (!themePanel.contains(e.target) && e.target !== themeToggle) {
                    themePanel.classList.add('hidden');
                }
            });
        }
    }
    
    setupThemePanel() {
        const themeInputs = document.querySelectorAll('input[name="theme"]');
        
        themeInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.setTheme(e.target.value);
            });
        });
    }
    
    setTheme(themeName) {
        document.body.setAttribute('data-theme', themeName);
        localStorage.setItem('theme', themeName);
        
        // Update radio button
        const selectedInput = document.querySelector(`input[name="theme"][value="${themeName}"]`);
        if (selectedInput) {
            selectedInput.checked = true;
        }
        
        // Update theme toggle icon
        this.updateThemeIcon(themeName);
        
        // Apply theme styles
        this.applyThemeStyles(themeName);
        
        // Close panel
        document.getElementById('theme-panel').classList.add('hidden');
    }
    
    updateThemeIcon(themeName) {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;
        
        const icon = themeToggle.querySelector('i');
        if (!icon) return;
        
        if (themeName === 'light') {
            icon.className = 'fas fa-sun';
            themeToggle.title = 'Passer en mode sombre';
        } else {
            icon.className = 'fas fa-moon';
            themeToggle.title = 'Passer en mode light';
        }
    }
    
    applyThemeStyles(themeName) {
        const root = document.documentElement;
        
        if (themeName === 'light') {
            // Light mode colors
            root.style.setProperty('--color-bg', '#ffffff');
            root.style.setProperty('--color-bg-secondary', '#f8f9fa');
            root.style.setProperty('--color-surface', '#ffffff');
            root.style.setProperty('--color-text', '#000000');
            root.style.setProperty('--color-text-secondary', '#666666');
            root.style.setProperty('--color-accent', '#E65C00');
            root.style.setProperty('--color-accent-text', '#ffffff');
            root.style.setProperty('--color-border', '#e0e0e0');
            
            // Update body classes
            document.body.className = 'bg-gray-50 text-gray-900';
            
            // Update header
            const header = document.querySelector('header');
            if (header) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.borderBottom = '1px solid #e0e0e0';
                header.style.color = '#000000';
            }
            
            // Update footer
            const footer = document.querySelector('footer');
            if (footer) {
                footer.style.backgroundColor = '#f8f9fa';
                footer.style.borderTop = '1px solid #e0e0e0';
                footer.style.color = '#666666';
            }
            
            // Update blog cards
            document.querySelectorAll('.blog-card').forEach(card => {
                card.style.backgroundColor = '#ffffff';
                card.style.color = '#000000';
                card.style.borderColor = '#e0e0e0';
            });
            
            // Update buttons
            document.querySelectorAll('button').forEach(btn => {
                if (!btn.classList.contains('text-white')) {
                    btn.style.color = '#000000';
                }
            });
            
        } else {
            // Dark mode colors (default)
            root.style.setProperty('--color-bg', '#000000');
            root.style.setProperty('--color-bg-secondary', '#111111');
            root.style.setProperty('--color-surface', '#1a1a1a');
            root.style.setProperty('--color-text', '#ffffff');
            root.style.setProperty('--color-text-secondary', '#b0b0b0');
            root.style.setProperty('--color-accent', '#E65C00');
            root.style.setProperty('--color-accent-text', '#ffffff');
            root.style.setProperty('--color-border', '#333333');
            
            // Reset body classes
            document.body.className = 'bg-black text-white';
            
            // Reset header
            const header = document.querySelector('header');
            if (header) {
                header.style.backgroundColor = '';
                header.style.borderBottom = '';
                header.style.color = '';
            }
            
            // Reset footer
            const footer = document.querySelector('footer');
            if (footer) {
                footer.style.backgroundColor = '';
                footer.style.borderTop = '';
                footer.style.color = '';
            }
            
            // Reset blog cards
            document.querySelectorAll('.blog-card').forEach(card => {
                card.style.backgroundColor = '';
                card.style.color = '';
                card.style.borderColor = '';
            });
            
            // Reset buttons
            document.querySelectorAll('button').forEach(btn => {
                btn.style.color = '';
            });
        }
    }
    
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme);
    }
    
    // Toggle between dark and light
    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
}

// Initialize theme manager
document.addEventListener('DOMContentLoaded', () => {
    new BlogThemeManager();
});

// Utility function for contact
function showContact(element) {
    const user = 'bertrandwebdesigner';
    const domain = 'proton.me';
    window.location.href = `mailto:${user}@${domain}`;
}
