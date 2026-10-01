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
