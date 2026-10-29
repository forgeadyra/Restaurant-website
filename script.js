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

    // 3. Menu: render dishes from MENU and filter by category tab
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

// Menu data. To add a dish, add an object here. `image` is optional:
// leave it out and the dish renders as a text-only card.
// Image paths are written without extension; a .webp and .jpg must both exist.
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
        image: { src: 'images/thandai-kulfi', width: 720, height: 1107, alt: 'Three sticks of thandai kulfi on a dark plate, scattered with pistachio and almond' }
    },
    { category: 'desserts', name: 'Mathura Peda Cheesecake', price: 395, description: "Our tribute to the city's famous sweet." },
    { category: 'desserts', name: 'Chocolate Bavarois', price: 425, description: 'Dark chocolate mousse, berry compote.' },

    // Beverages
    {
        category: 'beverages', name: 'Alphonso Mango Shake', price: 245, description: 'Alphonso mango and chilled milk, finished with cream and pistachio.',
        image: { src: 'images/mango-shake', width: 736, height: 1104, alt: 'Two tall glasses of mango shake topped with cream, pistachio and a cherry' }
    },
    { category: 'beverages', name: 'Kesar Thandai', price: 225, description: 'Chilled milk with saffron, almond, fennel and rose.' }
];

const formatPrice = (amount) => `₹${amount.toLocaleString('en-IN')}`;

function dishCard(dish) {
    const picture = dish.image
        ? `<picture>
                <source srcset="${dish.image.src}.webp" type="image/webp" />
                <img src="${dish.image.src}.jpg" alt="${dish.image.alt}" width="${dish.image.width}" height="${dish.image.height}" loading="lazy" />
            </picture>`
        : '';

    return `
        <article class="menu-card${dish.image ? '' : ' menu-card--text'}">
            ${picture}
            <div>
                <span class="food_name">${dish.name}</span>
                <span class="Food_price">${formatPrice(dish.price)}</span>
            </div>
            <span class="about_food">${dish.description}</span>
        </article>`;
}
