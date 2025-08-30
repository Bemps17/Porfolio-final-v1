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
                    } else {
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
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    alert('Message envoyé ! Je vous recontacte rapidement.');
                    e.target.reset();
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

            // === SCRIPT POUR LE CV VISUEL EN MODALE (VERSION ROBUSTE) ===
            const visualCvButtons = document.querySelectorAll('.download-visual-cv-btn');
            const cvModal = document.getElementById('cv-modal');
            const cvModalBody = document.getElementById('cv-modal-body');
            const cvModalClose = document.getElementById('cv-modal-close');
            const cvModalPrint = document.getElementById('cv-modal-print');
            let cvMarkdownCache = null; // Cache for the CV HTML

            const openCvModal = () => {
                if (!cvModal) return;
                // Make it part of the layout
                cvModal.classList.remove('hidden');
                cvModal.classList.add('flex');

                // Use a tiny timeout to allow the browser to apply 'display: flex'
                // before adding the 'is-open' class for the transition.
                setTimeout(() => {
                    cvModal.classList.add('is-open');
                }, 10);

                document.body.style.overflow = 'hidden';
            };

            const closeCvModal = () => {
                if (!cvModal) return;
                cvModal.classList.remove('is-open');

                // Wait for the transition to finish before setting display to none
                setTimeout(() => {
                    cvModal.classList.add('hidden');
                    cvModal.classList.remove('flex');
                }, 300); // Must match the transition duration in CSS (0.3s)

                document.body.style.overflow = '';
            };

            const showCv = async (event) => {
                event.preventDefault();
                
                // If content is cached, just open the modal
                if (cvMarkdownCache) {
                    cvModalBody.innerHTML = cvMarkdownCache;
                    openCvModal();
                    return;
                }

                const button = event.currentTarget;
                const originalContent = button.innerHTML;
                button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Chargement...';
                button.disabled = true;

                try {
                    const response = await fetch('assets/md/cv-hybride-larochelle.md');
                    if (!response.ok) throw new Error('Fichier CV Markdown introuvable.');
                    
                    const markdownText = await response.text();
                    const sections = markdownText.split(/\n---\n/g);

                    const page = document.createElement('div');
                    page.className = 'page';

                    const sidebar = document.createElement('aside');
                    sidebar.className = 'sidebar';

                    const content = document.createElement('main');
                    content.className = 'content';

                    page.appendChild(sidebar);
                    page.appendChild(content);

                    const sidebarTitles = ['Compétences Clés', 'Formation', 'Pourquoi Moi', 'Ce que je Recherche', 'Centres d\'Intérêt'];
                    
                    const headerSection = document.createElement('header');
                    headerSection.className = 'identity';
                    headerSection.innerHTML = marked.parse(sections[0] || '');
                    sidebar.appendChild(headerSection);
                    
                    sections.slice(1, sections.length - 1).forEach(sectionText => {
                        const firstLine = sectionText.trim().split('\n')[0];
                        const sectionWrapper = document.createElement('section');
                        sectionWrapper.className = 'section';
                        sectionWrapper.innerHTML = marked.parse(sectionText);

                        if (sidebarTitles.some(title => firstLine.includes(title))) {
                            sidebar.appendChild(sectionWrapper);
                        } else {
                            content.appendChild(sectionWrapper);
                        }
                    });

                    const footerSection = document.createElement('footer');
                    footerSection.className = 'section';
                    footerSection.innerHTML = marked.parse(sections[sections.length - 1] || '');
                    content.appendChild(footerSection);

                    cvMarkdownCache = page.outerHTML;
                    
                    cvModalBody.innerHTML = cvMarkdownCache;
                    openCvModal();

                } catch (error) {
                    console.error('Erreur CV:', error);
                    alert('Une erreur est survenue lors du chargement du CV.');
                } finally {
                    button.innerHTML = originalContent;
                    button.disabled = false;
                }
            };

            if (cvModal) {
                visualCvButtons.forEach(button => button.addEventListener('click', showCv));
                cvModalClose.addEventListener('click', closeCvModal);
                if (cvModalPrint) cvModalPrint.addEventListener('click', () => window.print());
                cvModal.addEventListener('click', (e) => { if (e.target === cvModal) closeCvModal(); });
                document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && cvModal.classList.contains('is-open')) closeCvModal(); });
            }
        });