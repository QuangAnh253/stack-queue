/**
 * Queue Demo Implementation
 * Interactive demonstration of Queue data structure
 */

class QueueDemo {
    constructor() {
        this.queue = new Queue();
        
        // Initialize callbacks object to prevent undefined errors
        this.callbacks = {
            overflow: () => {},
            frontViewed: () => {},
            dequeued: () => {},
            cleared: () => {},
            enqueued: () => {}
        };
        
        this.initializeDOM();
        this.initializeEventListeners();
        this.updateDisplay();
    }

    /**
     * Initialize DOM elements
     */
    initializeDOM() {
        // Fixed: Use correct IDs that match HTML
        this.enqueueBtn = document.getElementById('queueEnqueueBtn');
        this.dequeueBtn = document.getElementById('queueDequeueBtn');
        this.frontBtn = document.getElementById('queueFrontBtn');
        this.clearBtn = document.getElementById('queueClearBtn');
        this.inputField = document.getElementById('queueInput');
        
        // Fixed: Use correct visualization container ID
        this.visualization = document.getElementById('queueVisualization');
        
        // Fixed: Use correct status element IDs
        this.sizeDisplay = document.getElementById('queueSize');
        this.frontDisplay = document.getElementById('queueFront');
        this.rearDisplay = document.getElementById('queueRear');
        this.statusDisplay = document.getElementById('queueStatus');
    }

