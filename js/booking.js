/* ===== Booking System ===== */

class BookingSystem {
    constructor() {
        this.availableTimes = [
            '09:00', '09:30', '10:00', '10:30',
            '11:00', '11:30', '14:00', '14:30',
            '15:00', '15:30', '16:00', '16:30'
        ];
        this.bookedTimes = JSON.parse(localStorage.getItem('bookedTimes')) || {};
        this.init();
    }

    init() {
        this.renderAvailableTimes();
        this.setupFormListeners();
    }

    renderAvailableTimes() {
        const container = document.getElementById('availableTimes');
        if (!container) return;

        container.innerHTML = '';

        this.availableTimes.forEach(time => {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = time;
            timeSlot.dataset.time = time;

            // Check if time is already booked
            const today = new Date().toISOString().split('T')[0];
            if (this.bookedTimes[`${today}${time}`]) {
                timeSlot.style.opacity = '0.5';
                timeSlot.style.cursor = 'not-allowed';
                timeSlot.textContent = time + ' (مشغول)';
            } else {
                timeSlot.addEventListener('click', () => this.selectTime(time));
            }

            container.appendChild(timeSlot);
        });
    }

    selectTime(time) {
        // Remove previous selection
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.style.background = 'rgba(255, 255, 255, 0.1)';
        });

        // Highlight selected time
        const selected = document.querySelector(`[data-time="${time}"]`);
        if (selected) {
            selected.style.background = 'rgba(201, 169, 97, 0.3)';
            selected.style.borderColor = '#c9a961';

            // Set the time in the hidden input
            const dateInput = document.querySelector('input[name="date"]');
            if (dateInput && dateInput.value) {
                // Parse the date part and add the time
                const datePart = dateInput.value.split('T')[0];
                dateInput.value = `${datePart}T${time}`;
            }
        }
    }

    setupFormListeners() {
        const form = document.getElementById('bookingForm');
        if (!form) return;

        form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            company: formData.get('company'),
            service: formData.get('service'),
            date: formData.get('date'),
            message: formData.get('message') || '',
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        // Validate
        if (!this.validateBooking(data)) return;

        // Save booking
        this.saveBooking(data);

        // Mark time as booked
        const dateKey = data.date.replace(':', '');
        this.bookedTimes[dateKey] = true;
        localStorage.setItem('bookedTimes', JSON.stringify(this.bookedTimes));

        // Show success message
        this.showSuccessMessage(data);

        // Reset form
        e.target.reset();
        this.renderAvailableTimes();
    }

    validateBooking(data) {
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showError('البريد الإلكتروني غير صحيح');
            return false;
        }

        // Phone validation
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(data.phone)) {
            this.showError('رقم الهاتف غير صحيح');
            return false;
        }

        // Date validation
        const selectedDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            this.showError('يرجى اختيار تاريخ في المستقبل');
            return false;
        }

        return true;
    }

    saveBooking(data) {
        let bookings = JSON.parse(localStorage.getItem('iconemonde_bookings')) || [];
        bookings.push(data);
        localStorage.setItem('iconemonde_bookings', JSON.stringify(bookings));

        // Also send to analytics if available
        if (typeof trackEvent !== 'undefined') {
            trackEvent('booking', 'booking_submitted', data.service);
        }
    }

    showSuccessMessage(data) {
        const message = `
🎉 تم تأكيد الحجز بنجاح!

تفاصيل الحجز:
- الاسم: ${data.name}
- البريد: ${data.email}
- الخدمة: ${this.getServiceName(data.service)}
- الموعد: ${new Date(data.date).toLocaleString('ar-SA')}

سيتم التواصل معك قريباً لتأكيد الموعد.
        `;

        alert(message);

        // Send email notification (if backend available)
        this.sendEmailNotification(data);
    }

    showError(message) {
        alert('❌ ' + message);
    }

    getServiceName(serviceCode) {
        const services = {
            'video': 'إنتاج فيديوهات',
            'website': 'تصميم موقع',
            'app': 'تطبيق موبايل',
            'ui-ux': 'تصميم UI/UX',
            'marketing': 'تسويق رقمي',
            'other': 'أخرى'
        };
        return services[serviceCode] || 'خدمة غير محددة';
    }

    sendEmailNotification(data) {
        // In production, this would call a backend API
        const emailData = {
            to: data.email,
            subject: 'تأكيد حجز استشارة - إيكون عالم',
            body: `
مرحباً ${data.name},

شكراً لحجزك استشارة معنا!

تفاصيل حجزك:
- الخدمة: ${this.getServiceName(data.service)}
- الموعد: ${new Date(data.date).toLocaleString('ar-SA')}
- الشركة: ${data.company}

سيتم التواصل معك على الرقم ${data.phone} قبل موعد الاستشارة بـ 24 ساعة.

مع أطيب التحيات,
فريق إيكون عالم
            `
        };

        // Log for demonstration
        console.log('Email would be sent with:', emailData);

        // In production, this would be:
        // fetch('/api/send-email', { method: 'POST', body: JSON.stringify(emailData) })
    }
}

/* ===== CRM System Simulation ===== */
class CRMSystem {
    constructor() {
        this.initCRM();
    }

