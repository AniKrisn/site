document.addEventListener('DOMContentLoaded', () => {
    // Create the button
    const darkModeToggle = document.createElement('button');
    darkModeToggle.id = 'darkModeToggle';
    darkModeToggle.className = 'circle-button';
    darkModeToggle.setAttribute('aria-label', 'Toggle Dark Mode');

    // Append the button to the body
    document.body.appendChild(darkModeToggle);

    // Set initial position
    function setInitialPosition() {
        const savedRight = sessionStorage.getItem('darkModeButtonRight');
        const savedBottom = sessionStorage.getItem('darkModeButtonBottom');
        
        if (savedRight && savedBottom) {
            darkModeToggle.style.right = savedRight;
            darkModeToggle.style.bottom = savedBottom;
        } else {
            const padding = 0.15; // 15% padding
            const buttonWidth = darkModeToggle.offsetWidth;
            const buttonHeight = darkModeToggle.offsetHeight;
            
            const right = window.innerWidth * padding;
            const bottom = window.innerHeight * padding;
            
            darkModeToggle.style.right = right + 'px';
            darkModeToggle.style.bottom = bottom + 'px';
        }
    }

    // Call setInitialPosition after appending the button
    setInitialPosition();

    // Update position on window resize
    window.addEventListener('resize', setInitialPosition);

    // Dark mode toggle functionality
    let isDragging = false;
    let startX, startY;

    darkModeToggle.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - darkModeToggle.offsetLeft;
        startY = e.clientY - darkModeToggle.offsetTop;
        e.preventDefault(); // Prevent text selection
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const newRight = window.innerWidth - (e.clientX - startX) - darkModeToggle.offsetWidth;
        const newBottom = window.innerHeight - (e.clientY - startY) - darkModeToggle.offsetHeight;
        
        // Constrain to window boundaries
        darkModeToggle.style.right = Math.max(0, Math.min(newRight, window.innerWidth - darkModeToggle.offsetWidth)) + 'px';
        darkModeToggle.style.bottom = Math.max(0, Math.min(newBottom, window.innerHeight - darkModeToggle.offsetHeight)) + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            // Save the new position to sessionStorage
            sessionStorage.setItem('darkModeButtonRight', darkModeToggle.style.right);
            sessionStorage.setItem('darkModeButtonBottom', darkModeToggle.style.bottom);
        }
        isDragging = false;
    });

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
        
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            darkModeToggle.style.opacity = '1';
        }, 1600); 
    });
});