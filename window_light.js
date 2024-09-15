if (window.innerWidth > 1000) {

  const canvas = document.getElementById('lightCanvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function drawLight(scrollProgress) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create a more complex gradient for photorealistic effect
      const gradient = ctx.createRadialGradient(
          -canvas.width * 0.2, canvas.height * 0.2, 0,
          -canvas.width * 0.2, canvas.height * 0.2, canvas.width
      );

      if (!document.body.classList.contains('dark-mode')) {
        gradient.addColorStop(0, 'rgba(255, 253, 240, 0.8)');
        gradient.addColorStop(0.2, 'rgba(255, 253, 220, 0.6)');
        gradient.addColorStop(0.7, 'rgba(255, 253, 200, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 253, 200, 0)');
      }

      ctx.fillStyle = gradient;

      // Create a shifting shape for the light beam
      ctx.beginPath();
      ctx.moveTo(-canvas.width * 0.2, 0);
      
      // Use bezier curves to create a more organic shape
      const cp1x = canvas.width * (0.3 + scrollProgress * 0.1);
      const cp1y = canvas.height * (0.2 + scrollProgress * 0.9);
      const cp2x = canvas.width * (0.5 - scrollProgress * 0.1);
      const cp2y = canvas.height * (0.7 - scrollProgress * 0.2);
      const endX = canvas.width * (0.6 + scrollProgress * 0.3);
      const endY = canvas.height;

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
      ctx.lineTo(canvas.width * 0.2, canvas.height);
      ctx.lineTo(canvas.width * 0.1, 0);
      ctx.closePath();
      ctx.fill();

      // Add a subtle glow effect

      if (document.body.classList.contains('dark-mode')) {
        ctx.fillStyle = 'rgba(3, 205, 255, 1)';
        ctx.filter = 'blur(80px)';
      } else {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.35)';
        ctx.filter = 'blur(20px)';
      }

      ctx.fill();
      ctx.filter = 'none';
  }

  function animate() {
      const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      drawLight(scrollProgress);
      requestAnimationFrame(animate);
  }

  animate();
}