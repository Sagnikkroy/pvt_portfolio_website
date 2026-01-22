const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

// --- Theme Aware Variables ---
// These will be updated by your Theme Switcher button
window.butterflyTheme = {
    main: '#B4B4B4',      // Character color (white in dark mode, black in light)
    lines: '255, 255, 255', // Line color RGB (white in dark mode, grey in light)
    opacity: 0.3          // Line opacity
};

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

const charPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
const numParticles = 500; 
const particles = [];

function butterflyEquation(t) {
    return Math.exp(Math.sin(t)) - 2 * Math.cos(4 * t) + Math.pow(Math.sin((4 * t - Math.PI) / 24), 5);
}

function calculateButterflyPoints() {
    const points = [];
    const scale = 45;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2 - 180;

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

function getRandomChar() {
    return charPool[Math.floor(Math.random() * charPool.length)];
}

// Updated: Uses the dynamic main color instead of hardcoded white
function getRandomColor() {
    const rand = Math.random();
    // Colorful ones: Made slightly darker/richer for Light Mode compatibility
    if (rand > 0.9) return '#ff4da6'; // Vivid Pink
    else if (rand > 0.8) return '#3399ff'; // Vivid Blue
    else if (rand > 0.7) return '#00cc99'; // Vivid Teal
    else return window.butterflyTheme.main; // DYNAMIC: Black or White
}

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

let lineOffset = 0;
const lineSpeed = 0.0003;
const numLines = 6;
const lineThickness = 1.0;

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
        const rgb = window.butterflyTheme.lines;
        const op = window.butterflyTheme.opacity;
        
        grad.addColorStop(0, `rgba(${rgb},0)`);
        grad.addColorStop(0.5, `rgba(${rgb},${0.7 * op})`);
        grad.addColorStop(1, `rgba(${rgb},0)`);

        ctx.strokeStyle = grad;
        ctx.stroke();
    }
    lineOffset += lineSpeed;
    if (lineOffset > 1) lineOffset -= 1;
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFlowingLines();

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