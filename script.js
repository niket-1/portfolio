// Particle network background
const cv = document.getElementById('bg'), cx = cv.getContext('2d');
let W, H, pts = [], mouse = { x: -999, y: -999 };
function size() {
  W = cv.width = innerWidth; H = cv.height = innerHeight;
  pts = Array.from({ length: Math.min(90, Math.floor(W * H / 16000)) }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5
  }));
}
size(); addEventListener('resize', size);
(function draw() {
  cx.clearRect(0, 0, W, H);
  for (const p of pts) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    cx.fillStyle = 'rgba(139,92,246,.8)';
    cx.beginPath(); cx.arc(p.x, p.y, 1.6, 0, 7); cx.fill();
  }
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d < 140) {
        cx.strokeStyle = `rgba(6,182,212,${(1 - d / 140) * .25})`;
        cx.beginPath(); cx.moveTo(pts[i].x, pts[i].y); cx.lineTo(pts[j].x, pts[j].y); cx.stroke();
      }
    }
    const m = Math.hypot(pts[i].x - mouse.x, pts[i].y - mouse.y);
    if (m < 180) {
      cx.strokeStyle = `rgba(244,114,182,${(1 - m / 180) * .5})`;
      cx.beginPath(); cx.moveTo(pts[i].x, pts[i].y); cx.lineTo(mouse.x, mouse.y); cx.stroke();
    }
  }
  requestAnimationFrame(draw);
})();

// Cursor glow
const glow = document.getElementById('glow');
addEventListener('mousemove', e => {
  mouse.x = e.clientX; mouse.y = e.clientY;
  glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px';
});

// Typing effect
const roles = ['Senior Cloud Engineer', 'Azure & AWS Solutions Architect', 'DevOps & IaC Specialist', 'Kubernetes Enthusiast'];
const typed = document.getElementById('typed');
let ri = 0, ci = 0, del = false;
(function type() {
  const w = roles[ri];
  if (!del) { ci++; typed.textContent = w.slice(0, ci); if (ci === w.length) { del = true; return setTimeout(type, 1400); } }
  else { ci--; typed.textContent = w.slice(0, ci); if (ci === 0) { del = false; ri = (ri + 1) % roles.length; } }
  setTimeout(type, del ? 35 : 70);
})();

// Terminal animation
const lines = [
  '<span class="c"># deploy zero-downtime release</span>',
  '<span class="b">$</span> terraform apply <span class="k">-auto-approve</span>',
  '<span class="s">✔ Apply complete! 42 added, 0 destroyed</span>',
  '<span class="b">$</span> kubectl rollout status deploy/app',
  '<span class="s">✔ blue → green switched, 0 dropped requests</span>',
  '<span class="b">$</span> az monitor metrics list --uptime',
  '<span class="s">✔ availability: 99.99%</span>',
  '<span class="b">$</span> echo "Ready to build with you"<span class="caret">▍</span>'
];
const term = document.getElementById('term');
let li = 0;
(function printLine() {
  if (li >= lines.length) return;
  term.innerHTML += lines[li++] + '\n';
  setTimeout(printLine, 750);
})();

// Scroll: progress, navbar, reveal
const nav = document.getElementById('nav'), prog = document.getElementById('progress');
addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 30);
  prog.style.width = scrollY / (document.documentElement.scrollHeight - innerHeight) * 100 + '%';
});
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 90 + 'ms';
  io.observe(el);
});

// Counters
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, to = +el.dataset.count, dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || '';
  const t0 = performance.now();
  (function step(t) {
    const k = Math.min((t - t0) / 1600, 1), v = to * (1 - Math.pow(1 - k, 3));
    el.textContent = v.toFixed(dec) + suf;
    if (k < 1) requestAnimationFrame(step);
  })(t0);
  cio.unobserve(el);
}), { threshold: .6 });
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

// 3D tilt cards
document.querySelectorAll('.tilt').forEach(c => {
  c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    c.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  });
  c.addEventListener('mouseleave', () => c.style.transform = '');
});

// Mobile menu
const menu = document.getElementById('menu');
document.getElementById('burger').onclick = () => menu.classList.toggle('open');
menu.querySelectorAll('a').forEach(a => a.onclick = () => menu.classList.remove('open'));
document.getElementById('year').textContent = new Date().getFullYear();

// Contact details are assembled on click so they aren't exposed in the page source
const go = (id, make) => document.getElementById(id).addEventListener('click', e => { e.preventDefault(); location.href = make(); });
go('mailBtn', () => 'mailto:' + atob('bmlrZXRzb25hd2FuZTQ5QGdtYWlsLmNvbQ=='));
go('callBtn', () => 'tel:' + atob('KzkxOTk2MDQ0ODczOQ=='));
