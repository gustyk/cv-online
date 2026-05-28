// ===== GSAP + LENIS SETUP =====
gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// ===== PAGE LOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('pageLoader').classList.add('loaded');
        animateHero();
        initCounters();
        initTypedText();
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
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

    const spotlight = document.getElementById('spotlight');
    if (spotlight) {
        spotlight.style.setProperty('--x', mouseX + 'px');
        spotlight.style.setProperty('--y', mouseY + 'px');
    }
});

function animateCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateCursor);
}
animateCursor();

// ===== CANVAS CURSOR TRAIL =====
const trailCanvas = document.getElementById('cursorTrailCanvas');
const trailCtx = trailCanvas.getContext('2d');
const trailPoints = [];
const TRAIL_LENGTH = 25;

function resizeTrailCanvas() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
}
resizeTrailCanvas();
window.addEventListener('resize', resizeTrailCanvas);

document.addEventListener('mousemove', (e) => {
    trailPoints.push({ x: e.clientX, y: e.clientY });
    if (trailPoints.length > TRAIL_LENGTH) trailPoints.shift();
});

function drawTrail() {
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

    if (trailPoints.length < 2) {
        requestAnimationFrame(drawTrail);
        return;
    }

    // Draw glowing trail
    for (let i = 1; i < trailPoints.length; i++) {
        const p0 = trailPoints[i - 1];
        const p1 = trailPoints[i];
        const progress = i / trailPoints.length;
        const alpha = progress * 0.8;
        const width = progress * 10 + 2;

        // Glow layer
        trailCtx.beginPath();
        trailCtx.moveTo(p0.x, p0.y);
        trailCtx.lineTo(p1.x, p1.y);
        trailCtx.strokeStyle = `rgba(139, 92, 246, ${alpha * 0.4})`;
        trailCtx.lineWidth = width + 8;
        trailCtx.lineCap = 'round';
        trailCtx.lineJoin = 'round';
        trailCtx.stroke();

        // Core layer
        trailCtx.beginPath();
        trailCtx.moveTo(p0.x, p0.y);
        trailCtx.lineTo(p1.x, p1.y);
        trailCtx.strokeStyle = `rgba(96, 165, 250, ${alpha})`;
        trailCtx.lineWidth = width;
        trailCtx.lineCap = 'round';
        trailCtx.lineJoin = 'round';
        trailCtx.stroke();
    }

    // Bright dot at the end
    const last = trailPoints[trailPoints.length - 1];
    const glow = trailCtx.createRadialGradient(last.x, last.y, 0, last.x, last.y, 16);
    glow.addColorStop(0, 'rgba(96, 165, 250, 0.6)');
    glow.addColorStop(0.5, 'rgba(139, 92, 246, 0.2)');
    glow.addColorStop(1, 'rgba(139, 92, 246, 0)');
    trailCtx.beginPath();
    trailCtx.arc(last.x, last.y, 16, 0, Math.PI * 2);
    trailCtx.fillStyle = glow;
    trailCtx.fill();

    requestAnimationFrame(drawTrail);
}
drawTrail();

document.addEventListener('mousedown', () => cursorRing.classList.add('click'));
document.addEventListener('mouseup', () => cursorRing.classList.remove('click'));

const hoverElements = document.querySelectorAll('a, button, .expertise-card, .experience-card, .course-card, .research-pill, .keyword-pill, .tilt-card, .footer-social-link, .back-to-top');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

// ===== CURSOR GLOW FOLLOW ON CARDS =====
document.querySelectorAll('.expertise-card, .experience-card, .course-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
    });
});