    /**
     * Initialize event listeners
     */
    initializeEventListeners() {
        this.enqueueBtn?.addEventListener('click', () => {
            const value = this.inputField?.value?.trim();
            if (value) {
                this.enqueue(value);
                this.inputField.value = '';
            } else {
                this.showNotification('Vui lòng nhập giá trị!', 'warning');
            }
        });

        this.dequeueBtn?.addEventListener('click', () => this.dequeue());
        this.frontBtn?.addEventListener('click', () => this.viewFront());
        this.clearBtn?.addEventListener('click', () => this.clear());

        // Enter key support for input
        this.inputField?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.enqueueBtn?.click();
            }
        });
    }

    /**
     * Add element to queue
     * @param {*} value - Value to add
     */
    enqueue(value) {
        try {
            this.queue.enqueue(value);
            this.updateDisplay();
            this.showNotification(`Đã thêm: ${value}`, 'success');
            
            // Call callback safely
            if (this.callbacks?.enqueued) {
                this.callbacks.enqueued(value);
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
            
            // Call overflow callback safely
            if (this.callbacks?.overflow) {
                this.callbacks.overflow();
            }
        }
    }

    /**
     * Remove element from queue
     */
    dequeue() {
        try {
            if (this.queue.isEmpty()) {
                this.showNotification('Queue đang trống!', 'warning');
                return;
            }

            const value = this.queue.dequeue();
            this.updateDisplay();
            this.showNotification(`Đã lấy ra: ${value}`, 'success');
            
            // Call callback safely
            if (this.callbacks?.dequeued) {
                this.callbacks.dequeued(value);
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    /**
     * View front element
     */
    viewFront() {
        try {
            const front = this.queue.front();
            if (front === null) {
                this.showNotification('Queue đang trống!', 'warning');
            } else {
                this.showNotification(`Phần tử đầu: ${front}`, 'info');
                
                // Highlight front element briefly
                this.highlightFrontElement();
            }
            
            // Call callback safely
            if (this.callbacks?.frontViewed) {
                this.callbacks.frontViewed(front);
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    /**
     * Clear queue
     */
    clear() {
        try {
            this.queue.clear();
            this.updateDisplay();
            this.showNotification('Đã xóa toàn bộ queue', 'info');
            
            // Call callback safely
            if (this.callbacks?.cleared) {
                this.callbacks.cleared();
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    /**
     * Update visual display
     */
    updateDisplay() {
        if (!this.visualization) return;

        if (this.queue.isEmpty()) {
            // Show empty state
            this.visualization.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-arrow-right"></i>
                    <p>Queue trống</p>
                    <span>Nhập giá trị và nhấn Enqueue để bắt đầu</span>
                </div>
            `;
        } else {
            // Show queue items
            const items = this.queue.toArray();
            this.visualization.innerHTML = items
                .map((item, index) => `
                    <div class="queue-item ${index === 0 ? 'front-item' : ''} ${index === items.length - 1 ? 'rear-item' : ''}" 
                         data-index="${index}">
                        <span class="item-value">${item}</span>
                        ${index === 0 ? '<div class="item-label">Front</div>' : ''}
                        ${index === items.length - 1 ? '<div class="item-label">Rear</div>' : ''}
                    </div>
                `).join('');
        }

        // Update status displays
        if (this.sizeDisplay) {
            this.sizeDisplay.textContent = this.queue.size();
        }

        if (this.frontDisplay) {
            this.frontDisplay.textContent = this.queue.front() || 'None';
        }

        if (this.rearDisplay) {
            this.rearDisplay.textContent = this.queue.rear() || 'None';
        }

        if (this.statusDisplay) {
            if (this.queue.isEmpty()) {
                this.statusDisplay.textContent = 'Empty';
                this.statusDisplay.className = 'status-empty';
            } else {
                this.statusDisplay.textContent = 'Has Data';
                this.statusDisplay.className = 'status-data';
            }
        }

        // Update button states
        const isEmpty = this.queue.isEmpty();
        if (this.dequeueBtn) {
            this.dequeueBtn.disabled = isEmpty;
        }
        if (this.frontBtn) {
            this.frontBtn.disabled = isEmpty;
        }
        if (this.clearBtn) {
            this.clearBtn.disabled = isEmpty;
        }
    }

    /**
     * Highlight front element
     */
    highlightFrontElement() {
        const frontItem = this.visualization?.querySelector('.front-item');
        if (frontItem) {
            frontItem.style.transform = 'scale(1.1)';
            frontItem.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
            
            setTimeout(() => {
                frontItem.style.transform = '';
                frontItem.style.boxShadow = '';
            }, 1000);
        }
    }

    /**
     * Show notification
     * @param {string} message - Message to show
     * @param {string} type - Type of notification
     */
    showNotification(message, type = 'info') {
        // Check if external notifications object exists
        if (typeof notifications !== 'undefined' && notifications[type]) {
            notifications[type](message);
            return;
        }

        // Fallback to console
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Create simple toast notification
        this.createToast(message, type);
    }

    /**
     * Create simple toast notification
     * @param {string} message - Message to display
     * @param {string} type - Type of notification
     */
    createToast(message, type) {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.demo-toast');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `demo-toast toast-${type}`;
        
        const colors = {
            error: '#ef4444',
            success: '#22c55e',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${colors[type] || colors.info};
            color: white;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: inherit;
            font-size: 14px;
            font-weight: 500;
            max-width: 300px;
            word-wrap: break-word;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;

        toast.textContent = message;
        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        });

        // Animate out and remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Set callback functions
     * @param {Object} callbacks - Callback functions
     */
    setCallbacks(callbacks) {
        this.callbacks = { ...this.callbacks, ...callbacks };
    }

    /**
     * Get queue statistics
     * @returns {Object} - Queue statistics
     */
    getStats() {
        return {
            size: this.queue.size(),
            isEmpty: this.queue.isEmpty(),
            front: this.queue.front(),
            rear: this.queue.rear(),
            maxSize: this.queue.maxSize
        };
    }

    /**
     * Load sample data for demonstration
     */
    loadSampleData() {
        const samples = ['Apple', 'Banana', 'Cherry', 'Date'];
        this.clear(); // Clear first
        samples.forEach(item => {
            setTimeout(() => this.enqueue(item), samples.indexOf(item) * 200);
        });
    }

    /**
     * Reset demo to initial state
     */
    reset() {
        this.clear();
        if (this.inputField) {
            this.inputField.value = '';
            this.inputField.focus();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('queueVisualization')) {
        window.queueDemo = new QueueDemo();
        
        // Add some helpful debug info
        console.log('Queue Demo initialized successfully');
    }
});