// Perlin Noise
const noise = (() => {
    const permutation = new Array(256).fill(0).map(() => Math.floor(Math.random() * 256));
    const p = new Array(512).fill(0).map((_, i) => permutation[i % 256]);
    
    function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function lerp(t, a, b) { return a + t * (b - a); }
    function grad(hash, x, y, z) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }
    
    return function(x, y, z) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const Z = Math.floor(z) & 255;
        
        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);
        
        const u = fade(x);
        const v = fade(y);
        const w = fade(z);
        
        const A = p[X] + Y;
        const AA = p[A] + Z;
        const AB = p[A + 1] + Z;
        const B = p[X + 1] + Y;
        const BA = p[B] + Z;
        const BB = p[B + 1] + Z;
        
        return lerp(w,
            lerp(v,
                lerp(u, grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z)),
                lerp(u, grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z))),
            lerp(v,
                lerp(u, grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1)),
                lerp(u, grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1))));
    };
})();

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

let rotateX = 24;
let rotateY = -18;
let rotateZ = -44;
let isDragging = false;
let lastX = 0;
let lastY = 0;

const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Lorenz parameters
const sigma = 11;
const rho = 38;
const beta = 8/3;
const dt = 0.0155;

const points = [];
const maxPoints = 3000;  
let x = 20, y = 4, z = 3;

function interpolateColor(color1, color2, factor) {
    const r1 = parseInt(color1.substring(1,3), 16);
    const g1 = parseInt(color1.substring(3,5), 16);
    const b1 = parseInt(color1.substring(5,7), 16);
    
    const r2 = parseInt(color2.substring(1,3), 16);
    const g2 = parseInt(color2.substring(3,5), 16);
    const b2 = parseInt(color2.substring(5,7), 16);
    
    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);
    
    return `rgb(${r},${g},${b})`;
}

const leftWingColors = {
    primary: '#EB5A3C',
    secondary: '#D9EAFD'
};

const rightWingColors = {
    primary: '#243642',
    secondary: '#E2F1E7'
};

function drawStar(ctx, x, y, size) {
    const min = 5; // Minimum number of spikes
    const max = 9; // Maximum number of spikes
    const spikes = Math.floor(Math.random() * (max - min + 1)) + min; // Fluctuates between 5 and 14
    const outerRadius = size;
    const innerRadius = size / 2;

    ctx.beginPath();
    for(let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes;
        if(i === 0) {
            ctx.moveTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
        } else {
            ctx.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
        }
    }
    ctx.closePath();
}

function getColorForPoint(x, z) {
    if (x < 0) {
        const factor = (z / 50 + 1) / 2;
        return interpolateColor(leftWingColors.primary, leftWingColors.secondary, factor);
    } else {
        const factor = (z / 50 + 1) / 2;
        return interpolateColor(rightWingColors.primary, rightWingColors.secondary, factor);
    }
}

function rotatePoint(point) {
    let { x, y, z } = point;
    
    const radX = rotateX * Math.PI / 180;
    const radY = rotateY * Math.PI / 180;
    const radZ = rotateZ * Math.PI / 180;
    
    let y1 = y * Math.cos(radX) - z * Math.sin(radX);
    let z1 = y * Math.sin(radX) + z * Math.cos(radX);
    y = y1;
    z = z1;
    
    let x1 = x * Math.cos(radY) + z * Math.sin(radY);
    let z2 = -x * Math.sin(radY) + z * Math.cos(radY);
    x = x1;
    z = z2;
    
    let x2 = x * Math.cos(radZ) - y * Math.sin(radZ);
    let y2 = x * Math.sin(radZ) + y * Math.cos(radZ);
    x = x2;
    y = y2;
    
    return { x, y, z };
}

function updateLorenz() {
    const dx = sigma * (y - x) * dt;
    const dy = (x * (rho - z) - y) * dt;
    const dz = (x * y - beta * z) * dt;
    
    x += dx;
    y += dy;
    z += dz;
    
    const scale = 6.5;
    const scaledX = x * scale;
    const scaledY = y * scale;
    const scaledZ = z * scale;
    
    points.push({
        x: scaledX,
        y: scaledY,
        z: scaledZ,
        color: getColorForPoint(scaledX, scaledZ)
    });
    
    if (points.length > maxPoints) points.shift();
}

function draw() {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2 + 100;  // Shifted slightly right
    const centerY = canvas.height / 2;
    const time = Date.now() * 0.0013;
    
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    
    for (let i = 0; i < points.length; i++) {
        const point = rotatePoint({...points[i]});
        
        // Add glitch effect using Perlin noise
        const glitchX = noise(point.x * 0.1, point.y * 0.1, time) * 0.65;
        const glitchY = noise(point.y * 0.1, point.z * 0.1, time) * 0.85;
        
        const scale = 800 / (800 - point.z);
        const screenX = centerX + (point.x + glitchX) * scale;
        const screenY = centerY + (point.y + glitchY) * scale;
        
        ctx.fillStyle = points[i].color;
        ctx.globalAlpha = (i / points.length) * 0.8 + 0.2;
        
        drawStar(ctx, screenX, screenY, 1.6 * scale); 
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}


function animate() {
    updateLorenz();
    draw();
    requestAnimationFrame(animate);
}


function handleResize() {
    if (window.innerWidth < 760) {
        container.innerHTML = '';
    }
}

window.addEventListener('resize', handleResize);

if (window.innerWidth > 760) {
    animate();
}