document.addEventListener('DOMContentLoaded', () => {

    const isInfoPage = window.location.pathname.endsWith("info.html");
    const isPhotoPage = window.location.pathname.endsWith("photo.html");
    const darkModeToggle = document.createElement('button');

    darkModeToggle.id = 'darkModeToggle';
    darkModeToggle.className = 'circle-button';
    darkModeToggle.setAttribute('aria-label', 'Toggle Dark Mode');

    document.body.appendChild(darkModeToggle);

    // Set initial position
    let velocityX = 0, velocityY = 0;

    function setInitialPosition() {

        // reinitialise for info and photo pages
        if (!sessionStorage.getItem('darkModeButtonInitialized') || isInfoPage) {
            const padding = 0.15;
            const right = window.innerWidth * padding;
            const bottom = window.innerHeight * padding;
            
            darkModeToggle.style.right = right + 'px';
            darkModeToggle.style.bottom = bottom + 'px';

            sessionStorage.setItem('darkModeButtonInitialized', 'true');

            // reset all localStorage values upon loading the page
            localStorage.removeItem('darkModeButtonVelocityX');
            localStorage.removeItem('darkModeButtonVelocityY');
            localStorage.removeItem('darkModeButtonRight');
            localStorage.removeItem('darkModeButtonBottom');
            localStorage.setItem('darkModeButtonRight', darkModeToggle.style.right);
            localStorage.setItem('darkModeButtonBottom', darkModeToggle.style.bottom);

            if (isInfoPage) {
                darkModeToggle.style.right = '15%';
                darkModeToggle.style.bottom = '15%';
            }

        } else {
            // Use saved position from localStorage if available
            const savedRight = localStorage.getItem('darkModeButtonRight');
            const savedBottom = localStorage.getItem('darkModeButtonBottom');
            
            if (savedRight && savedBottom) {
                darkModeToggle.style.right = savedRight;
                darkModeToggle.style.bottom = savedBottom;
            }

            // Restore velocity
            velocityX = parseFloat(localStorage.getItem('darkModeButtonVelocityX')) || 0;
            velocityY = parseFloat(localStorage.getItem('darkModeButtonVelocityY')) || 0;

            // Apply momentum if there was velocity
            if (velocityX !== 0 || velocityY !== 0) {
                requestAnimationFrame(applyMomentum);
            }
        }

    }

    // Call setInitialPosition after appending the button
    setInitialPosition();

    // Update position on window resize
    window.addEventListener('resize', setInitialPosition);

    // Dark mode toggle functionality
    let isDragging = false;
    let startX, startY;
    let lastX, lastY;
    let animationId;

    darkModeToggle.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - darkModeToggle.offsetLeft;
        startY = e.clientY - darkModeToggle.offsetTop;
        lastX = e.clientX;
        lastY = e.clientY;
        cancelAnimationFrame(animationId);
        e.preventDefault(); // Prevent text selection
    });

    document.addEventListener('mousemove', (e) => {
        // don't allow movement on info page
        if (isInfoPage) return;
        if (!isDragging) return;
        
        const newRight = window.innerWidth - (e.clientX - startX) - darkModeToggle.offsetWidth;
        const newBottom = window.innerHeight - (e.clientY - startY) - darkModeToggle.offsetHeight;
        
        darkModeToggle.style.right = Math.max(0, Math.min(newRight, window.innerWidth - darkModeToggle.offsetWidth)) + 'px';
        darkModeToggle.style.bottom = Math.max(0, Math.min(newBottom, window.innerHeight - darkModeToggle.offsetHeight)) + 'px';

        velocityX = e.clientX - lastX;
        velocityY = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            localStorage.setItem('darkModeButtonRight', darkModeToggle.style.right);
            localStorage.setItem('darkModeButtonBottom', darkModeToggle.style.bottom);
            localStorage.setItem('darkModeButtonVelocityX', velocityX.toString());
            localStorage.setItem('darkModeButtonVelocityY', velocityY.toString());
            applyMomentum();
        }
        isDragging = false;
    });

    function applyMomentum() {
        const friction = 0.96;
        const minVelocity = 0.1;
        const bounceFactor = 0.7;

        function animate() {
            if (Math.abs(velocityX) > minVelocity || Math.abs(velocityY) > minVelocity) {
                const currentRight = parseInt(darkModeToggle.style.right);
                const currentBottom = parseInt(darkModeToggle.style.bottom);

                let newRight = currentRight - velocityX;
                let newBottom = currentBottom - velocityY;

                // Bounce off right wall
                if (newRight < 0) {
                    newRight = 0;
                    velocityX = -velocityX * bounceFactor;
                }
                // Bounce off left wall
                if (newRight > window.innerWidth - darkModeToggle.offsetWidth) {
                    newRight = window.innerWidth - darkModeToggle.offsetWidth;
                    velocityX = -velocityX * bounceFactor;
                }
                // Bounce off bottom wall
                if (newBottom < 0) {
                    newBottom = 0;
                    velocityY = -velocityY * bounceFactor;
                }
                // Bounce off top wall
                if (newBottom > window.innerHeight - darkModeToggle.offsetHeight) {
                    newBottom = window.innerHeight - darkModeToggle.offsetHeight;
                    velocityY = -velocityY * bounceFactor;
                }

                darkModeToggle.style.right = newRight + 'px';
                darkModeToggle.style.bottom = newBottom + 'px';

                velocityX *= friction;
                velocityY *= friction;

                localStorage.setItem('darkModeButtonRight', darkModeToggle.style.right);
                localStorage.setItem('darkModeButtonBottom', darkModeToggle.style.bottom);
                localStorage.setItem('darkModeButtonVelocityX', velocityX.toString());
                localStorage.setItem('darkModeButtonVelocityY', velocityY.toString());

                animationId = requestAnimationFrame(animate);
            } else {
                localStorage.setItem('darkModeButtonRight', darkModeToggle.style.right);
                localStorage.setItem('darkModeButtonBottom', darkModeToggle.style.bottom);
                localStorage.removeItem('darkModeButtonVelocityX');
                localStorage.removeItem('darkModeButtonVelocityY');
            }
        }

        animate();
    }

    darkModeToggle.addEventListener('click', (e) => {
        if (!isDragging) {
            document.body.classList.toggle('dark-mode');
            sessionStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        }
    });

    // Update button style for draggability
    darkModeToggle.style.position = 'fixed';
    darkModeToggle.style.cursor = 'move';

    // Check for saved dark mode preference
    if (sessionStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Move these lines inside the DOMContentLoaded event listener
    let scrollTimer;

    // Scroll makes button invisible
    window.addEventListener('scroll', () => {
        darkModeToggle.style.opacity = '0';
        darkModeToggle.style.transition = '0.4s'
        
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            darkModeToggle.style.opacity = '1';
        }, 1600); 
    });

    // Remove on mobile and only on photos page
    if (window.innerWidth <= 1000 && isPhotoPage) {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) darkModeToggle.remove();
        return;
    }



});