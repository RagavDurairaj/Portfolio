/* =========================================================
   UTIL
   ========================================================= */
const $  = (s, ctx=document) => ctx.querySelector(s);
const $$ = (s, ctx=document) => Array.from(ctx.querySelectorAll(s));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.getElementById('year').textContent = new Date().getFullYear();

/* =========================================================
   AMBIENT NETWORK BACKGROUND (canvas)
   ========================================================= */
(function bgCanvas(){
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, nodes = [];
  const NODE_COUNT = window.innerWidth < 760 ? 26 : 55;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  function makeNodes(){
    nodes = Array.from({length: NODE_COUNT}, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.4 + 0.6,
      ai: Math.random() > 0.72
    }));
  }
  function step(){
    ctx.clearRect(0, 0, w, h);
    for(const n of nodes){
      n.x += n.vx; n.y += n.vy;
      if(n.x < 0 || n.x > w) n.vx *= -1;
      if(n.y < 0 || n.y > h) n.vy *= -1;
    }
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a = nodes[i], b = nodes[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < 140){
          ctx.strokeStyle = `rgba(142,123,255,${(1 - dist/140) * 0.10})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }
    for(const n of nodes){
      ctx.beginPath();
      ctx.fillStyle = n.ai ? 'rgba(142,123,255,0.55)' : 'rgba(0,229,160,0.4)';
      ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
      ctx.fill();
    }
    if(!reduceMotion) requestAnimationFrame(step);
  }
  resize(); makeNodes();
  window.addEventListener('resize', () => { resize(); makeNodes(); });
  step();
})();

/* =========================================================
   NAV: scroll state, active link, burger
   ========================================================= */
const navEl = document.getElementById('nav');
const navLinks = document.getElementById('navLinks');
const navBurger = document.getElementById('navBurger');
const scrollBar = document.getElementById('scrollBar');

navBurger.addEventListener('click', () => navLinks.classList.toggle('is-open'));
$$('.nav__links a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('is-open')));

const sections = $$('main .section, .hero');
const navAnchors = $$('.nav__links a[data-nav]');

function onScroll(){
  navEl.classList.toggle('is-scrolled', window.scrollY > 40);

  const doc = document.documentElement;
  const scrollTop = window.scrollY;
  const height = doc.scrollHeight - doc.clientHeight;
  scrollBar.style.width = height > 0 ? `${(scrollTop/height)*100}%` : '0%';

  let current = null;
  for(const sec of sections){
    const rect = sec.getBoundingClientRect();
    if(rect.top <= 120 && rect.bottom > 120) current = sec.id;
  }
  navAnchors.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === `#${current}`));
}
window.addEventListener('scroll', onScroll, { passive:true });
onScroll();

/* =========================================================
   SCROLL REVEAL
   ========================================================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

$$('.reveal').forEach(el => revealObserver.observe(el));

/* =========================================================
   HERO: title line reveal
   ========================================================= */
window.addEventListener('DOMContentLoaded', () => {
  $$('.hero__line').forEach((line, i) => {
    line.style.transform = 'translateY(100%)';
    line.style.transition = `opacity 0.7s ease ${0.15 + i*0.12}s, transform 0.7s cubic-bezier(.16,1,.3,1) ${0.15 + i*0.12}s`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        line.style.opacity = 1;
        line.style.transform = 'translateY(0)';
      });
    });
  });
});

/* =========================================================
   HERO: role typing effect
   ========================================================= */
(function typeRole(){
  const el = document.getElementById('roleTyped');
  const roles = [
    'Site Reliability Engineer',
    'Generative AI Innovation Lead',
    'Incident Commander',
    'RAG & Agentic AI Architect',
    'Technical Lead — Hospitality CRS'
  ];
  let ri = 0, ci = 0, deleting = false;

  function tick(){
    const word = roles[ri];
    if(!deleting){
      ci++;
      el.textContent = word.slice(0, ci);
      if(ci === word.length){ deleting = true; setTimeout(tick, 1500); return; }
    } else {
      ci--;
      el.textContent = word.slice(0, ci);
      if(ci === 0){ deleting = false; ri = (ri+1) % roles.length; }
    }
    setTimeout(tick, deleting ? 30 : 55);
  }
  tick();
})();

/* =========================================================
   HERO: boot log sequence
   ========================================================= */
