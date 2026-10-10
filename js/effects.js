(function () {
    const glow = document.getElementById('cursor-glow');
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2;
    let tx = gx, ty = gy;
    window.addEventListener('mousemove', e => {
        document.body.classList.add('has-pointer'); tx = e.clientX; ty = e.clientY;
    }, {passive:true});
    window.addEventListener('mouseleave', () => document.body.classList.remove('has-pointer'));
    function tick(){
        gx += (tx-gx)*0.12; gy += (ty-gy)*0.12;
        if(glow) glow.style.transform=`translate(${gx}px,${gy}px) translate(-50%,-50%)`;
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    let scrollTimer;
    window.addEventListener('scroll',()=>{
        document.body.classList.add('scrolling'); clearTimeout(scrollTimer);
        scrollTimer=setTimeout(()=>document.body.classList.remove('scrolling'),90);
    },{passive:true});
    const reveals=document.querySelectorAll('.reveal');
    if('IntersectionObserver' in window){
      const io=new IntersectionObserver(entries=>entries.forEach(en=>{if(en.isIntersecting)en.target.classList.add('in')}),{threshold:.12});
      reveals.forEach(el=>io.observe(el));
    } else reveals.forEach(el=>el.classList.add('in'));
    const vid=document.getElementById('demo-video');
    if(vid && 'IntersectionObserver' in window){
      const vio=new IntersectionObserver(entries=>entries.forEach(en=>{
        if(en.isIntersecting){vid.muted=true;vid.play().catch(()=>{});} else vid.pause();
      }),{threshold:.35});
      vio.observe(vid);
    }
})();
