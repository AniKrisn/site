(function() {
    function setupNorthernLights() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        
        document.body.appendChild(canvas);

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Perlin noise function
        const p = [];
        for (let i = 0; i < 256; i++) p[i] = p[i + 256] = Math.floor(Math.random() * 256);

        const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
        const lerp = (t, a, b) => a + t * (b - a);
        const grad = (hash, x, y, z) => {
            const h = hash & 15;
            const u = h < 8 ? x : y;
            const v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
            return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
        };

        function noise(x, y, z) {
            const X = Math.floor(x) & 255;
            const Y = Math.floor(y) & 255;
            const Z = Math.floor(z) & 255;
            x -= Math.floor(x);
            y -= Math.floor(y);
            z -= Math.floor(z);
            const u = fade(x);
            const v = fade(y);
            const w = fade(z);
            const A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z;
            const B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;
            return lerp(w, 
                lerp(v, 
                    lerp(u, grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z)),
                    lerp(u, grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z))
                ),
                lerp(v, 
                    lerp(u, grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1)),
                    lerp(u, grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1))
                )
            );
        }

        function drawNorthernLights(time) {
            const timeScale = time * 0.005;
            const moveX = Math.sin(timeScale * 0.5) * canvas.width * 0.2;
            const moveY = Math.cos(timeScale * 0.3) * canvas.height * 0.1;

            // Adjust these parameters to fine-tune the curve
            const baseStartX = canvas.width * 0.1; // base starting offset
            const amplitude = 3000; // how far the curve deviates from the base
            const frequency = 0.02; // controls how wavy the edge is

            // Instead of iterating x first, iterate over y and compute a dynamic x start:
            for (let y = 0; y < canvas.height; y += 100) {
                // Compute a curved offset for x, optionally including timeScale for animation
                const curveOffset = Math.sin(y * frequency + timeScale) * amplitude;
                // Optionally clamp the start value if needed:
                const startX = Math.max(0, baseStartX + curveOffset);
                
                for (let x = startX; x < canvas.width; x += 150) {
                    const noiseX = (x + moveX) * 0.002;
                    const noiseY = (y + moveY) * 0.003;
                    const noiseValue = (noise(noiseX, noiseY, timeScale) + 1) / 2 * 0.95;
                    const noiseValue2 = (noise(noiseX * 2, noiseY * 2, timeScale * 1.5) + 1) / 2 * 0.95;

                    const irregularShape = Math.sin(y * 0.02 + noiseValue2 * 5 + timeScale) * 0.2 + 0.5;
                    const diagonalGradient = ((x + moveX) / canvas.width + (y + moveY) / canvas.height) / 2;
                    
                    if (noiseValue > 0.55 && 
                        diagonalGradient > irregularShape - 0.1 && 
                        diagonalGradient < irregularShape + 0.1) {
                        const depth = (noiseValue2 - 0.5) * 3;
                        const hue = (270 + depth * 110 + time * 0.5) % 360;
                        const lightness = 20 + depth * 120;
                        const alpha = (noiseValue - 0.55) * 5 * 0.90;
                        ctx.fillStyle = `hsla(${hue}, 100%, ${lightness}%, ${alpha})`;
                        ctx.fillRect(x, y, 1, 1);
                    }
                }
            }

            requestAnimationFrame(() => drawNorthernLights(time + 4));
        }

        drawNorthernLights(0);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupNorthernLights);
    } else {
        setupNorthernLights();
    }
})();

// Wait until the DOM is fully loaded to attach the event listener.
document.addEventListener("DOMContentLoaded", function() {
    // Select the link that leads to index.html on me.html.
    var indexLink = document.querySelector('a[href="index.html"]');
    
    if (indexLink) {
      indexLink.addEventListener("click", function(e) {
        e.preventDefault(); // Prevent the immediate navigation.
        var destination = this.href; // Store the target URL ("index.html").
        
        // Add the fading-out class to trigger the reverse fade-out animation.
        document.body.classList.add("fading-out");
  
        // Wait for the animation to finish (500ms) before navigating.
        setTimeout(function() {
            window.location.href = destination;
        }, 350);  // 500ms must match the CSS animation duration.
      });
    }
  });