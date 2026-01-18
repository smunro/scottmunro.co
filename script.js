// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const testimonialsTrack = document.getElementById('testimonials-track');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const carouselDots = document.getElementById('carousel-dots');
const contactForm = document.getElementById('contact-form');

// ===== Navigation =====
// Navbar scroll effect
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    lastScrollY = window.scrollY;
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== Testimonials Carousel =====
let currentSlide = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');
const totalSlides = testimonialCards.length;

// Create dots
function createDots() {
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        carouselDots.appendChild(dot);
    }
}

// Update carousel position
function updateCarousel() {
    testimonialsTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update dots
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Go to specific slide
function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

// Next slide
function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

// Previous slide
function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

// Event listeners for carousel
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Auto-advance carousel every 6 seconds
let carouselInterval = setInterval(nextSlide, 6000);

// Pause auto-advance on hover
testimonialsTrack.addEventListener('mouseenter', () => {
    clearInterval(carouselInterval);
});

testimonialsTrack.addEventListener('mouseleave', () => {
    carouselInterval = setInterval(nextSlide, 6000);
});

// Initialize dots
createDots();

// ===== Touch/Swipe Support for Carousel =====
let touchStartX = 0;
let touchEndX = 0;

testimonialsTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    clearInterval(carouselInterval);
}, { passive: true });

testimonialsTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    carouselInterval = setInterval(nextSlide, 6000);
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

// ===== Contact Form =====
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
        const response = await fetch('https://formspree.io/f/c63b3c65-b821-4383-9986-de525ae74876', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Show success message
            contactForm.innerHTML = `
                <div class="form-success">
                    <div class="form-success-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                    </div>
                    <h3>Message Sent!</h3>
                    <p>Thank you for reaching out. I'll get back to you within 24-48 hours.</p>
                </div>
            `;
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        // Show error state
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        alert('There was an error sending your message. Please try again or email smunro408@gmail.com directly.');
    }
});

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const animateOnScroll = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
        }
    });
};

const observer = new IntersectionObserver(animateOnScroll, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .blog-card, .about-content, .contact-info').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add animated class styles
const style = document.createElement('style');
style.textContent = `
    .animated {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ===== Active Navigation Link Highlighting =====
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.scrollY;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// Add active link styles
const activeStyle = document.createElement('style');
activeStyle.textContent = `
    .nav-link.active {
        color: var(--color-accent);
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(activeStyle);

// ===== Keyboard Navigation for Carousel =====
document.addEventListener('keydown', (e) => {
    // Only if testimonials section is in view
    const testimonialsSection = document.getElementById('testimonials');
    const rect = testimonialsSection.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;

    if (isInView) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    }
});

// ===== Preload Critical Resources =====
window.addEventListener('load', () => {
    // Add loaded class for any entrance animations
    document.body.classList.add('loaded');
});

// ===== Console Welcome Message =====
console.log('%cScott Munro - Executive Coaching & GTM Advisory', 'font-size: 16px; font-weight: bold; color: #1a365d;');
console.log('%cInterested in working together? Reach out at the contact form above!', 'font-size: 12px; color: #718096;');

// ===== Easter Egg: Triple-click Dragon Slayer =====
const navLogo = document.querySelector('.nav-logo');
const easterEgg = document.getElementById('easter-egg');
const pixelScott = document.getElementById('pixel-scott');
const spell = document.getElementById('spell');
const pixelDragon = document.getElementById('pixel-dragon');

let clickCount = 0;
let clickTimer = null;
let easterEggPlaying = false;

navLogo.addEventListener('click', (e) => {
    if (easterEggPlaying) return;

    clickCount++;

    if (clickTimer) {
        clearTimeout(clickTimer);
    }

    clickTimer = setTimeout(() => {
        clickCount = 0;
    }, 500);

    if (clickCount === 3) {
        e.preventDefault();
        clickCount = 0;
        playEasterEgg();
    }
});

function playEasterEgg() {
    easterEggPlaying = true;

    // Reset classes
    pixelScott.classList.remove('animate');
    spell.classList.remove('animate');
    pixelDragon.classList.remove('animate');

    // Show container
    easterEgg.classList.add('active');

    // Trigger reflow to restart animations
    void pixelScott.offsetWidth;

    // Start animations
    setTimeout(() => {
        pixelScott.classList.add('animate');
        pixelDragon.classList.add('animate');
    }, 100);

    setTimeout(() => {
        spell.classList.add('animate');
    }, 100);

    // Play victory sound effect (optional console message)
    setTimeout(() => {
        console.log('%c⚔️ DRAGON SLAIN! +1000 XP', 'font-size: 20px; color: gold; text-shadow: 2px 2px 0 #333;');
    }, 2300);

    // Hide after animation completes
    setTimeout(() => {
        easterEgg.classList.remove('active');
        pixelScott.classList.remove('animate');
        spell.classList.remove('animate');
        pixelDragon.classList.remove('animate');
        easterEggPlaying = false;
    }, 3500);
}
