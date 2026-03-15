/* ============================================
   NYKOLAS VOLKMANN — PORTFOLIO
   script.js — Interactivity & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- ELEMENTS ----
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navList = document.getElementById('nav-list');
    const navLinks = document.querySelectorAll('.nav__link');
    const backToTop = document.getElementById('back-to-top');
    const contactForm = document.getElementById('contact-form');

    // ---- NAV OVERLAY (mobile) ----
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);

    // ---- MOBILE MENU TOGGLE ----
    function toggleMenu() {
        navList.classList.toggle('active');
        overlay.classList.toggle('active');
        const isOpen = navList.classList.contains('active');
        navToggle.innerHTML = isOpen
            ? '<i class="ph ph-x"></i>'
            : '<i class="ph ph-list"></i>';
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    navToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Close menu on nav link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // ---- HEADER SCROLL EFFECT ----
    function handleScroll() {
        // Sticky header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top visibility
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on load

    // ---- SCROLL REVEAL (IntersectionObserver) ----
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.revealDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, parseInt(delay));
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---- ACTIVE NAV LINK ON SCROLL ----
    const sections = document.querySelectorAll('section[id]');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72}px 0px -30% 0px`
    });

    sections.forEach(section => sectionObserver.observe(section));

    // ---- CONTACT FORM (Formspree AJAX) ----
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Verifica se o link do Formspree foi colocado
            if (contactForm.action.includes('COLE_O_SEU_LINK_DO_FORMSPREE_AQUI')) {
                alert('O link do Formspree ainda não foi configurado no HTML!');
                return;
            }

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            
            // Estado de carregamento
            btn.innerHTML = 'Enviando...';
            btn.disabled = true;

            const formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    // Sucesso
                    btn.innerHTML = '<i class="ph ph-check-circle"></i> Mensagem Enviada!';
                    btn.style.background = 'linear-gradient(135deg, hsl(170, 80%, 50%), hsl(150, 80%, 40%))';
                    contactForm.reset();
                } else {
                    // Erro do servidor
                    btn.innerHTML = '<i class="ph ph-warning-circle"></i> Erro ao enviar';
                    btn.style.background = '#e74c3c';
                }
            }).catch(error => {
                // Erro de rede
                btn.innerHTML = '<i class="ph ph-warning-circle"></i> Erro na conexão';
                btn.style.background = '#e74c3c';
            }).finally(() => {
                // Volta ao estado normal depois de 3 segundos
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            });
        });
    }

    // ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

});
