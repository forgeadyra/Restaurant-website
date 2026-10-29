document.addEventListener('DOMContentLoaded', () => {
    // 1. Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealElements = document.querySelectorAll('.reveal');

    if (prefersReducedMotion) {
        revealElements.forEach((el) => {
            el.classList.add('is-visible');
        });
    } else {
        // 2. Scroll-triggered reveals via IntersectionObserver (triggered once)
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.12
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach((el) => {
            observer.observe(el);
        });
    }

    // Portfolio banner: dismiss and remember it (the <head> script hides it on later visits)
    const bannerClose = document.querySelector('.concept-banner__close');
    if (bannerClose) {
        bannerClose.addEventListener('click', () => {
            document.documentElement.classList.add('banner-dismissed');
            try {
                localStorage.setItem('adyra-banner-dismissed', '1');
            } catch (e) {
                // storage blocked (private mode etc.): it just stays hidden for this page view
            }
            // The button is gone, so give keyboard users a sensible place to continue from
            const next = [...document.querySelectorAll('header a, header button')]
                .find((el) => el.offsetParent !== null);
            if (next) next.focus();
        });
    }

    // 3. Mobile nav: hamburger toggle, closes on link click and Escape
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.getElementById('primary-nav');

    if (navToggle && navLinks) {
        const setNavOpen = (open) => {
            navToggle.setAttribute('aria-expanded', String(open));
            navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
            navLinks.classList.toggle('is-open', open);
        };

        navToggle.addEventListener('click', () => {
            setNavOpen(navToggle.getAttribute('aria-expanded') !== 'true');
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => setNavOpen(false));
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
                setNavOpen(false);
                navToggle.focus();
            }
        });
    }

    // 4. Highlight the nav link for the section currently in view
    const sectionLinks = new Map();
    document.querySelectorAll('.nav-links a[href^="#"]').forEach((link) => {
        const section = document.querySelector(link.getAttribute('href'));
        if (section) sectionLinks.set(section, link);
    });

    if (sectionLinks.size > 0) {
        const setActiveLink = (activeLink) => {
            sectionLinks.forEach((link) => {
                const isActive = link === activeLink;
                link.classList.toggle('active', isActive);
                if (isActive) link.setAttribute('aria-current', 'true');
                else link.removeAttribute('aria-current');
            });
        };

        // A section counts as "current" when it crosses the middle band of the viewport
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) setActiveLink(sectionLinks.get(entry.target));
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        sectionLinks.forEach((link, section) => sectionObserver.observe(section));

        // Clear the highlight when back at the hero
        const hero = document.getElementById('hero');
        if (hero) {
            new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) setActiveLink(null);
            }, { rootMargin: '-45% 0px -50% 0px' }).observe(hero);
        }
    }

    // 5. Reservation form: inline validation before Netlify handles the POST.
    // Without JS the browser's own required/pattern checks still apply.
    const reservationForm = document.querySelector('.reservation-form-el');
    if (reservationForm) {
        reservationForm.noValidate = true;

        const todayISO = toISODate(new Date());
        reservationForm.querySelector('#reservation-date').min = todayISO;

        const fields = [...reservationForm.querySelectorAll('[name]')]
            .filter((field) => RESERVATION_RULES[field.name]);

        const validateField = (field) => {
            const message = RESERVATION_RULES[field.name](field.value.trim(), field, todayISO);
            document.getElementById(`${field.id}-error`).innerHTML = message;
            if (message) field.setAttribute('aria-invalid', 'true');
            else field.removeAttribute('aria-invalid');
            return !message;
        };

        fields.forEach((field) => {
            // Check on leaving a field; once flagged, re-check as the user fixes it
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.hasAttribute('aria-invalid')) validateField(field);
            });
            // Selects and the date picker give instant feedback (e.g. Mondays, 7+ guests)
            if (field.tagName === 'SELECT' || field.type === 'date') {
                field.addEventListener('change', () => validateField(field));
            }
        });

        reservationForm.addEventListener('submit', (event) => {
            const invalid = fields.filter((field) => !validateField(field));
            if (invalid.length > 0) {
                event.preventDefault();
                invalid[0].focus();
            }
        });
    }

    // 6. Menu: render dishes from MENU and filter by category tab
    const menuGrid = document.querySelector('.FOOD_ITEMS');
    const categoryButtons = document.querySelectorAll('.btn-types');

    const renderMenu = (category) => {
        menuGrid.innerHTML = MENU
            .filter((dish) => dish.category === category)
            .map(dishCard)
            .join('');
    };

    if (menuGrid && categoryButtons.length > 0) {
        categoryButtons.forEach((button) => {
            button.addEventListener('click', () => {
                categoryButtons.forEach((btn) => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
                renderMenu(button.dataset.category);
            });
        });

        // Show the first category by default
        categoryButtons[0].click();
    }
});

