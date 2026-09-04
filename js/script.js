const pages = Array.from(document.querySelectorAll('.page'));
const dotsWrap = document.getElementById('dots');
let current = 0;
let animating = false;

pages.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'dot' + (i === 0 ? ' on' : '');
    d.setAttribute('aria-label', 'Go to page ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
});
const dotEls = Array.from(dotsWrap.children);

function goTo(index) {
    if (index === current || index < 0 || index >= pages.length || animating) return;
    animating = true;
    const from = pages[current];
    const to = pages[index];

    from.classList.add('leaving');
    from.classList.remove('active');

    requestAnimationFrame(() => {
        to.classList.add('active');
    });

    setTimeout(() => {
        from.classList.remove('leaving');
        animating = false;
    }, 900);

    dotEls[current].classList.remove('on');
    dotEls[index].classList.add('on');
    current = index;
}

document.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => goTo(current + 1));
});

document.getElementById('prevHit').addEventListener('click', () => goTo(current - 1));
document.getElementById('nextHit').addEventListener('click', () => goTo(current + 1));

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'ArrowLeft') goTo(current - 1);
});

// ---------- wax seal reveal ----------
const sealBtn = document.getElementById('sealBtn');
const caption = document.getElementById('sealCaption');
const revealed = document.getElementById('revealed');
let opened = false;

sealBtn.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    sealBtn.style.transform = 'scale(0.92)';
    setTimeout(() => { sealBtn.style.transform = ''; }, 220);
    caption.textContent = 'sealed with everything I mean';
    revealed.classList.add('show');
    sealBtn.setAttribute('aria-expanded', 'true');
});

// ---------- ambient cursor bubbles ----------
const MAX_BUBBLES = 45;
let bubbleCount = 0;
let lastSpawn = 0;

function spawnBubble(x, y) {
    if (bubbleCount >= MAX_BUBBLES) return;
    bubbleCount++;
    const el = document.createElement('div');
    el.className = 'bubble';
    const size = 6 + Math.random() * 16;
    const drift = (Math.random() - 0.5) * 90;
    const duration = 1.6 + Math.random() * 1.4;
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.setProperty('--drift', drift + 'px');
    el.style.animationDuration = duration + 's';
    document.body.appendChild(el);
    el.addEventListener('animationend', () => {
        el.remove();
        bubbleCount--;
    });
}

function handlePointer(x, y) {
    const now = performance.now();
    if (now - lastSpawn < 45) return;
    lastSpawn = now;
    spawnBubble(x + (Math.random() - 0.5) * 10, y + (Math.random() - 0.5) * 10);
}

window.addEventListener('mousemove', (e) => handlePointer(e.clientX, e.clientY));
window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) handlePointer(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });
