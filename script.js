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

    // 3. Menu category button micro-interaction
    const categoryButtons = document.querySelectorAll('.btn-types');
    if (categoryButtons.length > 0) {
        // Set first category button active by default if none active
        categoryButtons[0].classList.add('active');

        categoryButtons.forEach((button) => {
            button.addEventListener('click', () => {
                categoryButtons.forEach((btn) => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }
});
