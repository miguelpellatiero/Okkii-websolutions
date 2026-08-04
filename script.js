const cookieBanner = document.getElementById('cookieBanner');
const acceptCookiesBtn = document.getElementById('acceptCookies');
const rejectCookiesBtn = document.getElementById('rejectCookies');

function hideCookieBanner() {
    if (cookieBanner) {
        cookieBanner.classList.remove('visible');
    }
}

function setCookieConsent(choice) {
    localStorage.setItem('okk-cookie-consent', choice);
    hideCookieBanner();
}

const savedConsent = localStorage.getItem('okk-cookie-consent');
if (savedConsent === 'accepted' || savedConsent === 'rejected') {
    hideCookieBanner();
} else if (cookieBanner) {
    cookieBanner.classList.add('visible');
}

if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener('click', () => setCookieConsent('accepted'));
}

if (rejectCookiesBtn) {
    rejectCookiesBtn.addEventListener('click', () => setCookieConsent('rejected'));
}

// Menu mobile
const toggle = document.getElementById('menuToggle');
const navMobile = document.getElementById('navMobile');

if (toggle && navMobile) {
    toggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMobile.classList.toggle('open');
    });

    document.querySelectorAll('#navMobile a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            navMobile.classList.remove('open');
        });
    });
}

// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            e.preventDefault();
            const offset = 80;
            const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// Header shadow on scroll
const header = document.getElementById('mainHeader');
window.addEventListener('scroll', () => {
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Cursor glow effect
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
        cursorGlow.style.opacity = '1';
    }
});
document.addEventListener('mouseleave', () => {
    if (cursorGlow) {
        cursorGlow.style.opacity = '0';
    }
});

// Fade-in com Intersection Observer
const fadeElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

fadeElements.forEach(el => observer.observe(el));

// Forçar visibilidade inicial para elementos já visíveis
setTimeout(() => {
    fadeElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.classList.add('visible');
        }
    });
}, 300);

// Partículas no canvas do hero
const canvas = document.getElementById('particlesCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const maxParticles = 60;

    function resizeCanvas() {
        const hero = document.getElementById('hero');
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.8;
            this.speedX = (Math.random() - 0.5) * 0.6;
            this.speedY = (Math.random() - 0.5) * 0.6;
            this.opacity = Math.random() * 0.5 + 0.15;
            this.color = Math.random() < 0.5 ?
                'rgba(216,67,116,' : 'rgba(244,132,104,';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();
        }
    }

    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(255,255,255,' + (0.04 * (1 - dist / 130)) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}