// Reservation form rules, keyed by field name. Each returns an error message, or '' if valid.
const PHONE_PATTERN = /^(\+91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}$/;

const RESERVATION_RULES = {
    name: (value) =>
        value.length < 2 ? 'Please enter your full name.' : '',

    email: (value, field) => {
        if (!value) return 'Please enter your email address.';
        if (field.validity.typeMismatch) return 'Please enter a valid email address, like name@example.com.';
        return '';
    },

    phone: (value) => {
        if (!value) return 'Please enter a phone number so we can confirm your table.';
        if (!PHONE_PATTERN.test(value)) return 'Please enter a 10-digit Indian mobile number, e.g. +91 9XXXX XXXXX.';
        return '';
    },

    'reservation-date': (value, field, todayISO) => {
        if (!value) return 'Please choose a date.';
        if (value < todayISO) return 'Please choose today or a later date.';
        const [year, month, day] = value.split('-').map(Number);
        if (new Date(year, month - 1, day).getDay() === 1) {
            return 'We’re closed on Mondays. Please choose a day from Tuesday to Sunday.';
        }
        return '';
    },

    'reservation-time': (value) =>
        value ? '' : 'Please choose a lunch or dinner time.',

    'reservation-guests': (value) => {
        if (!value) return 'Please choose the number of guests.';
        if (value === '7+') {
            return 'For 7 or more guests, please call us on <a href="tel:+915650000000">+91 565 000 0000</a> and we’ll arrange your table.';
        }
        return '';
    }
};

// YYYY-MM-DD in the visitor's local time zone (toISOString would use UTC)
function toISODate(date) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Menu data. To add a dish, add an object here. `image` is optional:
// leave it out and the dish renders as a text-only card.
// `webp` and `jpg` must both exist (run `npm run images` after adding a photo).
const MENU = [
    // Starters
    { category: 'starters', name: 'Smoked Paneer Tikka', price: 495, description: 'Charcoal-smoked paneer, hung-curd marinade, mint chutney.' },
    { category: 'starters', name: 'Dahi Kebab', price: 445, description: 'Crisp yogurt kebabs, beetroot relish.' },
    { category: 'starters', name: 'Truffle Aloo Tikki Chaat', price: 425, description: 'Potato patty, tamarind, sweet yogurt, truffle oil.' },

    // Mains
    { category: 'mains', name: '48-Hour Dal Makhani', price: 545, description: 'Black lentils slow-cooked overnight, white butter.' },
    { category: 'mains', name: 'Paneer Lababdar', price: 595, description: 'Tomato-cashew gravy, fenugreek.' },
    { category: 'mains', name: 'Kathal Dum Biryani', price: 625, description: 'Jackfruit, aged basmati, sealed and slow-cooked.' },

    // Desserts
    {
        category: 'desserts', name: 'Thandai Kulfi', price: 345, description: 'Saffron, fennel, rose, pistachio.',
        image: { webp: 'images/thandai-kulfi.webp', jpg: 'images/thandai-kulfi.jpg', width: 720, height: 720, alt: 'Three sticks of thandai kulfi on a dark plate, scattered with pistachio and almond' }
    },
    { category: 'desserts', name: 'Mathura Peda Cheesecake', price: 395, description: 'Our tribute to the city’s famous sweet.' },
    { category: 'desserts', name: 'Chocolate Bavarois', price: 425, description: 'Dark chocolate mousse, berry compote.' },

    // Beverages
    {
        category: 'beverages', name: 'Alphonso Mango Shake', price: 245, description: 'Alphonso mango and chilled milk, finished with cream and pistachio.',
        image: { webp: 'images/mango-shake.webp', jpg: 'images/mango-shake.jpg', width: 736, height: 736, alt: 'Two tall glasses of mango shake topped with cream, pistachio and a cherry' }
    },
    { category: 'beverages', name: 'Kesar Thandai', price: 225, description: 'Chilled milk with saffron, almond, fennel and rose.' }
];

const formatPrice = (amount) => `₹${amount.toLocaleString('en-IN')}`;

function dishCard(dish) {
    const picture = dish.image
        ? `<picture>
                <source srcset="${dish.image.webp}" type="image/webp" />
                <img src="${dish.image.jpg}" alt="${dish.image.alt}" width="${dish.image.width}" height="${dish.image.height}" loading="lazy" />
            </picture>`
        : '';

    return `
        <article class="menu-card${dish.image ? '' : ' menu-card--text'}">
            ${picture}
            <div>
                <h3 class="food_name">${dish.name}</h3>
                <span class="Food_price">${formatPrice(dish.price)}</span>
            </div>
            <span class="about_food">${dish.description}</span>
        </article>`;
}
