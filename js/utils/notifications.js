/**
 * Toast Notification System
 * Provides user feedback for application actions
 */

class NotificationSystem {
    constructor() {
        this.container = null;
        this.activeToasts = [];
        this.maxToasts = 5;
        this.defaultDuration = 4000;
        
        this.init();
    }

    /**
     * Initialize the notification system
     */
    init() {
        this.createContainer();
        this.injectStyles();
    }

    /**
     * Create the notification container
     */
    createContainer() {
        // Remove existing container if it exists
        const existingContainer = document.getElementById('notification-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.className = 'notification-container';
        
        document.body.appendChild(this.container);
    }

    /**
     * Inject CSS styles for notifications
     */
    injectStyles() {
        const existingStyles = document.getElementById('notification-styles');
        if (existingStyles) return;

        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .toast {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                padding: 16px;
                min-width: 300px;
                max-width: 400px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                pointer-events: auto;
                transform: translateX(100%);
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                opacity: 0;
            }

            .toast.show {
                transform: translateX(0);
                opacity: 1;
            }

            .toast.hide {
                transform: translateX(100%);
                opacity: 0;
            }

            .toast-header {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                margin-bottom: 8px;
            }

            .toast-icon {
                flex-shrink: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                color: white;
                font-size: 12px;
                font-weight: bold;
            }

            .toast-content {
                flex: 1;
                min-width: 0;
            }

            .toast-title {
                font-weight: 600;
                margin: 0 0 4px 0;
                font-size: 14px;
                line-height: 1.3;
            }

            .toast-message {
                margin: 0;
                font-size: 13px;
                line-height: 1.4;
                color: #6b7280;
                word-wrap: break-word;
            }

            .toast-close {
                background: none;
                border: none;
                color: #9ca3af;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: all 0.2s ease;
                flex-shrink: 0;
            }

            .toast-close:hover {
                background: rgba(0, 0, 0, 0.1);
                color: #374151;
            }

            .toast-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: rgba(0, 0, 0, 0.1);
                border-radius: 0 0 8px 8px;
                transition: width linear;
            }

            /* Success Toast */
            .toast.success .toast-icon {
                background: #10b981;
            }
            .toast.success .toast-title {
                color: #065f46;
            }
            .toast.success .toast-progress {
                background: #10b981;
            }

            /* Error Toast */
            .toast.error .toast-icon {
                background: #ef4444;
            }
            .toast.error .toast-title {
                color: #991b1b;
            }
            .toast.error .toast-progress {
                background: #ef4444;
            }

            /* Warning Toast */
            .toast.warning .toast-icon {
                background: #f59e0b;
            }
            .toast.warning .toast-title {
                color: #92400e;
            }
            .toast.warning .toast-progress {
                background: #f59e0b;
            }

            /* Info Toast */
            .toast.info .toast-icon {
                background: #3b82f6;
            }
            .toast.info .toast-title {
                color: #1e40af;
            }
            .toast.info .toast-progress {
                background: #3b82f6;
            }

            /* Mobile responsive */
            @media (max-width: 640px) {
                .notification-container {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                }
                
                .toast {
                    min-width: unset;
                    max-width: unset;
                }
            }

            /* Reduced motion */
            @media (prefers-reduced-motion: reduce) {
                .toast {
                    transition: opacity 0.2s ease;
                }
                
                .toast.show {
                    transform: translateX(0);
                }
                
                .toast.hide {
                    transform: translateX(0);
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * Show a notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, warning, info)
     * @param {Object} options - Additional options
     */
    show(message, type = 'info', options = {}) {
        const {
            title = this.getDefaultTitle(type),
            duration = this.defaultDuration,
            persistent = false,
            onclick = null,
            id = null
        } = options;

        // Remove existing notification with same ID
        if (id) {
            this.remove(id);
        }

        // Remove oldest toast if at maximum
        if (this.activeToasts.length >= this.maxToasts) {
            this.remove(this.activeToasts[0].id);
        }

        const toast = this.createToast(message, type, title, duration, persistent, onclick, id);
        this.container.appendChild(toast.element);
        this.activeToasts.push(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.element.classList.add('show');
        });

        // Auto remove if not persistent
        if (!persistent && duration > 0) {
            toast.timeoutId = setTimeout(() => {
                this.remove(toast.id);
            }, duration);

            // Start progress bar animation
            if (toast.progressBar) {
                requestAnimationFrame(() => {
                    toast.progressBar.style.width = '0%';
                    toast.progressBar.style.transitionDuration = `${duration}ms`;
                });
            }
        }

        return toast.id;
    }

    /**
     * Create a toast element
     * @param {string} message - Toast message
     * @param {string} type - Toast type
     * @param {string} title - Toast title
     * @param {number} duration - Toast duration
     * @param {boolean} persistent - Whether toast is persistent
     * @param {Function} onclick - Click handler
     * @param {string} id - Toast ID
     * @returns {Object} - Toast object
     */
    createToast(message, type, title, duration, persistent, onclick, id) {
        const toastId = id || `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const element = document.createElement('div');
        element.className = `toast ${type}`;
        element.setAttribute('data-toast-id', toastId);

        const icon = this.getIcon(type);
        
        element.innerHTML = `
            <div class="toast-header">
                <div class="toast-icon">${icon}</div>
                <div class="toast-content">
                    <div class="toast-title">${this.escapeHtml(title)}</div>
                    <div class="toast-message">${this.escapeHtml(message)}</div>
                </div>
                <button class="toast-close" type="button" aria-label="Close">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
            ${duration > 0 && !persistent ? '<div class="toast-progress"></div>' : ''}
        `;

        const progressBar = element.querySelector('.toast-progress');
        const closeBtn = element.querySelector('.toast-close');

        // Close button handler
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.remove(toastId);
        });

        // Click handler
        if (onclick && typeof onclick === 'function') {
            element.style.cursor = 'pointer';
            element.addEventListener('click', (e) => {
                if (!e.target.closest('.toast-close')) {
                    onclick(e, toastId);
                }
            });
        }

        return {
            id: toastId,
            element,
            progressBar,
            timeoutId: null,
            type,
            message,
            title
        };
    }

    /**
     * Remove a toast
     * @param {string} toastId - Toast ID to remove
     */
    remove(toastId) {
        const toastIndex = this.activeToasts.findIndex(toast => toast.id === toastId);
        if (toastIndex === -1) return;

        const toast = this.activeToasts[toastIndex];
        
        // Clear timeout
        if (toast.timeoutId) {
            clearTimeout(toast.timeoutId);
        }

        // Animate out
        toast.element.classList.remove('show');
        toast.element.classList.add('hide');

        // Remove from DOM after animation
        setTimeout(() => {
            if (toast.element.parentNode) {
                toast.element.remove();
            }
            this.activeToasts.splice(toastIndex, 1);
        }, 300);
    }

    /**
     * Remove all toasts
     */
    clear() {
        this.activeToasts.forEach(toast => {
            this.remove(toast.id);
        });
    }

    /**
     * Show success notification
     * @param {string} message - Success message
     * @param {Object} options - Additional options
     */
    success(message, options = {}) {
        return this.show(message, 'success', options);
    }

    /**
     * Show error notification
     * @param {string} message - Error message
     * @param {Object} options - Additional options
     */
    error(message, options = {}) {
        return this.show(message, 'error', {
            duration: 6000, // Errors stay longer
            ...options
        });
    }

    /**
     * Show warning notification
     * @param {string} message - Warning message
     * @param {Object} options - Additional options
     */
    warning(message, options = {}) {
        return this.show(message, 'warning', options);
    }

    /**
     * Show info notification
     * @param {string} message - Info message
     * @param {Object} options - Additional options
     */
    info(message, options = {}) {
        return this.show(message, 'info', options);
    }

    /**
     * Get default title for toast type
     * @param {string} type - Toast type
     * @returns {string} - Default title
     */
    getDefaultTitle(type) {
        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Information'
        };
        return titles[type] || 'Notification';
    }

    /**
     * Get icon for toast type
     * @param {string} type - Toast type
     * @returns {string} - Icon HTML
     */
    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '!',
            info: 'i'
        };
        return icons[type] || 'i';
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Update toast message
     * @param {string} toastId - Toast ID
     * @param {string} message - New message
     * @param {string} title - New title (optional)
     */
    update(toastId, message, title = null) {
        const toast = this.activeToasts.find(t => t.id === toastId);
        if (!toast) return;

        const messageEl = toast.element.querySelector('.toast-message');
        const titleEl = toast.element.querySelector('.toast-title');
        
        if (messageEl) {
            messageEl.textContent = message;
            toast.message = message;
        }
        
        if (title && titleEl) {
            titleEl.textContent = title;
            toast.title = title;
        }
    }

    /**
     * Get all active toasts
     * @returns {Array} - Array of active toasts
     */
    getActiveToasts() {
        return [...this.activeToasts];
    }

    /**
     * Set maximum number of toasts
     * @param {number} max - Maximum number of toasts
     */
    setMaxToasts(max) {
        if (max < 1) {
            throw new Error('Maximum toasts must be at least 1');
        }
        this.maxToasts = max;
    }

    /**
     * Set default duration for toasts
     * @param {number} duration - Default duration in milliseconds
     */
    setDefaultDuration(duration) {
        if (duration < 0) {
            throw new Error('Duration cannot be negative');
        }
        this.defaultDuration = duration;
    }
}

// Create global instance
const notifications = new NotificationSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = notifications;
} else if (typeof window !== 'undefined') {
    window.notifications = notifications;
}