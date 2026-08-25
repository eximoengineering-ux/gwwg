/* ===== Mobile Menu Toggle ===== */
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

/* ===== Smooth Scroll Effect ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ===== Scroll Animations ===== */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.section-header, .about-card, .service-card, .portfolio-item, .contact-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

/* ===== Navbar Background on Scroll ===== */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
});

/* ===== Number Counter Animation ===== */
const counterElements = document.querySelectorAll('.stat-number');
let counted = false;

window.addEventListener('scroll', () => {
    if (!counted) {
        const statsSection = document.querySelector('.stats');
        if (statsSection && isInViewport(statsSection)) {
            counterElements.forEach(el => {
                const finalValue = parseInt(el.textContent);
                let currentValue = 0;
                const increment = finalValue / 50;

                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        el.textContent = el.textContent.replace(/\d+/, finalValue);
                        clearInterval(counter);
                    } else {
                        el.textContent = el.textContent.replace(/\d+/, Math.floor(currentValue));
                    }
                }, 30);
            });
            counted = true;
        }
    }
});

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

/* ===== Form Validation ===== */
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(bookingForm);
        const data = Object.fromEntries(formData);

        // Validate form
        if (!data.name || !data.email || !data.phone || !data.company || !data.service || !data.date) {
            alert('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('يرجى إدخال بريد إلكتروني صحيح');
            return;
        }

        // Validate phone
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(data.phone)) {
            alert('يرجى إدخال رقم هاتف صحيح');
            return;
        }

        // Success message
        alert('تم استلام حجزك بنجاح! سيتم التواصل معك قريباً.');
        console.log('Booking Data:', data);

        // Save to localStorage
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.push({
            ...data,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('bookings', JSON.stringify(bookings));

        // Reset form
        bookingForm.reset();
    });
}

/* ===== Parallax Effect ===== */
window.addEventListener('scroll', () => {
    const parallaxElements = document.querySelectorAll('.hero::before');
    const scrollPosition = window.scrollY;

    document.querySelectorAll('.floating-box').forEach((box, index) => {
        const offset = scrollPosition * (0.5 - index * 0.1);
        box.style.transform = `translateY(${offset}px)`;
    });
});

/* ===== Typing Animation ===== */
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

/* ===== Service Card Hover Animation ===== */
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) rotateX(5deg)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotateX(0)';
    });
});

/* ===== Portfolio Filter (if needed) ===== */
const portfolioItems = document.querySelectorAll('.portfolio-item');
portfolioItems.forEach(item => {
    item.addEventListener('click', function() {
        const info = this.querySelector('.portfolio-info h3');
        console.log('Clicked:', info.textContent);
    });
});

/* ===== Ripple Effect on Buttons ===== */
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

/* ===== Analytics Integration (Basic) ===== */
function trackPageView() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            'page_title': document.title,
            'page_location': window.location.href
        });
    }
}

function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// Track button clicks
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        trackEvent('engagement', 'button_click', button.textContent);
    });
});

// Track section views
document.querySelectorAll('section').forEach(section => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                trackEvent('engagement', 'section_view', entry.target.id || 'unknown');
            }
        });
    });
    observer.observe(section);
});

/* ===== Performance Optimization ===== */
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('lazy-loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// Debounce scroll events
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

// Initialize
console.log('إيكون عالم - موقع احترافي محسّن للأداء');
console.log('جميع الميزات قيد التشغيل بنجاح');