// ===== FOCUS IMAGE PARALLAX TILT =====
const focusFrame = document.querySelector('.focus-image-frame');
if (focusFrame) {
    focusFrame.addEventListener('mousemove', (e) => {
        const rect = focusFrame.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        focusFrame.style.transform = `perspective(800px) rotateX(${y * -12}deg) rotateY(${x * 12}deg) scale3d(1.03, 1.03, 1.03)`;
    });

    focusFrame.addEventListener('mouseleave', () => {
        focusFrame.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
}

// ===== RIPPLE EFFECT =====
const rippleContainer = document.getElementById('rippleContainer');

document.querySelectorAll('.hero-cta, .btn-primary, .scholar-btn, .footer-social-link').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        rippleContainer.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// ===== HERO ANIMATION =====
function animateHero() {
    const heroName = document.getElementById('heroName');
    const text = heroName.textContent;
    heroName.innerHTML = '';
    text.split('').forEach((char) => {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = char === ' ' ? '\u00A0' : char;
        heroName.appendChild(span);
    });

    gsap.to('.hero-name .letter', { opacity: 1, y: 0, duration: 0.6, stagger: 0.03, ease: 'power3.out', delay: 0.2 });
    gsap.to('.hero-title', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.8 });
    gsap.to('.hero-tags', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1 });
    gsap.to('.hero-description', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.2 });
    gsap.to('.hero-cta', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.4 });
    gsap.to('.hero-photo', { opacity: 1, scale: 1, rotation: 0, duration: 1, ease: 'power3.out', delay: 0.6 });
}

// ===== TYPED TEXT EFFECT =====
const typingPhrases = [
    'Into Practical Digital Systems',
    'With ERP & BPMN',
    'For Modern Organizations',
    'From Concept to Execution'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 80;

function initTypedText() {
    const subtitleEl = document.getElementById('heroSubtitle');
    if (!subtitleEl) return;
    typePhrase(subtitleEl);
}

function typePhrase(el) {
    const currentPhrase = typingPhrases[phraseIndex];

    if (isDeleting) {
        el.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
    } else {
        el.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % typingPhrases.length;
        typingSpeed = 500;
    }

    setTimeout(() => typePhrase(el), typingSpeed);
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, { passive: true });

// ===== SCROLL PROGRESS BAR =====
const scrollProgress = document.getElementById('scrollProgress');

gsap.to(scrollProgress, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
    }
});

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
        const href = link.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
            setTimeout(() => lenis.scrollTo(target, { offset: -80 }), 100);
        }
    });
});

// ===== SCROLL DOTS =====
const sections = document.querySelectorAll('section[id]');
const dots = document.querySelectorAll('.scroll-dot');

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const target = document.getElementById(dot.dataset.section);
        if (target) lenis.scrollTo(target, { offset: -80 });
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
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-scale, .reveal-clip').forEach(el => {
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
                animateCounter(entry.target, parseInt(entry.target.dataset.target));
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.floor(eased * target) + '+';

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target + '+';
            element.style.textShadow = '0 0 20px rgba(59, 130, 246, 0.4)';
            setTimeout(() => { element.style.textShadow = 'none'; }, 1000);
        }
    }

    requestAnimationFrame(update);
}