    initCRM() {
        // Initialize CRM tracking
        this.trackUserBehavior();
        this.trackConversions();
    }

    trackUserBehavior() {
        // Track page views
        console.log('CRM: Tracking user behavior');

        // Track time on page
        let timeOnPage = 0;
        setInterval(() => {
            timeOnPage += 1;
            if (timeOnPage % 60 === 0) {
                console.log(`User has been on page for ${timeOnPage} seconds`);
            }
        }, 1000);

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercentage > maxScroll) {
                maxScroll = scrollPercentage;
                if (maxScroll % 25 === 0) {
                    console.log(`User scrolled to ${Math.round(maxScroll)}%`);
                }
            }
        });
    }

    trackConversions() {
        // Track form submissions
        document.getElementById('bookingForm')?.addEventListener('submit', () => {
            console.log('CRM: Booking conversion recorded');
            this.recordConversion('booking', 'high');
        });

        // Track button clicks
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('CRM: Button click recorded -', btn.textContent);
                this.recordConversion('button_click', 'medium');
            });
        });
    }

    recordConversion(type, priority) {
        const conversion = {
            type: type,
            priority: priority,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };

        let conversions = JSON.parse(localStorage.getItem('crm_conversions')) || [];
        conversions.push(conversion);
        localStorage.setItem('crm_conversions', JSON.stringify(conversions));

        console.log('Conversion recorded:', conversion);
    }
}

/* ===== Email Marketing Integration ===== */
class EmailMarketing {
    constructor() {
        this.subscribers = JSON.parse(localStorage.getItem('email_subscribers')) || [];
    }

    subscribeUser(email) {
        if (!this.subscribers.includes(email)) {
            this.subscribers.push(email);
            localStorage.setItem('email_subscribers', JSON.stringify(this.subscribers));
            console.log('User subscribed to newsletter:', email);
            return true;
        }
        return false;
    }

    sendWelcomeEmail(email, name) {
        const emailData = {
            to: email,
            subject: 'مرحباً بك في إيكون عالم!',
            body: `
مرحباً ${name},

شكراً لاشتراكك في نشرتنا البريدية. ستصلك أحدث التحديثات والعروض الخاصة.

مع أطيب التحيات,
فريق إيكون عالم
            `
        };

        console.log('Welcome email would be sent:', emailData);
    }

    sendCampaignEmail(campaignId, subject, body) {
        this.subscribers.forEach(email => {
            console.log(`Sending campaign ${campaignId} to ${email}`);
        });
    }
}

/* ===== Analytics Tracker ===== */
class AnalyticsTracker {
    constructor() {
        this.events = [];
        this.initAnalytics();
    }

    initAnalytics() {
        // Track page load
        window.addEventListener('load', () => {
            this.trackEvent('page_load', {
                pageTitle: document.title,
                pageURL: window.location.href,
                referrer: document.referrer
            });
        });

        // Track engagement
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' || e.target.classList.contains('btn')) {
                this.trackEvent('user_engagement', {
                    element: e.target.textContent,
                    elementType: e.target.tagName
                });
            }
        });

        // Track form interactions
        document.querySelectorAll('form input, form textarea').forEach(field => {
            field.addEventListener('focus', () => {
                this.trackEvent('form_focus', {
                    fieldName: field.name
                });
            });
        });
    }

    trackEvent(eventName, eventData) {
        const event = {
            name: eventName,
            data: eventData,
            timestamp: new Date().toISOString()
        };

        this.events.push(event);

        // Store in localStorage
        localStorage.setItem('analytics_events', JSON.stringify(this.events));

        // Log for development
        console.log('Analytics Event:', event);
    }

    getAnalytics() {
        return {
            totalEvents: this.events.length,
            events: this.events,
            sessionDuration: this.calculateSessionDuration()
        };
    }

    calculateSessionDuration() {
        if (this.events.length < 2) return 0;
        const first = new Date(this.events[0].timestamp);
        const last = new Date(this.events[this.events.length - 1].timestamp);
        return (last - first) / 1000; // in seconds
    }
}

/* ===== Initialize All Systems ===== */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Booking System...');
    const bookingSystem = new BookingSystem();

    console.log('🚀 Initializing CRM System...');
    const crm = new CRMSystem();

    console.log('🚀 Initializing Analytics Tracker...');
    const analytics = new AnalyticsTracker();

    console.log('🚀 Initializing Email Marketing...');
    const emailMarketing = new EmailMarketing();

    // Expose to global scope for debugging
    window.iconemonde = {
        booking: bookingSystem,
        crm: crm,
        analytics: analytics,
        email: emailMarketing,

        // Debug methods
        getBookings: () => JSON.parse(localStorage.getItem('iconemonde_bookings')),
        getAnalytics: () => analytics.getAnalytics(),
        getSubscribers: () => emailMarketing.subscribers,
        clearData: () => {
            localStorage.clear();
            location.reload();
        }
    };

    console.log('✅ All systems initialized successfully!');
    console.log('💡 Debug: Access window.iconemonde for system info');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BookingSystem,
        CRMSystem,
        EmailMarketing,
        AnalyticsTracker
    };
}