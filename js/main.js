// CODE TEMPORAIRE - À SUPPRIMER APRÈS FIX
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
            console.log('Service Worker désinstallé');
        }
    });
}

/**
 * Opens the mail client without exposing the email address in the HTML.
 * @param {HTMLElement} element The button element that was clicked.
 */
function showContact(element) {
    const user = 'bertrandwebdesigner';
    const domain = 'proton.me';
    window.location.href = `mailto:${user}@${domain}`;
}

document.addEventListener('DOMContentLoaded', () => {
            // Particle animation
            const particlesContainer = document.getElementById('particles');
            if (particlesContainer) {
                const particleCount = window.innerWidth < 768 ? 15 : 30;
                for (let i = 0; i < particleCount; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    particle.style.width = Math.random() * 4 + 'px';
                    particle.style.height = particle.style.width;
                    particle.style.left = Math.random() * 100 + '%';
                    particle.style.animationDelay = Math.random() * 20 + 's';
                    particle.style.animationDuration = (Math.random() * 20 + 20) + 's';
                    particlesContainer.appendChild(particle);
                }
            }

            // Mobile menu
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const mobileMenu = document.getElementById('mobile-menu');
            const menuOverlay = document.getElementById('menu-overlay');
            const body = document.body;

            function toggleMobileMenu() {
                const isOpen = mobileMenu.classList.contains('mobile-menu-open');
                if (isOpen) {
                    mobileMenu.classList.remove('mobile-menu-open');
                    menuOverlay.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    body.style.overflow = '';
                } else {
                    mobileMenu.classList.add('mobile-menu-open');
                    menuOverlay.classList.add('active');
                    mobileMenuBtn.classList.add('active');
                    body.style.overflow = 'hidden';
                }
            }

            if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);
            if (menuOverlay) menuOverlay.addEventListener('click', toggleMobileMenu);

            const mobileNavLinks = document.querySelectorAll('#mobile-menu a[href^="#"]');
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (mobileMenu.classList.contains('mobile-menu-open')) {
                        toggleMobileMenu();
                    }
                });
            });

            // === GESTION TACTILE POUR MENU MOBILE (HAMMER.JS) ===
            if (typeof Hammer !== 'undefined' && mobileMenu) {
                const hammerBody = new Hammer(document.body);
                const hammerMenu = new Hammer(mobileMenu);

                // Ouvre le menu en balayant vers la gauche depuis le bord droit
                hammerBody.on('swipeleft', function(ev) {
                    if (!mobileMenu.classList.contains('mobile-menu-open') && ev.center.x > window.innerWidth - 80) {
                        toggleMobileMenu();
                    }
                });

                // Ferme le menu en balayant vers la droite sur le menu lui-même
                hammerMenu.on('swiperight', function(ev) {
                    if (mobileMenu.classList.contains('mobile-menu-open')) {
                        toggleMobileMenu();
                    }
                });
            }

            // Smooth scroll simple
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    const href = this.getAttribute('href');
                    if (href === '#') return;
                    
                    // Fermer le menu mobile si ouvert
                    closeMobileMenu();
                    
                    // Laisser le navigateur gérer le scroll naturellement
                    // Pas de logique complexe, juste le HTML natif
                });
            });

            // Back to top button
            const backToTop = document.getElementById('back-to-top');
            if(backToTop) {
                window.addEventListener('scroll', () => {
                    if (window.pageYOffset > 300) {
                        backToTop.classList.remove('opacity-0', 'pointer-events-none');
                    }
                    else {
                        backToTop.classList.add('opacity-0', 'pointer-events-none');
                    }
                });
                backToTop.addEventListener('click', () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }

            // Contact form
            const contactForm = document.getElementById('contact-form');
            if(contactForm) {
                const formWrapper = document.getElementById('form-wrapper');
                const successMessage = document.getElementById('success-message');
                const messageTextarea = contactForm.querySelector('textarea[name="message"]');
                const fileInputLabel = document.getElementById('file-input-label');

                const fileInput = document.getElementById('file-input');
                const fileNameSpan = document.getElementById('file-name');

                if (fileInput && fileNameSpan) {
                    fileInput.addEventListener('change', () => {
                        if (fileInput.files.length > 0) {
                            fileNameSpan.textContent = fileInput.files[0].name;
                            fileNameSpan.classList.remove('text-gray-400');
                            fileNameSpan.classList.add('text-white');
                        } else {
                            fileNameSpan.textContent = 'Joindre un fichier (optionnel)';
                            fileNameSpan.classList.add('text-gray-400');
                            fileNameSpan.classList.remove('text-white');
                        }
                    });
                }

                if (messageTextarea && fileInputLabel) {
                    messageTextarea.addEventListener('input', () => {
                        const triggerKeywords = [
                            'pièce-jointe', 'piece-jointe',
                            'pièce jointe', 'piece jointe',
                            'pièces-jointes', 'pieces-jointes',
                            'pièces jointes', 'pieces jointes',
                            'pj'
                        ];
                        const currentValue = messageTextarea.value.toLowerCase();

                        const found = triggerKeywords.some(keyword => currentValue.includes(keyword));

                        if (found) {
                            fileInputLabel.classList.remove('hidden');
                        } else {
                            fileInputLabel.classList.add('hidden');
                        }
                    });
                }

                contactForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    
                    const formData = new FormData(this);
                    const submitButton = this.querySelector('button[type="submit"]');
                    const originalButtonHTML = submitButton.innerHTML;

                    submitButton.disabled = true;
                    submitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Envoi en cours...`;

                    fetch("/", {
                        method: "POST",
                        body: formData
                    })
                    .then(() => {
                        if (formWrapper && successMessage) {
                            formWrapper.classList.add('hidden');
                            successMessage.classList.remove('hidden');
                        }
                    })
                    .catch((error) => {
                        alert("Désolé, une erreur est survenue. Votre message n'a pas pu être envoyé. Veuillez réessayer.");
                        console.error(error);
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalButtonHTML;
                    });
                });
            }

            // Intersection Observer for animations
            const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);
            document.querySelectorAll('section').forEach(section => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(section);
            });

            // === LINKEDIN BUTTON in skills ===
            const linkedinBtn = document.getElementById('linkedin-btn');
            if (linkedinBtn) {
                linkedinBtn.addEventListener('click', () => {
                    // Opens the LinkedIn profile in a new tab
                    window.open('https://www.linkedin.com/in/bertandfouquet1984/', '_blank');
                });
            }

            // === THEME SETTINGS PANEL ===
            const settingsToggles = document.querySelectorAll('[data-settings-toggle]');
            const settingsPanel = document.getElementById('settings-panel');
            const header = document.querySelector('header.fixed');

            function openSettingsPanel() {
                if (!settingsPanel || !header) return;
                const headerHeight = header.offsetHeight;
                settingsPanel.style.top = `${headerHeight}px`;
                settingsPanel.classList.add('is-open');
                settingsToggles.forEach(btn => btn.setAttribute('aria-expanded', 'true'));
            }

            function closeSettingsPanel() {
                if (!settingsPanel) return;
                settingsPanel.classList.remove('is-open');
                settingsToggles.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
            }

            if (settingsToggles.length > 0 && settingsPanel) {
                settingsToggles.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();

                        // If the mobile menu is open, close it before showing settings
                        if (mobileMenu.classList.contains('mobile-menu-open')) {
                            toggleMobileMenu();
                        }

                        if (settingsPanel.classList.contains('is-open')) {
                            closeSettingsPanel();
                        } else {
                            openSettingsPanel();
                        }
                    });
                });

                document.addEventListener('click', (e) => {
                    const isClickOnToggle = Array.from(settingsToggles).some(toggle => toggle.contains(e.target));
                    if (settingsPanel.classList.contains('is-open') && !settingsPanel.contains(e.target) && !isClickOnToggle) {
                        closeSettingsPanel();
                    }
                });

                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && settingsPanel.classList.contains('is-open')) {
                        closeSettingsPanel();
                    }
                });
            }

            // Theme switcher logic
            const themeRadios = document.querySelectorAll('#settings-panel input[name="theme"]');
            const themeLabels = document.querySelectorAll('#settings-panel fieldset label');
            
            function applyTheme(theme) {
                document.body.setAttribute('data-theme', theme);
                
                // Use the new save function if it exists
                if (typeof saveTheme === 'function') {
                    saveTheme(theme);
                } else {
                    // Fallback to old method if save.js is not loaded
                    localStorage.setItem('portfolio-theme', theme);
                }
                
                // Mettre à jour l'état du bouton radio
                const currentRadio = document.querySelector(`#settings-panel input[name="theme"][value="${theme}"]`);
                if (currentRadio) currentRadio.checked = true;

                // Mettre en évidence le label sélectionné
                themeLabels.forEach(label => {
                    label.classList.remove('is-selected');
                });
                if (currentRadio && currentRadio.parentElement.tagName === 'LABEL') {
                    currentRadio.parentElement.classList.add('is-selected');
                }
            }

            themeRadios.forEach(radio => {
                radio.addEventListener('change', (e) => applyTheme(e.target.value));
            });

            async function initializeTheme() {
                // First, check the state for logging/debugging purposes
                if (typeof checkSaveState === 'function') {
                    await checkSaveState();
                }
                // Then, load the theme using our priority logic
                const themeToLoad = (typeof loadTheme === 'function') ? await loadTheme() : (localStorage.getItem('portfolio-theme') || 'corporate');
                applyTheme(themeToLoad);
            }
            initializeTheme();

            // === SERVICE WORKER REGISTRATION ===
            /*
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    // On charge le service worker depuis la racine pour que son scope par défaut soit '/'
                    navigator.serviceWorker.register('/service-worker.js')
                        .then(registration => {
                            console.log('Service Worker enregistré ! Scope: ', registration.scope);
                        })
                        .catch(err => {
                            console.error('Échec de l'enregistrement du Service Worker: ', err);
                        });
                });
            }
            */

            // Initialiser l'easter egg de la console
            initConsoleEasterEgg();
        });

// ========================================
// 8. CONSOLE EASTER EGG
// ========================================

function initConsoleEasterEgg() {
    const styles = {
        title: 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #ff6600 0%, #ff8833 100%); color: white; padding: 10px 20px; border-radius: 10px;',
        subtitle: 'font-size: 14px; color: #999;',
        highlight: 'font-size: 14px; color: #ff6600; font-weight: bold;',
        success: 'font-size: 14px; color: #00ff00; font-weight: bold;'
    };
    
    console.log('%c🚀 Salut, recruteur curieux !', styles.title);
    console.log('%c👋 Si vous regardez ici, c\'est que vous aimez les détails...', styles.subtitle);
    console.log('%c💡 J\'ai 10+ ans d\'expérience et 3 domaines d\'expertise.', styles.subtitle);
    console.log('%c📧 Contactez-moi : bertrandwebdesigner@proton.me', styles.highlight);
    console.log('%c🎯 Disponible immédiatement pour vos projets !', styles.success);
    
    // ASCII Art
    console.log(`
    %c
    ╔══════════════════════════════════════╗
    ║   BERTRAND FOUQUET - WEB DESIGNER   ║
    ║     Commercial | Design | Logistique ║
    ╚══════════════════════════════════════╝
    `, 'color: #ff6600; font-family: monospace;');
}

// ========================================
// FONCTIONS UTILITAIRES
// ========================================

/**
 * Debounce function pour optimiser les performances
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function pour limiter l'exécution
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Détection du type d'appareil
 */
function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet';
    }
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'mobile';
    }
    return 'desktop';
}

// Export pour utilisation externe si nécessaire
window.portfolioUtils = {
    debounce,
    throttle,
    getDeviceType
};