// scroll_animation.js
// Implements the fade-in, slide-up animation on scroll using IntersectionObserver.

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Stagger project cards for a sequential animation effect
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        // Assign a delay based on its position (150ms stagger per card)
        card.dataset.animationDelay = index * 150; 
    });
    
    // Select all sections and all project cards in the document
    const elementsToAnimate = document.querySelectorAll('section, .project-card');

    // Define the observer options
    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        // Trigger when 10% of the element is visible
        threshold: 0.1 
    };

    // Callback function to handle intersections
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // *** DEBUG: Log that the element is being animated ***
                console.log(`Animating: ${entry.target.id || entry.target.className}`);

                // Get the animation delay from the element's data attribute (default to 0ms for sections)
                const delay = parseInt(entry.target.dataset.animationDelay || 0, 10);

                // Use a setTimeout to introduce the stagger delay before adding the class
                setTimeout(() => {
                    // When intersecting, add the 'visible' class to trigger CSS transition
                    entry.target.classList.add('visible');
                    
                    // Stop observing the element once it has been animated
                    observer.unobserve(entry.target); 
                }, delay);
            }
        });
    }, observerOptions);

    // Attach the observer to each target element
    elementsToAnimate.forEach(element => {
        sectionObserver.observe(element);
    });
    
    // *** DEBUG: Log how many elements are being observed ***
    console.log(`Scroll Animation: Observing ${elementsToAnimate.length} elements (Sections + Project Cards).`);
});
