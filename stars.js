const canvas = document.getElementById('starField');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// CSS: canvas stays in background
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '-1';  // This ensures it stays behind all other content
canvas.style.pointerEvents = 'none';  // This allows clicks to pass through to elements below

class Star {
    constructor(x, y, size, twinkleSpeed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.baseSize = size;
        this.twinkleSpeed = twinkleSpeed;
        this.angle = Math.random() * Math.PI * 2;
        this.rotationAngle = Math.random() * Math.PI * 2;
    }

    update() {
        this.angle += this.twinkleSpeed;
        this.size = this.baseSize * (0.5 + Math.abs(Math.sin(this.angle)));
        this.rotationAngle += this.twinkleSpeed * 0.5;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotationAngle);

        // Draw angular star shape
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI / 2);
            const innerRadius = this.size * 0.4;
            const outerRadius = this.size;

            if (i === 0) {
                ctx.moveTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
            } else {
                ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
            }

            const midAngle = angle + Math.PI / 4;
            ctx.lineTo(Math.cos(midAngle) * innerRadius, Math.sin(midAngle) * innerRadius);
        }
        ctx.closePath();

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, `rgba(255, 215, 0, ${0.7 * (this.size/this.baseSize)})`);
        gradient.addColorStop(0.5, `rgba(255, 215, 0, ${0.3 * (this.size/this.baseSize)})`);
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.restore();
    }
}

const stars = [];

function createStarCluster(centerX, centerY, numStars, radius) {
    for (let i = 0; i < numStars; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * radius;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
            stars.push(new Star(
                x,
                y,
                Math.random() * 1.5 + 0.8,
                Math.random() * 0.008 + 0.003
            ));
        }
    }
}

function initializeStars() {
    // Create main clusters
    for (let i = 0; i < 4; i++) {
        createStarCluster(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            40,
            200
        );
    }

    // Add scattered individual stars
    for (let i = 0; i < 80; i++) {
        stars.push(new Star(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 1.2 + 0.4,
            Math.random() * 0.006 + 0.002
        ));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    
    requestAnimationFrame(animate);
}

initializeStars();
animate();