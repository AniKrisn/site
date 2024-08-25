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
        const savedRight = localStorage.getItem('darkModeButtonRight');
        const savedBottom = localStorage.getItem('darkModeButtonBottom');
        
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

    darkModeToggle.addEventListener('click', (e) => {
        if (!isDragging) {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        }
    });

    darkModeToggle.addEventListener('mousedown', (e) => {
        isDragging = false;
        startX = e.clientX - darkModeToggle.offsetLeft;
        startY = e.clientY - darkModeToggle.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (e.buttons !== 1) return; // Check if left mouse button is pressed
        isDragging = true;
        let newRight = window.innerWidth - (e.clientX - startX) - darkModeToggle.offsetWidth;
        let newBottom = window.innerHeight - (e.clientY - startY) - darkModeToggle.offsetHeight;
        
        // Constrain to window boundaries
        newRight = Math.max(0, Math.min(newRight, window.innerWidth - darkModeToggle.offsetWidth));
        newBottom = Math.max(0, Math.min(newBottom, window.innerHeight - darkModeToggle.offsetHeight));

        darkModeToggle.style.right = newRight + 'px';
        darkModeToggle.style.bottom = newBottom + 'px';

        // Save the new position to localStorage
        localStorage.setItem('darkModeButtonRight', darkModeToggle.style.right);
        localStorage.setItem('darkModeButtonBottom', darkModeToggle.style.bottom);
    });

    // Update button style for draggability
    darkModeToggle.style.position = 'fixed';
    darkModeToggle.style.cursor = 'move';

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
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