// ===== 3D TILT EFFECT =====
document.querySelectorAll('.tilt-card').forEach(card => {
    const inner = card.querySelector('.tilt-card-inner');

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (e.clientY - rect.top - centerY) / 15;
        const rotateY = (centerX - (e.clientX - rect.left)) / 15;
        inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        inner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// ===== MAGNETIC BUTTONS =====
document.querySelectorAll('.hero-cta, .btn-primary, .scholar-btn').forEach(btn => {
    btn.classList.add('magnetic-btn');

    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - rect.left - rect.width / 2) * 0.2}px, ${(e.clientY - rect.top - rect.height / 2) * 0.2}px)`;
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

document.querySelectorAll('.nav-links a').forEach(link => {
    const originalText = link.textContent;
    const fx = new TextScramble(link);
    link.addEventListener('mouseenter', () => fx.setText(originalText));
});

// ===== GSAP SCROLL TRIGGER ANIMATIONS =====
// Hero blob parallax
gsap.to('.hero-bg-blob-1', { y: -100, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
gsap.to('.hero-bg-blob-2', { y: -60, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });

// Focus image parallax
gsap.to('.focus-image-placeholder', { y: -30, scrollTrigger: { trigger: '.focus', start: 'top bottom', end: 'bottom top', scrub: 1 } });

// Teaching philosophy word reveal
document.querySelectorAll('.teaching-philosophy .quote-text').forEach(el => {
    const words = el.textContent.split(' ');
    el.innerHTML = '';
    words.forEach((word) => {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = word + '\u00A0';
        el.appendChild(span);
    });

    ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        onEnter: () => {
            gsap.to(el.querySelectorAll('.word'), { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out' });
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
            gsap.to(positioningHeading.querySelectorAll('.word'), { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' });
        },
        once: true
    });
}

// Stats counter parallax
gsap.from('.stat-item', {
    y: 50, opacity: 0, duration: 0.8, stagger: 0.15,
    scrollTrigger: { trigger: '.stats-grid', start: 'top 80%', toggleActions: 'play none none none' }
});

// Expertise cards entrance
document.querySelectorAll('.expertise-card').forEach((card, i) => {
    gsap.from(card, {
        y: 60, opacity: 0, rotation: i % 2 === 0 ? -2 : 2, scale: 0.95, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' }
    });
});

// Experience cards slide
document.querySelectorAll('.experience-card').forEach((card, i) => {
    gsap.from(card, {
        x: i % 2 === 0 ? -50 : 50, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' }
    });
});

// Course cards scale
document.querySelectorAll('.course-card').forEach((card, i) => {
    gsap.from(card, {
        y: 40, opacity: 0, scale: 0.9, duration: 0.7, delay: i * 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' }
    });
});

// Research pills stagger
gsap.from('.research-pill', {
    y: 20, opacity: 0, scale: 0.8, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)',
    scrollTrigger: { trigger: '.research-areas', start: 'top 80%', toggleActions: 'play none none none' }
});

// Research publications slide
document.querySelectorAll('.research-contributions li').forEach((item, i) => {
    gsap.from(item, {
        x: -30, opacity: 0, duration: 0.5, delay: i * 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 90%', toggleActions: 'play none none none' }
    });
});

// Keyword pills stagger
gsap.from('.keyword-pill', {
    y: 15, opacity: 0, scale: 0.85, duration: 0.4, stagger: 0.05, ease: 'back.out(1.7)',
    scrollTrigger: { trigger: '.positioning-keywords', start: 'top 85%', toggleActions: 'play none none none' }
});

// Cert items slide
document.querySelectorAll('.cert-item').forEach((item, i) => {
    gsap.from(item, {
        x: -30, opacity: 0, duration: 0.6, delay: i * 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' }
    });
});

// Education timeline items
document.querySelectorAll('.education-item').forEach((item, i) => {
    gsap.from(item, {
        x: 30, opacity: 0, duration: 0.6, delay: i * 0.2, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' }
    });
});

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            lenis.scrollTo(target, { offset: -80 });
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
    document.querySelectorAll('a, button, .expertise-card, .experience-card, .course-card, .research-pill, .keyword-pill, .tilt-card, .footer-social-link, .back-to-top').forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
}

setTimeout(refreshCursorHovers, 1000);

// ===== BACK TO TOP BUTTON =====
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}, { passive: true });

backToTop.addEventListener('click', () => {
    lenis.scrollTo(0, { duration: 1.5 });
});

// ===== NAV ACTIVE BAR =====
const navBar = document.createElement('div');
navBar.className = 'nav-active-bar';
document.body.appendChild(navBar);

function updateNavActiveBar() {
    const navLinks = document.querySelectorAll('.nav-links a');
    let activeLink = null;

    navLinks.forEach(link => {
        const section = document.querySelector(link.getAttribute('href'));
        if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom >= 200) {
                activeLink = link;
            }
        }
    });

    if (activeLink) {
        const rect = activeLink.getBoundingClientRect();
        navBar.style.width = rect.width + 'px';
        navBar.style.left = rect.left + 'px';
        navBar.style.opacity = '1';
    } else {
        navBar.style.opacity = '0';
    }
}

window.addEventListener('scroll', updateNavActiveBar, { passive: true });
window.addEventListener('resize', updateNavActiveBar, { passive: true });
setTimeout(updateNavActiveBar, 100);
