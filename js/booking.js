// Booking System
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
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.style.background = 'white';
            slot.style.borderColor = '#e0e0e0';
        });

        const selected = document.querySelector(`[data-time="${time}"]`);
        if (selected && parseFloat(selected.style.opacity) !== 0.5) {
            selected.style.background = 'rgba(201, 169, 97, 0.2)';
            selected.style.borderColor = '#c9a961';

            const dateInput = document.querySelector('input[name="date"]');
            if (dateInput && dateInput.value) {
                const datePart = dateInput.value;
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

        if (!this.validateBooking(data)) return;

        this.saveBooking(data);

        const dateKey = data.date.replace(/:/g, '').replace('T', '');
        this.bookedTimes[dateKey] = true;
        localStorage.setItem('bookedTimes', JSON.stringify(this.bookedTimes));

        this.showSuccessMessage(data);

        e.target.reset();
        this.renderAvailableTimes();
    }

    validateBooking(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('❌ البريد الإلكتروني غير صحيح');
            return false;
        }

        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(data.phone)) {
            alert('❌ رقم الهاتف غير صحيح');
            return false;
        }

        return true;
    }

    saveBooking(data) {
        let bookings = JSON.parse(localStorage.getItem('iconemonde_bookings')) || [];
        bookings.push(data);
        localStorage.setItem('iconemonde_bookings', JSON.stringify(bookings));
        console.log('✅ تم حفظ الحجز:', data);
    }

    showSuccessMessage(data) {
        const message = `🎉 تم تأكيد الحجز بنجاح!\n\nتفاصيل الحجز:\nالاسم: ${data.name}\nالبريد: ${data.email}\nالخدمة: ${data.service}\n\nسيتم التواصل معك قريباً`;
        alert(message);
    }
}

// Initialize Booking System
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 تهيئة نظام الحجوزات...');
    const bookingSystem = new BookingSystem();

    // Expose to global scope
    window.iconemonde = {
        booking: bookingSystem,
        getBookings: () => JSON.parse(localStorage.getItem('iconemonde_bookings')),
        clearData: () => {
            localStorage.clear();
            location.reload();
        }
    };

    console.log('✅ تم تهيئة جميع الأنظمة بنجاح!');
});
