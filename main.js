(() => {
    'use strict';

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const isMobile = window.innerWidth <= 768;

    // Mobile: disable laggy ScrollTrigger smoothing
    if (isMobile) {
        ScrollTrigger.config({ limitCallbacks: true });
    }

    // === LOADER (fast on mobile) ===
    const loader = document.getElementById('loader');
    const loaderTl = gsap.timeline({
        onComplete: () => { loader.classList.add('done'); document.body.style.overflow = ''; }
    });
    document.body.style.overflow = 'hidden';

    loaderTl
        .to('.loader-word', { y: 0, opacity: 1, stagger: 0.1, duration: isMobile ? 0.4 : 0.6, ease: 'power3.out' })
        .to('.loader-progress', { width: '100%', duration: isMobile ? 0.8 : 1.2, ease: 'power2.inOut' }, '-=0.2')
        .to('.loader-word', { y: -20, opacity: 0, stagger: 0.04, duration: 0.3, ease: 'power2.in' }, '+=0.1')
        .to('.loader-bar', { opacity: 0, duration: 0.2 }, '-=0.2');

    // === CUSTOM CURSOR (desktop only) ===
    if (!isMobile) {
        const cursor = document.getElementById('cursor');
        const follower = document.getElementById('cursorFollower');
        if (cursor) {
            document.addEventListener('mousemove', (e) => {
                gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.08, overwrite: true });
                gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.3, overwrite: true });
            });
            document.querySelectorAll('a, button, .service-row').forEach(el => {
                el.addEventListener('mouseenter', () => gsap.to(follower, { width: 56, height: 56, borderColor: 'rgba(255,60,0,.6)', duration: 0.25 }));
                el.addEventListener('mouseleave', () => gsap.to(follower, { width: 36, height: 36, borderColor: 'rgba(255,60,0,.4)', duration: 0.25 }));
            });
        }
    }

    // === MENU ===
    const burgerBtn = document.getElementById('burgerBtn');
    const navMenu = document.getElementById('navMenu');
    burgerBtn.addEventListener('click', () => {
        burgerBtn.classList.toggle('active');
        navMenu.classList.toggle('open');
    });
    document.querySelectorAll('.menu-link, .menu-cta a').forEach(link => {
        link.addEventListener('click', () => {
            burgerBtn.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });

    // === SMOOTH SCROLL ===
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                gsap.to(window, { duration: isMobile ? 0.8 : 1.2, scrollTo: target, ease: 'power2.inOut' });
            }
        });
    });

    // === HERO ===
    if (!isMobile) {
        gsap.to('.hero-bg', { yPercent: 15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
        gsap.to('.ribbon-track', { x: '-=300', ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
    }
    // Both: fade out hero content
    gsap.to('.hero-sub, .hero-ctas, .hero-scroll-hint', {
        opacity: 0, y: -15,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: '60% top', end: '85% top', scrub: true }
    });

    // === TEXT REVEAL ===
    const revealText = document.querySelector('.reveal-text');
    if (revealText) {
        const html = revealText.innerHTML;
        const parts = html.split(/(<[^>]+>|\s+)/g);
        revealText.innerHTML = parts.map(p => {
            if (!p || p.startsWith('<') || /^\s+$/.test(p)) return p;
            return `<span class="word">${p}</span>`;
        }).join('');

        const wordEls = revealText.querySelectorAll('.word');

        if (isMobile) {
            // Mobile: batch reveal, no scrub
            gsap.to(wordEls, {
                color: 'var(--white)',
                stagger: 0.015,
                duration: 0.4,
                ease: 'none',
                scrollTrigger: { trigger: '.text-reveal-section', start: 'top 80%', toggleActions: 'play none none none' }
            });
        } else {
            gsap.to(wordEls, {
                color: 'var(--white)',
                stagger: 0.05,
                ease: 'none',
                scrollTrigger: { trigger: '.text-reveal-section', start: 'top 70%', end: 'bottom 40%', scrub: 1 }
            });
        }
    }

    // === SIMPLE REVEAL HELPER ===
    function reveal(selector, props = {}) {
        const defaults = {
            y: isMobile ? 20 : 40,
            opacity: 0,
            duration: isMobile ? 0.5 : 0.8,
            ease: 'power3.out',
            stagger: props.stagger || 0,
        };
        const merged = { ...defaults, ...props };
        const startPos = isMobile ? 'top 88%' : 'top 82%';
        gsap.from(selector, {
            ...merged,
            scrollTrigger: { trigger: props.trigger || selector, start: props.start || startPos, toggleActions: 'play none none none' }
        });
    }

    // === SECTION TITLES ===
    gsap.utils.toArray('.section-title').forEach(el => {
        gsap.from(el, { y: isMobile ? 20 : 40, opacity: 0, duration: isMobile ? 0.5 : 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: isMobile ? 'top 90%' : 'top 85%', toggleActions: 'play none none none' } });
    });
    gsap.utils.toArray('.section-subtitle').forEach(el => {
        gsap.from(el, { y: isMobile ? 12 : 25, opacity: 0, duration: isMobile ? 0.4 : 0.7, delay: 0.08, ease: 'power3.out', scrollTrigger: { trigger: el, start: isMobile ? 'top 90%' : 'top 85%', toggleActions: 'play none none none' } });
    });

    // === SERVICE ROWS ===
    reveal('.service-row', { y: isMobile ? 16 : 35, stagger: isMobile ? 0.04 : 0.07, trigger: '.services-list' });

    // === STATS ===
    document.querySelectorAll('.stat-number').forEach(num => {
        const target = parseInt(num.dataset.count);
        gsap.to(num, {
            innerText: target,
            snap: { innerText: 1 },
            duration: isMobile ? 1.2 : 2,
            ease: 'power2.out',
            scrollTrigger: { trigger: num, start: isMobile ? 'top 90%' : 'top 85%', toggleActions: 'play none none none' }
        });
    });
    reveal('.stat-item', { y: isMobile ? 15 : 25, stagger: isMobile ? 0.05 : 0.1, trigger: '.stats-grid' });

    // === BOLD SECTION ===
    const boldTl = gsap.timeline({
        scrollTrigger: { trigger: '.bold-section', start: isMobile ? 'top 82%' : 'top 75%', toggleActions: 'play none none none' }
    });
    boldTl
        .from('.bold-word-1', { y: isMobile ? 30 : 80, opacity: 0, duration: isMobile ? 0.5 : 0.9, ease: 'power4.out' })
        .from('.bold-word-2', { y: isMobile ? 30 : 80, opacity: 0, duration: isMobile ? 0.5 : 0.9, ease: 'power4.out' }, isMobile ? '-=0.35' : '-=0.55')
        .to('.bold-accent-line', { width: isMobile ? 50 : 100, duration: isMobile ? 0.4 : 0.6, ease: 'power2.inOut' }, '-=0.25');

    if (!isMobile) {
        gsap.to('.bold-word-1', { scale: 1.06, ease: 'none', scrollTrigger: { trigger: '.bold-section', start: 'top center', end: 'bottom top', scrub: 2 } });
        gsap.to('.bold-word-2', { scale: 1.1, ease: 'none', scrollTrigger: { trigger: '.bold-section', start: 'top center', end: 'bottom top', scrub: 2 } });
    }

    // === GALLERY ===
    const galleryTrack = document.querySelector('.gallery-track');
    if (galleryTrack) {
        const totalW = galleryTrack.scrollWidth - window.innerWidth;
        if (isMobile) {
            // Mobile: no pin, gentle scroll-linked slide
            gsap.to('.gallery-track', {
                x: -(totalW * 0.6),
                ease: 'none',
                scrollTrigger: { trigger: '.gallery-section', start: 'top 85%', end: 'bottom 15%', scrub: 0.5 }
            });
        } else {
            gsap.to('.gallery-track', {
                x: -totalW,
                ease: 'none',
                scrollTrigger: { trigger: '.gallery-section', start: 'top top', end: () => `+=${totalW}`, scrub: 1, pin: true, anticipatePin: 1 }
            });
        }
    }

    // === 3D TILT (desktop only) ===
    if (!isMobile) {
        document.querySelectorAll('.gallery-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                gsap.to(card, { rotateY: x * 8, rotateX: y * -8, transformPerspective: 500, duration: 0.25, overwrite: true });
            });
            card.addEventListener('mouseleave', () => gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.4, overwrite: true }));
        });
    }

    // === TESTIMONIALS ===
    reveal('.testimonial-card', { y: isMobile ? 18 : 40, stagger: isMobile ? 0.06 : 0.12, trigger: '.testimonials-list' });
    reveal('.testimonial-rating', { y: 12, trigger: '.testimonial-rating' });

    // === CTA BANNER ===
    reveal('.cta-banner-text', { y: isMobile ? 18 : 45, trigger: '.cta-banner', start: isMobile ? 'top 85%' : 'top 78%' });
    reveal('.cta-banner .btn-primary', { y: 12, delay: 0.1, trigger: '.cta-banner', start: isMobile ? 'top 85%' : 'top 78%' });

    // === TICKER ===
    if (!isMobile) {
        gsap.to('.ticker-track', { x: '-=150', ease: 'none', scrollTrigger: { trigger: '.ticker-section', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    }

    // === TRANSFORMATION TIMELINE ===
    reveal('.timeline-item', { y: isMobile ? 20 : 40, stagger: isMobile ? 0.1 : 0.18, trigger: '.transform-timeline', start: isMobile ? 'top 85%' : 'top 78%' });

    gsap.from('.timeline-marker', {
        scale: 0,
        stagger: isMobile ? 0.1 : 0.18,
        duration: isMobile ? 0.35 : 0.5,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '.transform-timeline', start: isMobile ? 'top 85%' : 'top 78%', toggleActions: 'play none none none' }
    });

    // === VISIT ===
    if (isMobile) {
        reveal('.visit-info', { y: 20, trigger: '.visit-grid', start: 'top 85%' });
        reveal('.visit-cta', { y: 20, delay: 0.08, trigger: '.visit-cta', start: 'top 88%' });
    } else {
        gsap.from('.visit-info', { x: -40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.visit-grid', start: 'top 75%', toggleActions: 'play none none none' } });
        gsap.from('.visit-cta', { x: 40, opacity: 0, duration: 0.9, delay: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.visit-grid', start: 'top 75%', toggleActions: 'play none none none' } });
    }

    // === FOOTER ===
    reveal('.footer-inner', { y: 15, trigger: '.footer', start: 'top 92%' });

    // === SOUND BTN ===
    const soundBtn = document.getElementById('soundBtn');
    if (soundBtn) soundBtn.addEventListener('click', () => { soundBtn.style.opacity = soundBtn.style.opacity === '0.4' ? '1' : '0.4'; });

})();