(function bootLog(){
  const el = document.getElementById('bootLog');
  const lines = [
    { text: '$ whoami', cls: '' },
    { text: 'ragavan.durairaj — SRE / GenAI Lead', cls: 'line-dim' },
    { text: '$ systemctl status reservation-platform', cls: '' },
    { text: '● active (running) — 99.9% uptime', cls: 'line-ok' },
    { text: '$ load ./genai-innovation-lead --parallel', cls: '' },
    { text: 'RAG · MCP · Agentic AI ... initialized', cls: 'line-ai' },
    { text: '$ status', cls: '' },
    { text: 'OPERATIONAL — accepting new challenges', cls: 'line-ok' },
  ];
  function run(){
    let i = 0;
    function step(){
      if(i >= lines.length){ startMetrics(); startGraph(); return; }
      const { text, cls } = lines[i];
      const span = document.createElement('span');
      if(cls) span.className = cls;
      el.appendChild(span);
      let c = 0;
      const typer = setInterval(() => {
        c++;
        span.textContent = text.slice(0, c);
        if(c >= text.length){
          clearInterval(typer);
          el.appendChild(document.createTextNode('\n'));
          i++;
          setTimeout(step, 200);
        }
      }, 13);
    }
    step();
  }
  run();

  function startMetrics(){
    $$('.metric__value').forEach(m => {
      const target = parseFloat(m.dataset.target);
      const suffix = m.dataset.suffix || '';
      const isFloat = target % 1 !== 0;
      let cur = 0;
      const duration = 1400;
      const start = performance.now();
      function frame(now){
        const p = Math.min((now-start)/duration, 1);
        const eased = 1 - Math.pow(1-p, 3);
        cur = target * eased;
        m.textContent = (isFloat ? cur.toFixed(1) : Math.round(cur)) + suffix;
        if(p < 1) requestAnimationFrame(frame);
        else m.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
      }
      requestAnimationFrame(frame);
    });
  }

  function startGraph(){
    const points = 24;
    const w = 400, h = 90;
    const vals = Array.from({length: points}, (_, i) => {
      const base = 55 + Math.sin(i*0.6) * 10;
      const spike = (i === points-6) ? 22 : 0;
      return Math.max(10, Math.min(85, base + spike + Math.random()*8));
    });
    vals[vals.length-1] = 78;

    const line = document.getElementById('uptimeLine');
    const area = document.getElementById('uptimeArea');
    const step = w / (points-1);

    let drawn = 0;
    function draw(){
      drawn++;
      const slice = vals.slice(0, drawn);
      const linePts = slice.map((v,i) => `${i*step},${h - v}`).join(' ');
      const areaPts = `0,${h} ` + linePts + ` ${(drawn-1)*step},${h}`;
      line.setAttribute('points', linePts);
      area.setAttribute('points', areaPts);
      if(drawn < points) requestAnimationFrame(() => setTimeout(draw, 24));
    }
    draw();
  }
})();

/* =========================================================
   CONTACT: ping typing line
   ========================================================= */
(function contactPing(){
  const el = document.getElementById('contactPing');
  if(!el) return;
  const text = '64 bytes from ragavan: icmp_seq=1 ttl=64 time=0.4ms — connection open';
  let obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        let i = 0;
        const t = setInterval(() => {
          i++;
          el.textContent = text.slice(0, i);
          if(i >= text.length) clearInterval(t);
        }, 16);
        obs.disconnect();
      }
    });
  }, { threshold: 0.4 });
  obs.observe(el);
})();

/* =========================================================
   POC FILTER
   ========================================================= */
(function pocFilter(){
  const chips = $$('.filter-chip');
  const cards = $$('.poc-card');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const f = chip.dataset.filter;
      cards.forEach(card => {
        const tags = card.dataset.tags;
        card.classList.toggle('is-hidden', f !== 'all' && !tags.includes(f));
      });
    });
  });

  // subtle spotlight follow on hover
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
})();

/* =========================================================
   CERT VALIDITY BARS (animate on view)
   ========================================================= */
(function certBars(){
  const currentYear = new Date().getFullYear() + (new Date().getMonth()+1)/12;
  const certs = $$('.cert');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const el = entry.target;
      const fill = el.querySelector('[data-fill]');
      const staticVal = fill.dataset.static;
      let pct;
      if(staticVal){
        pct = parseFloat(staticVal);
      } else {
        const start = parseFloat(el.dataset.start);
        const end = parseFloat(el.dataset.end);
        pct = Math.max(4, Math.min(100, ((currentYear - start) / (end - start)) * 100));
      }
      requestAnimationFrame(() => { fill.style.width = pct + '%'; });
      obs.unobserve(el);
    });
  }, { threshold: 0.3 });
  certs.forEach(c => obs.observe(c));
})();
