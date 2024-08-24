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
                }, 1100); 
            }
        });
    }
});