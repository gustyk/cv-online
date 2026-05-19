// ===== PAGE LOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('pageLoader').classList.add('loaded');
        animateHero();
        initCounters();
    }, 800);
});

// ===== CUSTOM CURSOR =====
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;

    // Spotlight follow
    const spotlight = document.getElementById('spotlight');
    if (spotlight) {
        spotlight.style.setProperty('--x', mouseX + 'px');
        spotlight.style.setProperty('--y', mouseY + 'px');
    }
});

function animateCursorRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
    requestAnimationFrame(animateCursorRing);
}
animateCursorRing();

document.addEventListener('mousedown', () => cursorRing.classList.add('click'));
document.addEventListener('mouseup', () => cursorRing.classList.remove('click'));

// Cursor hover effects
const hoverElements = document.querySelectorAll('a, button, .expertise-card, .experience-card, .course-card, .research-pill, .keyword-pill');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

// ===== HERO ANIMATION =====
function animateHero() {
    const heroName = document.getElementById('heroName');
    const text = heroName.textContent;
    heroName.innerHTML = '';
    text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = char === ' ' ? '\u00A0' : char;
        heroName.appendChild(span);
    });

    gsap.to('.hero-name .letter', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.03,
        ease: 'power3.out',
        delay: 0.2
    });

    gsap.to('.hero-title', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.8
    });

    gsap.to('.hero-tags', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 1
    });

    gsap.to('.hero-description', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 1.2
    });

    gsap.to('.hero-cta', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 1.4
    });

    gsap.to('.hero-photo', {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.6
    });
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
}, { passive: true });

// ===== MOBILE MENU =====
const hamburger = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== SCROLL DOTS =====
const sections = document.querySelectorAll('section[id]');
const dots = document.querySelectorAll('.scroll-dot');

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const target = document.getElementById(dot.dataset.section);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    dots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.dataset.section === current) {
            dot.classList.add('active');
        }
    });
}, { passive: true });

// ===== INTERSECTION OBSERVER FOR REVEALS =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.reveal, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
});

// ===== EDUCATION TIMELINE ANIMATION =====
const timeline = document.getElementById('educationTimeline');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, { threshold: 0.3 });

if (timeline) timelineObserver.observe(timeline);

// ===== COUNTER ANIMATION =====
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

// ===== 3D TILT EFFECT =====
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach(card => {
    const inner = card.querySelector('.tilt-card-inner');

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;

        inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        inner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// ===== MAGNETIC BUTTONS =====
const magneticBtns = document.querySelectorAll('.hero-cta, .btn-primary, .btn-secondary, .scholar-btn');

magneticBtns.forEach(btn => {
    btn.classList.add('magnetic-btn');

    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ===== TEXT SCRAMBLE EFFECT =====
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => this.resolve = resolve);
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;

        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];

            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.chars[Math.floor(Math.random() * this.chars.length)];
                    this.queue[i].char = char;
                }
                output += `<span style="color: var(--accent); opacity: 0.6;">${char}</span>`;
            } else {
                output += from;
            }
        }

        this.el.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
}

// Apply scramble to nav links on hover
document.querySelectorAll('.nav-links a').forEach(link => {
    const originalText = link.textContent;
    const fx = new TextScramble(link);

    link.addEventListener('mouseenter', () => {
        fx.setText(originalText);
    });
});

// ===== GSAP SCROLL TRIGGER ANIMATIONS =====
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Parallax for hero blobs
    gsap.to('.hero-bg-blob-1', {
        y: -100,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });

    gsap.to('.hero-bg-blob-2', {
        y: -60,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });

    // Parallax for focus image
    gsap.to('.focus-image-placeholder', {
        y: -30,
        scrollTrigger: {
            trigger: '.focus',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        }
    });

    // Teaching philosophy word reveal
    const quoteWords = document.querySelectorAll('.teaching-philosophy .quote-text');
    quoteWords.forEach(el => {
        const words = el.textContent.split(' ');
        el.innerHTML = '';
        words.forEach((word, i) => {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = word + '\u00A0';
            el.appendChild(span);
        });

        ScrollTrigger.create({
            trigger: el,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(el.querySelectorAll('.word'), {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.04,
                    ease: 'power2.out'
                });
            },
            once: true
        });
    });

    // Positioning word reveal
    const positioningHeading = document.querySelector('.positioning-heading');
    if (positioningHeading) {
        const words = positioningHeading.textContent.trim().split(' ');
        positioningHeading.innerHTML = '';
        words.forEach((word) => {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = word + '\u00A0';
            positioningHeading.appendChild(span);
        });

        ScrollTrigger.create({
            trigger: positioningHeading,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(positioningHeading.querySelectorAll('.word'), {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: 'power2.out'
                });
            },
            once: true
        });
    }

    // Section headings gradient shimmer on scroll
    document.querySelectorAll('.section-heading .gradient-text').forEach(el => {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 80%',
            onEnter: () => {
                el.style.animationPlayState = 'running';
            },
            once: true
        });
    });

    // Stats counter parallax
    gsap.from('.stat-item', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
            trigger: '.stats-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
}

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== GLITCH EFFECT ON HOVER FOR HERO NAME =====
const heroName = document.getElementById('heroName');
if (heroName) {
    heroName.classList.add('glitch');
    heroName.setAttribute('data-text', heroName.textContent);
}

// ===== RE-OBSERVE DYNAMICALLY CREATED ELEMENTS FOR CURSOR =====
function refreshCursorHovers() {
    const newHoverElements = document.querySelectorAll('a, button, .expertise-card, .experience-card, .course-card, .research-pill, .keyword-pill, .tilt-card');
    newHoverElements.forEach(el => {
        el.removeEventListener('mouseenter', cursorHoverEnter);
        el.removeEventListener('mouseleave', cursorHoverLeave);
        el.addEventListener('mouseenter', cursorHoverEnter);
        el.addEventListener('mouseleave', cursorHoverLeave);
    });
}

function cursorHoverEnter() { cursorRing.classList.add('hover'); }
function cursorHoverLeave() { cursorRing.classList.remove('hover'); }

setTimeout(refreshCursorHovers, 1000);
