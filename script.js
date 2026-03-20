/* =============================================
   PORTFOLIO — Script Principal
   Nykolas Volkmann — 2026
   ============================================= */

(function() {
    'use strict';

    // ─── DOM Elements ───
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navList = document.getElementById('nav-list');
    const backToTop = document.getElementById('back-to-top');
    const whatsappFloat = document.querySelector('.whatsapp-float');

    // ─── Header Scroll Effect ───
    function handleHeaderScroll() {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // ─── Mobile Nav Toggle ───
    function toggleMobileNav() {
        navToggle.classList.toggle('active');
        navList.classList.toggle('active');
        document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
    }

    navToggle.addEventListener('click', toggleMobileNav);

    // Close mobile nav on link click
    document.querySelectorAll('.nav__link').forEach(function(link) {
        link.addEventListener('click', function() {
            if (navList.classList.contains('active')) {
                toggleMobileNav();
            }
        });
    });

    // ─── Back to Top & WhatsApp Float ───
    function handleScrollButtons() {
        var scrolled = window.scrollY > 400;

        if (backToTop) {
            if (scrolled) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        if (whatsappFloat) {
            if (scrolled) {
                whatsappFloat.classList.add('visible');
            } else {
                whatsappFloat.classList.remove('visible');
            }
        }
    }

    // ─── Scroll Reveal Animation ───
    function initRevealAnimations() {
        var reveals = document.querySelectorAll('[data-reveal]');
        if (!reveals.length) return;

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        reveals.forEach(function(el) {
            observer.observe(el);
        });
    }

    // ─── Counter Animation ───
    function animateCounters() {
        var counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var target = parseInt(entry.target.getAttribute('data-count'));
                    var start = 0;
                    var duration = 1800;
                    var startTime = null;

                    function easeOutCubic(t) {
                        return 1 - Math.pow(1 - t, 3);
                    }

                    function step(timestamp) {
                        if (!startTime) startTime = timestamp;
                        var progress = Math.min((timestamp - startTime) / duration, 1);
                        var easedProgress = easeOutCubic(progress);
                        entry.target.textContent = Math.floor(easedProgress * target);
                        if (progress < 1) {
                            requestAnimationFrame(step);
                        } else {
                            entry.target.textContent = target;
                        }
                    }

                    requestAnimationFrame(step);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function(counter) {
            observer.observe(counter);
        });
    }

    // ─── Smooth Scroll for Anchor Links ───
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;

                var targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    var headerHeight = header.offsetHeight;
                    var targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ─── Active Nav Link on Scroll ───
    function handleActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');

        var scrollY = window.scrollY + 200;

        sections.forEach(function(section) {
            var sectionTop = section.offsetTop;
            var sectionHeight = section.offsetHeight;
            var sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ─── Throttle Utility ───
    function throttle(func, wait) {
        var timeout = null;
        var lastArgs = null;
        return function() {
            lastArgs = arguments;
            if (!timeout) {
                timeout = setTimeout(function() {
                    func.apply(null, lastArgs);
                    timeout = null;
                }, wait);
            }
        };
    }

    // ─── Event Listeners ───
    var throttledScroll = throttle(function() {
        handleHeaderScroll();
        handleScrollButtons();
        handleActiveNavLink();
    }, 16);

    window.addEventListener('scroll', throttledScroll, { passive: true });

    // ─── Initialize ───
    function init() {
        handleHeaderScroll();
        handleScrollButtons();
        initRevealAnimations();
        animateCounters();
        initSmoothScroll();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
