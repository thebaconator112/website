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

function show(name) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('visible'));
    document.getElementById('view-' + name).classList.add('visible');
    document.querySelectorAll('#main-nav a').forEach(a => {
        a.classList.toggle('active', a.dataset.nav === name);
    });
    updateNavUnderline();
    window.scrollTo(0, 0);
}

document.addEventListener('DOMContentLoaded', () => {
    show('home');
});
