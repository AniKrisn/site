document.addEventListener('DOMContentLoaded', () => {
    // Create the button
    const darkModeToggle = document.createElement('button');
    darkModeToggle.id = 'darkModeToggle';
    darkModeToggle.className = 'circle-button';
    darkModeToggle.setAttribute('aria-label', 'Toggle Dark Mode');

    // Append the button to the body
    document.body.appendChild(darkModeToggle);

    // Dark mode toggle functionality
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Move these lines inside the DOMContentLoaded event listener
    let scrollTimer;

    if (darkModeToggle) {
        window.addEventListener('scroll', () => {
            if (window.innerWidth <= 1000) {
                darkModeToggle.style.opacity = '0';
                
                clearTimeout(scrollTimer);
                scrollTimer = setTimeout(() => {
                    darkModeToggle.style.opacity = '1';
                }, 1600); 
            }
        });
    }

    // Add draggable functionality
    let isDragging = false;
    let startX, startY, initialX, initialY;

    darkModeToggle.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    function startDragging(e) {
        isDragging = true;
        startX = e.clientX - darkModeToggle.offsetLeft;
        startY = e.clientY - darkModeToggle.offsetTop;
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            let newX = e.clientX - startX;
            let newY = e.clientY - startY;
            
            // Constrain to window boundaries
            newX = Math.max(0, Math.min(newX, window.innerWidth - darkModeToggle.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - darkModeToggle.offsetHeight));

            darkModeToggle.style.left = newX + 'px';
            darkModeToggle.style.top = newY + 'px';
        }
    }

    function stopDragging() {
        isDragging = false;
    }

    // Update button style for draggability
    darkModeToggle.style.position = 'fixed';
    darkModeToggle.style.cursor = 'move';
});