(function () {
    const glow = document.getElementById('cursor-glow');
    let gx = window.innerWidth / 2;
    let gy = window.innerHeight / 2;
    let tx = gx;
    let ty = gy;

    function onMove(e) {
        document.body.classList.add('has-pointer');
        tx = e.clientX;
        ty = e.clientY;
    }
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', () => document.body.classList.remove('has-pointer'));

    function tickGlow() {
        gx += (tx - gx) * 0.12;
        gy += (ty - gy) * 0.12;
        if (glow) {
            glow.style.transform = 'translate(' + gx + 'px,' + gy + 'px) translate(-50%,-50%)';
        }
        requestAnimationFrame(tickGlow);
    }
    requestAnimationFrame(tickGlow);

    const canvas = document.getElementById('snow');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let flakes = [];
    let snowOn = false;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function makeFlakes() {
        const n = Math.min(48, Math.floor(window.innerWidth / 28));
        flakes = [];
        for (let i = 0; i < n; i++) {
            flakes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.6 + 0.6,
                s: Math.random() * 0.6 + 0.25,
                a: Math.random() * 0.35 + 0.15,
                o: Math.random() * Math.PI * 2
            });
        }
    }
    makeFlakes();

    function drawSnow() {
        if (!snowOn) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            requestAnimationFrame(drawSnow);
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const f of flakes) {
            f.y += f.s;
            f.x += Math.sin(f.o) * 0.35;
            f.o += 0.01;
            if (f.y > canvas.height) {
                f.y = -4;
                f.x = Math.random() * canvas.width;
            }
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,200,230,' + f.a + ')';
            ctx.fill();
        }
        requestAnimationFrame(drawSnow);
    }
    requestAnimationFrame(drawSnow);

    function updateSnowState() {
        const deep = window.scrollY > window.innerHeight * 0.55;
        if (deep !== snowOn) {
            snowOn = deep;
            canvas.classList.toggle('active', snowOn);
        }
    }

    let scrollTimer = null;
    window.addEventListener('scroll', () => {
        document.body.classList.add('scrolling');
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => document.body.classList.remove('scrolling'), 90);
        updateSnowState();
    }, { passive: true });
    updateSnowState();

    const reveals = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if (en.isIntersecting) en.target.classList.add('in');
        });
    }, { threshold: 0.12 });
    reveals.forEach(el => io.observe(el));

    const vid = document.getElementById('demo-video');
    if (vid) {
        const vio = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (en.isIntersecting) {
                    vid.muted = true;
                    vid.play().catch(() => {});
                } else {
                    vid.pause();
                }
            });
        }, { threshold: 0.35 });
        vio.observe(vid);
    }
})();

(function purchaseToasts() {
    const tiers = [
        { name: 'lifetime', weight: 2 },
        { name: '1 month', weight: 4 },
        { name: '7 days', weight: 3 }
    ];
    const places = [
        ['United States', 'Texas'],
        ['United States', 'California'],
        ['United States', 'Florida'],
        ['United States', 'New York'],
        ['United States', 'Ohio'],
        ['United States', 'Georgia'],
        ['United States', 'Illinois'],
        ['United States', 'Arizona'],
        ['United States', 'Pennsylvania'],
        ['United States', 'Michigan'],
        ['United States', 'North Carolina'],
        ['United States', 'Washington'],
        ['United States', 'Colorado'],
        ['United States', 'Virginia'],
        ['Canada', 'Ontario'],
        ['Canada', 'British Columbia'],
        ['United Kingdom', 'England'],
        ['Australia', 'New South Wales']
    ];
    const names = [
        'alex', 'jordan', 'sam', 'casey', 'riley', 'morgan', 'avery', 'quinn',
        'drew', 'jamie', 'taylor', 'blake', 'cameron', 'rowan', 'skyler', 'peyton'
    ];

    function pickTier() {
        const total = tiers.reduce((s, t) => s + t.weight, 0);
        let r = Math.random() * total;
        for (const t of tiers) {
            r -= t.weight;
            if (r <= 0) return t.name;
        }
        return tiers[0].name;
    }

    function showToast() {
        const host = document.getElementById('purchase-toasts');
        if (!host) return;
        const tier = pickTier();
        const [country, region] = places[Math.floor(Math.random() * places.length)];
        const who = names[Math.floor(Math.random() * names.length)];
        const el = document.createElement('div');
        el.className = 'purchase-toast';
        el.innerHTML =
            '<span class="dot"></span><strong>' + who + '</strong> purchased ' +
            '<span class="tier">' + tier + '</span>' +
            '<div class="loc">' + country + ', ' + region + '</div>';
        host.appendChild(el);
        requestAnimationFrame(() => el.classList.add('show'));
        setTimeout(() => {
            el.classList.remove('show');
            setTimeout(() => el.remove(), 400);
        }, 4800);
    }

    function tick() {
        if (Math.random() < 0.4) showToast();
        setTimeout(tick, 60000);
    }
    setTimeout(tick, 12000 + Math.random() * 8000);
})();
