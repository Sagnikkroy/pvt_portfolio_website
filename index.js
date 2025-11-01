const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

// --- Canvas Setup ---
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
    resizeCanvas();
    butterflyPoints = calculateButterflyPoints();
    initParticles();
});

// --- Character Setup ---
const charPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
const numParticles = 500; // denser flow
const particles = [];

// --- Butterfly Curve ---
function butterflyEquation(t) {
    return Math.exp(Math.sin(t)) - 2 * Math.cos(4 * t) + Math.pow(Math.sin((4 * t - Math.PI) / 24), 5);
}

function calculateButterflyPoints() {
    const points = [];
    const scale = 40;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2 -180;

    for (let i = 0; i < 2500; i++) {
        const t = (i / 2500) * 12 * Math.PI;
        const r = butterflyEquation(t);
        const x = cx + r * Math.cos(t) * scale;
        const y = cy + r * Math.sin(t) * scale;
        points.push({ x, y });
    }
    return points;
}

let butterflyPoints = calculateButterflyPoints();

// --- Helpers ---
function getRandomChar() {
    return charPool[Math.floor(Math.random() * charPool.length)];
}

function getRandomColor() {
    const rand = Math.random();
    if (rand > 0.9) return '#ffb3d9';
    else if (rand > 0.8) return '#b3d9ff';
    else if (rand > 0.7) return '#b3ffec';
    else return '#ffffff';
}

// --- Initialize Particles ---
function initParticles() {
    particles.length = 0;
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            char: getRandomChar(),
            progress: Math.random(),
            speed: 0.0001 + Math.random() * 0.00005,
            color: getRandomColor(),
            changeTimer: Math.random() * 100
        });
    }
}
initParticles();

// --- Line Flow Variables ---
let lineOffset = 0;
const lineSpeed = 0.0003;
const numLines = 6;
const lineThickness = 1.0;
let lineOpacity = 0.3; // 👈 adjustable master opacity for lines

// --- Draw Flowing Butterfly Lines ---
function drawFlowingLines() {
    ctx.lineWidth = lineThickness;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const visibleFraction = 0.15;

    for (let i = 0; i < numLines; i++) {
        const phase = (lineOffset + i * 0.33) % 1;
        const startIdx = Math.floor(phase * butterflyPoints.length);
        const visibleCount = Math.floor(butterflyPoints.length * visibleFraction);

        ctx.beginPath();

        for (let j = 0; j < visibleCount; j++) {
            const idx = (startIdx + j) % butterflyPoints.length;
            const p = butterflyPoints[idx];
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const scaleMult = 0.97 + i * 0.03;

            const x = cx + (p.x - cx) * scaleMult;
            const y = cy + (p.y - cy) * scaleMult;

            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }

        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(0.5, `rgba(255,255,255,${0.7 * lineOpacity})`);
        grad.addColorStop(1, `rgba(255,255,255,0)`);

        ctx.strokeStyle = grad;
        ctx.stroke();
    }

    lineOffset += lineSpeed;
    if (lineOffset > 1) lineOffset -= 1;
}

// --- Animation ---
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Flowing outlines
    drawFlowingLines();

    // Animate small flowing characters
    particles.forEach(p => {
        p.progress += p.speed;
        if (p.progress >= 1) p.progress -= 1;

        const idx = Math.floor(p.progress * (butterflyPoints.length - 1));
        const nextIdx = (idx + 1) % butterflyPoints.length;
        const t = (p.progress * (butterflyPoints.length - 1)) - idx;
        const x = butterflyPoints[idx].x + (butterflyPoints[nextIdx].x - butterflyPoints[idx].x) * t;
        const y = butterflyPoints[idx].y + (butterflyPoints[nextIdx].y - butterflyPoints[idx].y) * t;

        p.changeTimer--;
        if (p.changeTimer <= 0) {
            p.char = getRandomChar();
            p.color = getRandomColor();
            p.changeTimer = 30 + Math.random() * 80;
        }

        ctx.fillStyle = p.color;
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.char, x, y);
    });

    requestAnimationFrame(animate);
}

animate();
