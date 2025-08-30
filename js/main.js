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

            // Smooth scroll
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    const href = this.getAttribute('href');
                    if (href === '#') return;
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offsetTop = target.offsetTop - 60;
                        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                    }
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

                contactForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    
                    const formData = new FormData(this);
                    const submitButton = this.querySelector('button[type="submit"]');
                    const originalButtonHTML = submitButton.innerHTML;

                    submitButton.disabled = true;
                    submitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Envoi en cours...`;

                    fetch("/", {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: new URLSearchParams(formData).toString()
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

            // === EASTER EGG FOR OBJECTIVES ===
            const iaToolsBtn = document.getElementById('ia-tools-btn');
            const objectifsSection = document.getElementById('objectifs-section');
            const objectifsCloseBtn = document.getElementById('objectifs-close-btn');

            const openObjectives = () => {
                if (!objectifsSection) return;
                objectifsSection.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            };

            const closeObjectives = () => {
                if (!objectifsSection) return;
                objectifsSection.classList.add('hidden');
                document.body.style.overflow = '';
            };

            if (iaToolsBtn && objectifsSection && objectifsCloseBtn) {
                iaToolsBtn.addEventListener('click', openObjectives);
                objectifsCloseBtn.addEventListener('click', closeObjectives);
                // Close on outside click
                objectifsSection.addEventListener('click', (e) => {
                    if (e.target === objectifsSection) {
                        closeObjectives();
                    }
                });
                // Close with Escape key
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && !objectifsSection.classList.contains('hidden')) {
                        closeObjectives();
                    }
                });
            }
        });