/**
 * Animation Utilities for Stack & Queue Visualizer
 * Provides smooth animations and transitions
 */

class AnimationUtils {
    constructor() {
        this.animationQueue = [];
        this.isAnimating = false;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Add animation class to element
     * @param {HTMLElement} element - Target element
     * @param {string} animationClass - CSS animation class
     * @param {number} duration - Animation duration in milliseconds
     * @returns {Promise} - Resolves when animation completes
     */
    animate(element, animationClass, duration = 400) {
        return new Promise((resolve) => {
            if (this.reducedMotion) {
                resolve();
                return;
            }

            element.classList.add(animationClass);
            
            const onAnimationEnd = () => {
                element.classList.remove(animationClass);
                element.removeEventListener('animationend', onAnimationEnd);
                resolve();
            };

            element.addEventListener('animationend', onAnimationEnd);
            
            // Fallback timeout in case animationend doesn't fire
            setTimeout(() => {
                element.classList.remove(animationClass);
                element.removeEventListener('animationend', onAnimationEnd);
                resolve();
            }, duration);
        });
    }

    /**
     * Queue multiple animations to run sequentially
     * @param {Array} animations - Array of animation objects
     * @returns {Promise} - Resolves when all animations complete
     */
    async animateSequence(animations) {
        for (const anim of animations) {
            await this.animate(anim.element, anim.class, anim.duration);
            if (anim.delay) {
                await this.delay(anim.delay);
            }
        }
    }

    /**
     * Animate element entrance
     * @param {HTMLElement} element - Element to animate
     * @param {string} type - Animation type ('fadeIn', 'slideIn', 'scaleIn')
     * @returns {Promise} - Animation promise
     */
    animateIn(element, type = 'fadeIn') {
        const animations = {
            fadeIn: 'animate-fadeIn',
            slideIn: 'animate-slideIn',
            scaleIn: 'animate-scaleIn',
            bounceIn: 'animate-bounceIn'
        };

        return this.animate(element, animations[type] || animations.fadeIn);
    }

    /**
     * Animate element exit
     * @param {HTMLElement} element - Element to animate
     * @param {string} type - Animation type ('fadeOut', 'slideOut', 'scaleOut')
     * @returns {Promise} - Animation promise
     */
    animateOut(element, type = 'fadeOut') {
        const animations = {
            fadeOut: 'animate-fadeOut',
            slideOut: 'animate-slideOut',
            scaleOut: 'animate-scaleOut',
            bounceOut: 'animate-bounceOut'
        };

        return this.animate(element, animations[type] || animations.fadeOut);
    }

    /**
     * Create a delay
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} - Resolves after delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Smooth scroll to element
     * @param {HTMLElement|string} target - Target element or selector
     * @param {number} offset - Offset from top in pixels
     */
    scrollTo(target, offset = 0) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return;

        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Animate counter/number changes
     * @param {HTMLElement} element - Element containing the number
     * @param {number} from - Starting number
     * @param {number} to - Ending number
     * @param {number} duration - Animation duration in milliseconds
     */
    animateNumber(element, from, to, duration = 800) {
        if (this.reducedMotion) {
            element.textContent = to;
            return;
        }

        const startTime = performance.now();
        const difference = to - from;

        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            const currentNumber = Math.round(from + (difference * easeOut));
            element.textContent = currentNumber;

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };

        requestAnimationFrame(updateNumber);
    }

