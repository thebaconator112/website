function updateNavUnderline() {
    const bar = document.getElementById('nav-underline');
    const active = document.querySelector('#main-nav a.active');
    if (active) {
        bar.style.left = active.offsetLeft + 'px';
        bar.style.width = active.offsetWidth + 'px';
        bar.style.opacity = '1';
    } else {
        bar.style.opacity = '0';
    }
}
window.addEventListener('resize', updateNavUnderline);

function setActiveFromScroll() {
    const pricing = document.getElementById('pricing');
    const links = document.querySelectorAll('#main-nav a[data-nav]');
    if (!pricing) return;
    const y = window.scrollY + 120;
    const inPricing = y >= pricing.offsetTop;
    links.forEach(a => {
        const name = a.dataset.nav;
        a.classList.toggle('active', inPricing ? name === 'pricing' : name === 'home');
    });
    updateNavUnderline();
}

window.addEventListener('scroll', setActiveFromScroll, { passive: true });
document.addEventListener('DOMContentLoaded', () => {
    updateNavUnderline();
    setActiveFromScroll();
});
