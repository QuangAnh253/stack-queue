/**
 * Main JavaScript file for Stack & Queue Visualizer
 * Coordinates all components and handles global functionality
 */

class StackQueueApp {
    constructor() {
        this.components = {};
        this.isInitialized = false;
        this.currentTheme = 'light';
        
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            // Wait for DOM to be fully loaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
            } else {
                this.initializeComponents();
            }
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showErrorMessage('Application initialization failed');
        }
    }

    /**
     * Initialize all components
     */
    initializeComponents() {
        try {
            // Initialize global features
            this.initializeNavigation();
            this.initializeSmoothScrolling();
            this.initializeMobileMenu();
            this.initializeIntersectionObserver();
            this.initializeKeyboardShortcuts();
            this.initializeErrorHandling();
            
            // Store component references (these are initialized by their respective files)
            this.components = {
                notifications: window.notifications,
                animationUtils: window.animationUtils,
                stackDemo: window.stackDemo,
                queueDemo: window.queueDemo,
                bracketChecker: window.bracketChecker,
                bfsDemo: window.bfsDemo,
                undoRedoEditor: window.undoRedoEditor
            };

            // Mark as initialized
            this.isInitialized = true;
            
            // Show welcome message
            setTimeout(() => {
                if (this.components.notifications) {
                    this.components.notifications.info('Chào mừng tới ứng dụng Stack và Queue! 🚀');
                }
            }, 1000);

            console.log('Stack & Queue Visualizer initialized successfully');
        } catch (error) {
            console.error('Component initialization failed:', error);
        }
    }

    /**
     * Initialize navigation functionality
     */
    initializeNavigation() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    this.scrollToSection(targetSection);
                    
                    // Close mobile menu if open
                    this.closeMobileMenu();
                }
            });
        });
    }

    /**
     * Initialize smooth scrolling
     */
    initializeSmoothScrolling() {
        // Add smooth scrolling to all anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link && link.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    this.scrollToSection(targetElement);
                }
            }
        });
    }

    /**
     * Scroll to section with offset for fixed header
     * @param {HTMLElement} element - Target element
     */
    scrollToSection(element) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Initialize mobile menu functionality
     */
    initializeMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const nav = document.querySelector('.nav');

        if (mobileMenuBtn && nav) {
            mobileMenuBtn.addEventListener('click', () => {
                nav.classList.toggle('active');
                this.updateMobileMenuIcon(nav.classList.contains('active'));
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // Close menu on window resize to desktop size
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        const nav = document.querySelector('.nav');
        if (nav) {
            nav.classList.remove('active');
            this.updateMobileMenuIcon(false);
        }
    }

    /**
     * Update mobile menu button icon
     * @param {boolean} isOpen - Whether menu is open
     */
    updateMobileMenuIcon(isOpen) {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (isOpen) {
                    span.style.transform = index === 0 ? 'rotate(45deg) translate(5px, 5px)' :
                                         index === 1 ? 'opacity(0)' :
                                         'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = '';
                    span.style.opacity = '1';
                }
            });
        }
    }

    /**
     * Initialize intersection observer for animations
     */
    initializeIntersectionObserver() {
        if (!window.IntersectionObserver) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        // Observe section headers for navigation highlighting
        const sections = document.querySelectorAll('.section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

        if (sections.length && navLinks.length) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Update active navigation link
                        const activeId = entry.target.id;
                        navLinks.forEach(link => {
                            const href = link.getAttribute('href').substring(1);
                            link.classList.toggle('active', href === activeId);
                        });
                    }
                });
            }, observerOptions);

            sections.forEach(section => sectionObserver.observe(section));
        }

        // Observe elements for entrance animations
        const animatableElements = document.querySelectorAll('.theory-card, .demo-card, .application-item');
        
        if (animatableElements.length && this.components.animationUtils) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                        entry.target.setAttribute('data-animated', 'true');
                        this.components.animationUtils?.animateIn(entry.target, 'slideIn');
                    }
                });
            }, observerOptions);

            animatableElements.forEach(element => animationObserver.observe(element));
        }
    }

    /**
     * Initialize keyboard shortcuts
     */
    initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts when not in input fields
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
                return;
            }

            // Global shortcuts
            if (e.altKey || e.ctrlKey) {
                switch (e.key.toLowerCase()) {
                    case 's':
                        e.preventDefault();
                        this.scrollToSection(document.getElementById('stack-section'));
                        break;
                    case 'q':
                        e.preventDefault();
                        this.scrollToSection(document.getElementById('queue-section'));
                        break;
                    case 'e':
                        e.preventDefault();
                        this.scrollToSection(document.getElementById('examples-section'));
                        break;
                    case 'h':
                        e.preventDefault();
                        this.showKeyboardShortcuts();
                        break;
                }
            }

            // Escape key to close modals, clear focus, etc.
            if (e.key === 'Escape') {
                this.closeMobileMenu();
                // Clear any focused elements
                document.activeElement?.blur();
            }
        });
    }

    /**
     * Initialize global error handling
     */
    initializeErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleError(event.error, 'Application error occurred');
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleError(event.reason, 'An unexpected error occurred');
        });
    }

    /**
     * Handle application errors
     * @param {Error} error - Error object
     * @param {string} message - User-friendly message
     */
    handleError(error, message) {
        if (this.components.notifications) {
            this.components.notifications.error(message);
        } else {
            // Fallback if notifications aren't available
            console.error(message, error);
        }
    }

    /**
     * Show error message to user
     * @param {string} message - Error message
     */
    showErrorMessage(message) {
        // Create a simple error display if notifications aren't available
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 400px;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    /**
     * Show keyboard shortcuts modal
     */
    showKeyboardShortcuts() {
        const modal = document.createElement('div');
        modal.className = 'shortcuts-modal';
        modal.innerHTML = `
            <div class="shortcuts-content">
                <div class="shortcuts-header">
                    <h3>Keyboard Shortcuts</h3>
                    <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="shortcuts-body">
                    <div class="shortcut-group">
                        <h4>Navigation</h4>
                        <div class="shortcut-item">
                            <kbd>Alt/Ctrl + S</kbd>
                            <span>Go to Stack section</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Alt/Ctrl + Q</kbd>
                            <span>Go to Queue section</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Alt/Ctrl + E</kbd>
                            <span>Go to Examples section</span>
                        </div>
                    </div>
                    <div class="shortcut-group">
                        <h4>Text Editor</h4>
                        <div class="shortcut-item">
                            <kbd>Ctrl + Z</kbd>
                            <span>Undo</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl + Shift + Z</kbd>
                            <span>Redo</span>
                        </div>
                    </div>
                    <div class="shortcut-group">
                        <h4>General</h4>
                        <div class="shortcut-item">
                            <kbd>Escape</kbd>
                            <span>Close menus/Clear focus</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Alt/Ctrl + H</kbd>
                            <span>Show this help</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        this.injectShortcutStyles();
        
        document.body.appendChild(modal);
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    /**
     * Inject shortcut modal styles
     */
    injectShortcutStyles() {
        if (document.getElementById('shortcuts-modal-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'shortcuts-modal-styles';
        styles.textContent = `
            .shortcuts-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 20px;
            }
            
            .shortcuts-content {
                background: white;
                border-radius: 12px;
                max-width: 500px;
                max-height: 80vh;
                overflow: hidden;
                box-shadow: var(--shadow-xl);
            }
            
            .shortcuts-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid var(--scheme-neutral-900);
                background: var(--scheme-brand-600-10);
            }
            
            .shortcuts-header h3 {
                margin: 0;
                color: var(--scheme-neutral-200);
            }
            
            .shortcuts-body {
                padding: 20px;
                max-height: 60vh;
                overflow-y: auto;
            }
            
            .shortcut-group {
                margin-bottom: 24px;
            }
            
            .shortcut-group:last-child {
                margin-bottom: 0;
            }
            
            .shortcut-group h4 {
                margin: 0 0 12px 0;
                color: var(--scheme-neutral-300);
                font-size: 16px;
                border-bottom: 2px solid var(--scheme-brand-500);
                padding-bottom: 4px;
            }
            
            .shortcut-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid var(--scheme-neutral-1000);
            }
            
            .shortcut-item:last-child {
                border-bottom: none;
            }
            
            kbd {
                background: var(--scheme-neutral-800);
                color: var(--scheme-neutral-1000);
                padding: 4px 8px;
                border-radius: 4px;
                font-family: monospace;
                font-size: 12px;
                font-weight: bold;
                border: 1px solid var(--scheme-neutral-600);
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }
            
            .shortcut-item span {
                color: var(--scheme-neutral-400);
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * Get application status
     * @returns {Object} - Application status information
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            components: Object.keys(this.components).reduce((acc, key) => {
                acc[key] = !!this.components[key];
                return acc;
            }, {}),
            theme: this.currentTheme
        };
    }

    /**
     * Reset all components to initial state
     */
    resetAll() {
        try {
            // Reset individual components
            this.components.stackDemo?.clear?.();
            this.components.queueDemo?.clear?.();
            this.components.bfsDemo?.reset?.();
            this.components.bracketChecker?.clearResult?.();
            
            // Clear any active notifications
            this.components.notifications?.hide?.();
            
            if (this.components.notifications) {
                this.components.notifications.info('All components reset');
            }
        } catch (error) {
            console.error('Reset failed:', error);
            this.handleError(error, 'Failed to reset components');
        }
    }
}

// Initialize the application
let app;

// Ensure the app initializes properly
document.addEventListener('DOMContentLoaded', () => {
    app = new StackQueueApp();
    
    // Make app globally available for debugging
    if (window.location.search.includes('debug=true')) {
        window.app = app;
        console.log('Debug mode enabled. App instance available as window.app');
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StackQueueApp;
}

// Add CSS for active navigation links
const navStyles = document.createElement('style');
navStyles.textContent = `
    .nav-link.active {
        color: var(--scheme-brand-500) !important;
        background: var(--scheme-brand-600-10) !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(navStyles);