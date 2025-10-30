// Skills Tabs Navigation
class SkillsTabs {
    constructor() {
        this.activeTab = 'technical-tab';
        this.activeAccordions = new Set();
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.setupAccordions();
        this.initializeFirstTab(); // Initialiser le premier tab
        this.openFirstAccordion(); // Ouvrir le premier accordéon par défaut
    }

    initializeFirstTab() {
        // S'assurer que le premier tab est visible et actif
        const firstTab = document.getElementById(this.activeTab);
        const firstButton = document.querySelector(`[data-tab="${this.activeTab}"]`);
        
        if (firstTab) {
            firstTab.classList.remove('hidden');
        }
        
        if (firstButton) {
            firstButton.classList.add('active');
        }
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.skill-tab-btn');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = button.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });
    }

    switchTab(tabId) {
        if (this.activeTab === tabId) return; // Ne rien faire si c'est déjà le tab actif
        
        // Cacher tous les tabs
        document.querySelectorAll('.skill-tab-content').forEach(tab => {
            tab.classList.add('hidden');
        });

        // Retirer la classe active de tous les boutons
        document.querySelectorAll('.skill-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Afficher le tab sélectionné avec animation
        const targetTab = document.getElementById(tabId);
        if (targetTab) {
            targetTab.classList.remove('hidden');
            // Forcer la réinitialisation de l'animation
            targetTab.style.animation = 'none';
            targetTab.offsetHeight; // Trigger reflow
            targetTab.style.animation = 'fadeInUp 0.4s ease forwards';
        }

        // Activer le bouton cliqué
        const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        this.activeTab = tabId;
    }

    setupAccordions() {
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const accordion = header.parentElement;
                this.toggleAccordion(accordion);
            });
        });
    }

    toggleAccordion(accordion) {
        const content = accordion.querySelector('.accordion-content');
        const header = accordion.querySelector('.accordion-header');
        const icon = accordion.querySelector('.accordion-icon');
        
        if (content.classList.contains('active')) {
            // Fermer l'accordéon
            content.classList.remove('active');
            header.classList.remove('active');
            icon.style.transform = 'rotate(0deg)';
            this.activeAccordions.delete(accordion);
        } else {
            // Ouvrir l'accordéon
            content.classList.add('active');
            header.classList.add('active');
            icon.style.transform = 'rotate(180deg)';
            this.activeAccordions.add(accordion);
        }
    }

    openFirstAccordion() {
        const firstAccordion = document.querySelector('.accordion');
        if (firstAccordion) {
            this.toggleAccordion(firstAccordion);
        }
    }

    // Méthode pour ouvrir/fermer tous les accordéons
    toggleAllAccordions() {
        const allAccordions = document.querySelectorAll('.accordion');
        const allOpen = this.activeAccordions.size === allAccordions.length;
        
        allAccordions.forEach(accordion => {
            if (allOpen) {
                // Fermer tout
                const content = accordion.querySelector('.accordion-content');
                const header = accordion.querySelector('.accordion-header');
                const icon = accordion.querySelector('.accordion-icon');
                
                if (content.classList.contains('active')) {
                    content.classList.remove('active');
                    header.classList.remove('active');
                    icon.style.transform = 'rotate(0deg)';
                }
            } else {
                // Ouvrir tout
                const content = accordion.querySelector('.accordion-content');
                const header = accordion.querySelector('.accordion-header');
                const icon = accordion.querySelector('.accordion-icon');
                
                if (!content.classList.contains('active')) {
                    content.classList.add('active');
                    header.classList.add('active');
                    icon.style.transform = 'rotate(180deg)';
                }
            }
        });
        
        // Mettre à jour le set des accordéons actifs
        this.activeAccordions.clear();
        if (!allOpen) {
            allAccordions.forEach(accordion => {
                this.activeAccordions.add(accordion);
            });
        }
    }
}

// Initialiser les tabs et les accordéons
document.addEventListener('DOMContentLoaded', () => {
    new SkillsTabs();
});