    /**
     * Create ripple effect on button click
     * @param {HTMLElement} button - Button element
     * @param {Event} event - Click event
     */
    createRipple(button, event) {
        if (this.reducedMotion) return;

        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
        `;

        // Ensure button has relative positioning
        const originalPosition = button.style.position;
        if (!originalPosition || originalPosition === 'static') {
            button.style.position = 'relative';
        }

        button.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
            if (!originalPosition) {
                button.style.position = '';
            }
        }, 600);
    }

    /**
     * Animate progress bar
     * @param {HTMLElement} progressBar - Progress bar element
     * @param {number} percentage - Target percentage (0-100)
     * @param {number} duration - Animation duration
     */
    animateProgress(progressBar, percentage, duration = 1000) {
        if (this.reducedMotion) {
            progressBar.style.width = `${percentage}%`;
            return;
        }

        const startTime = performance.now();
        const startWidth = parseFloat(progressBar.style.width) || 0;
        const difference = percentage - startWidth;

        const updateProgress = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentWidth = startWidth + (difference * easeOut);
            
            progressBar.style.width = `${currentWidth}%`;

            if (progress < 1) {
                requestAnimationFrame(updateProgress);
            }
        };

        requestAnimationFrame(updateProgress);
    }

    /**
     * Shake element (for error states)
     * @param {HTMLElement} element - Element to shake
     */
    shake(element) {
        if (this.reducedMotion) return;
        
        return this.animate(element, 'animate-shake', 600);
    }

    /**
     * Pulse element (for attention)
     * @param {HTMLElement} element - Element to pulse
     * @param {number} count - Number of pulses
     */
    pulse(element, count = 2) {
        if (this.reducedMotion) return;
        
        element.style.animationIterationCount = count;
        return this.animate(element, 'animate-pulse', 600 * count);
    }

    /**
     * Highlight element temporarily
     * @param {HTMLElement} element - Element to highlight
     * @param {string} color - Highlight color
     * @param {number} duration - Duration in milliseconds
     */
    highlight(element, color = '#ffd700', duration = 1000) {
        if (this.reducedMotion) return Promise.resolve();

        const originalBackground = element.style.background;
        const originalTransition = element.style.transition;

        return new Promise((resolve) => {
            element.style.transition = 'background 0.3s ease';
            element.style.background = color;

            setTimeout(() => {
                element.style.background = originalBackground;
                
                setTimeout(() => {
                    element.style.transition = originalTransition;
                    resolve();
                }, 300);
            }, duration - 300);
        });
    }

    /**
     * Stagger animations for multiple elements
     * @param {NodeList|Array} elements - Elements to animate
     * @param {string} animationClass - Animation class to apply
     * @param {number} staggerDelay - Delay between each element
     */
    async staggerAnimation(elements, animationClass, staggerDelay = 100) {
        const promises = Array.from(elements).map((element, index) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    this.animate(element, animationClass).then(resolve);
                }, index * staggerDelay);
            });
        });

        return Promise.all(promises);
    }
}

// Add CSS for additional animations not in animations.css
const additionalAnimationCSS = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    @keyframes slideIn {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }

    @keyframes slideOut {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(-20px); opacity: 0; }
    }

    @keyframes scaleIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }

    @keyframes scaleOut {
        from { transform: scale(1); opacity: 1; }
        to { transform: scale(0.8); opacity: 0; }
    }

    @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
    }

    @keyframes bounceOut {
        0% { transform: scale(1); opacity: 1; }
        30% { transform: scale(1.05); }
        100% { transform: scale(0.3); opacity: 0; }
    }

    .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
    .animate-fadeOut { animation: fadeOut 0.3s ease-in; }
    .animate-slideIn { animation: slideIn 0.4s ease-out; }
    .animate-slideOut { animation: slideOut 0.4s ease-in; }
    .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
    .animate-scaleOut { animation: scaleOut 0.3s ease-in; }
    .animate-bounceIn { animation: bounceIn 0.5s ease-out; }
    .animate-bounceOut { animation: bounceOut 0.5s ease-in; }
    .animate-shake { animation: shake 0.6s ease-in-out; }
    .animate-pulse { animation: pulse 0.6s ease-in-out infinite; }
`;

// Initialize animation utilities and inject CSS
let animationUtils;

document.addEventListener('DOMContentLoaded', () => {
    // Inject additional CSS
    const style = document.createElement('style');
    style.textContent = additionalAnimationCSS;
    document.head.appendChild(style);

    // Initialize animation utils
    animationUtils = new AnimationUtils();

    // Add ripple effect to all buttons
    document.addEventListener('click', (event) => {
        if (event.target.matches('.btn')) {
            animationUtils.createRipple(event.target, event);
        }
    });

    // Animate cards on scroll (intersection observer)
    const cards = document.querySelectorAll('.theory-card, .demo-card, .applications-card, .example-card');
    
    if (cards.length && window.IntersectionObserver) {
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                    animationUtils.animateIn(entry.target, 'slideIn');
                    entry.target.setAttribute('data-animated', 'true');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        cards.forEach(card => cardObserver.observe(card));
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationUtils;
}