const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

// --- Set Initial Canvas State for Light Mode ---
window.butterflyTheme = {
    main: '#000000',      // Black characters for Light Mode
    lines: '100, 100, 100', // Grey lines
    opacity: 0.15
};

themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const newTheme = isLight ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Update Material Icon
    themeIcon.textContent = newTheme === 'light' ? 'dark_mode' : 'light_mode';
    
    updateCanvasColors(newTheme);
});

function updateCanvasColors(theme) {
    if (theme === 'light') {
        window.butterflyTheme.main = '#000000';
        window.butterflyTheme.lines = '100, 100, 100';
        window.butterflyTheme.opacity = 0.15;
    } else {
        window.butterflyTheme.main = '#ffffff';
        window.butterflyTheme.lines = '255, 255, 255';
        window.butterflyTheme.opacity = 0.3;
    }

    // Update existing particles immediately
    if (typeof particles !== 'undefined') {
        particles.forEach(p => {
            p.color = getRandomColor(); 
        });
    }
}