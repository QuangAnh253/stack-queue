/**
 * Stack Demo Component
 * Interactive visualization for Stack data structure
 */

class StackDemo {
    constructor() {
        this.stack = new Stack();
        this.container = document.getElementById('stackVisualization');
        this.input = document.getElementById('stackInput');
        this.sizeDisplay = document.getElementById('stackSize');
        this.topDisplay = document.getElementById('stackTop');
        this.statusDisplay = document.getElementById('stackStatus');
        
        this.initializeEventListeners();
        this.updateDisplay();
    }

    /**
     * Safe notification wrapper - prevents undefined errors
     */
    notify(type, message, value = null) {
        if (typeof window.notifications === 'undefined') {
            console.warn('Notifications not loaded yet:', type, message, value);
            return;
        }

        switch(type) {
            case 'validation':
                window.notifications.validationError('Input', message);
                break;
            case 'stack.pushed':
                window.notifications.stack?.pushed?.(value);
                break;
            case 'stack.popped':
                window.notifications.stack?.popped?.(value);
                break;
            case 'stack.peeked':
                window.notifications.stack?.peeked?.(value);
                break;
            case 'stack.overflow':
                window.notifications.stack?.overflow?.();
                break;
            case 'stack.empty':
                window.notifications.stack?.empty?.();
                break;
            case 'stack.cleared':
                window.notifications.stack?.cleared?.();
                break;
            case 'info':
                window.notifications.info?.(message);
                break;
            default:
                console.log('Notification:', type, message, value);
        }
    }

    /**
     * Initialize event listeners for stack controls
     */
    initializeEventListeners() {
        const pushBtn = document.getElementById('stackPushBtn');
        const popBtn = document.getElementById('stackPopBtn');
        const peekBtn = document.getElementById('stackPeekBtn');
        const clearBtn = document.getElementById('stackClearBtn');

        pushBtn?.addEventListener('click', () => this.push());
        popBtn?.addEventListener('click', () => this.pop());
        peekBtn?.addEventListener('click', () => this.peek());
        clearBtn?.addEventListener('click', () => this.clear());

        // Enter key support for input
        this.input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.push();
            }
        });

        // Input validation
        this.input?.addEventListener('input', () => {
            this.validateInput();
        });
    }

    /**
     * Validate input value
     */
    validateInput() {
        const value = this.input.value.trim();
        const pushBtn = document.getElementById('stackPushBtn');
        
        if (!pushBtn) return;

        if (value === '') {
            pushBtn.disabled = true;
            pushBtn.title = 'Enter a value first';
        } else if (value.length > 15) {
            pushBtn.disabled = true;
            pushBtn.title = 'Value too long (max 15 characters)';
        } else if (this.stack.size() >= this.stack.maxSize) {
            pushBtn.disabled = true;
            pushBtn.title = 'Stack is full';
        } else {
            pushBtn.disabled = false;
            pushBtn.title = 'Push to stack';
        }
    }

    /**
     * Push value to stack
     */
    push() {
        const value = this.input.value.trim();
        
        if (!value) {
            this.notify('validation', 'Please enter a value');
            this.input.focus();
            return;
        }

        if (value.length > 15) {
            this.notify('validation', 'Value too long (max 15 characters)');
            return;
        }

        try {
            this.stack.push(value);
            this.addStackItem(value);
            this.input.value = '';
            this.updateDisplay();
            this.validateInput();
            this.notify('stack.pushed', null, value);
            
            // Focus back to input for continuous use
            this.input.focus();
        } catch (error) {
            this.notify('stack.overflow');
        }
    }

    /**
     * Pop value from stack
     */
    pop() {
        if (this.stack.isEmpty()) {
            this.notify('stack.empty');
            return;
        }

        const value = this.stack.pop();
        this.removeStackItem();
        this.updateDisplay();
        this.validateInput();
        this.notify('stack.popped', null, value);
    }

    /**
     * Peek at top value
     */
    peek() {
        if (this.stack.isEmpty()) {
            this.notify('stack.empty');
            return;
        }

        const value = this.stack.peek();
        this.highlightTopItem();
        this.notify('stack.peeked', null, value);
    }

    /**
     * Clear the stack
     */
    clear() {
        if (this.stack.isEmpty()) {
            this.notify('info', 'Stack is already empty');
            return;
        }

        this.stack.clear();
        this.clearVisualization();
        this.updateDisplay();
        this.validateInput();
        this.notify('stack.cleared');
    }

    /**
     * Add visual item to stack
     */
    addStackItem(value) {
        // Remove empty state if present
        const emptyState = this.container.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }

        // Create stack item element
        const item = document.createElement('div');
        item.className = 'stack-item animate-stackPush';
        item.textContent = value;
        item.title = `Stack item: ${value}`;
        
        // Add to container
        this.container.appendChild(item);

        // Add hover effect
        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('removing')) {
                item.style.transform = 'scale(1.05)';
                item.style.zIndex = '10';
            }
        });

        item.addEventListener('mouseleave', () => {
            if (!item.classList.contains('removing')) {
                item.style.transform = 'scale(1)';
                item.style.zIndex = 'auto';
            }
        });
    }

    /**
     * Remove top item from stack visualization
     */
    removeStackItem() {
        const items = this.container.querySelectorAll('.stack-item');
        if (items.length === 0) return;

        const topItem = items[items.length - 1];
        topItem.classList.add('removing');
        topItem.classList.add('animate-stackPop');

        // Remove after animation
        setTimeout(() => {
            if (topItem.parentNode) {
                topItem.remove();
            }

            // Show empty state if no items left
            if (this.container.children.length === 0) {
                this.showEmptyState();
            }
        }, 400);
    }

    /**
     * Highlight the top item
     */
    highlightTopItem() {
        const items = this.container.querySelectorAll('.stack-item');
        if (items.length === 0) return;

        const topItem = items[items.length - 1];
        topItem.classList.add('animate-stackHighlight');

        // Remove highlight class after animation
        setTimeout(() => {
            topItem.classList.remove('animate-stackHighlight');
        }, 800);
    }

    /**
     * Clear all visual items
     */
    clearVisualization() {
        const items = this.container.querySelectorAll('.stack-item');
        
        items.forEach((item, index) => {
            setTimeout(() => {
                if (item.parentNode) {
                    item.classList.add('removing');
                    item.classList.add('animate-stackPop');
                    
                    setTimeout(() => {
                        if (item.parentNode) {
                            item.remove();
                        }
                    }, 400);
                }
            }, index * 100); // Stagger the removal
        });

        // Show empty state after all items are removed
        setTimeout(() => {
            if (this.container.children.length === 0) {
                this.showEmptyState();
            }
        }, (items.length * 100) + 400);
    }

    /**
     * Show empty state
     */
    showEmptyState() {
        if (this.container.querySelector('.empty-state')) return;

        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <i class="fas fa-layer-group"></i>
            <p>Stack trống</p>
            <span>Nhập giá trị và nhấn Push để bắt đầu</span>
        `;

        this.container.appendChild(emptyState);
    }

    /**
     * Update status display
     */
    updateDisplay() {
        // Update size
        this.sizeDisplay.textContent = this.stack.size();

        // Update top element
        const top = this.stack.peek();
        this.topDisplay.textContent = top !== null ? top : 'None';

        // Update status
        if (this.stack.isEmpty()) {
            this.statusDisplay.textContent = 'Empty';
            this.statusDisplay.className = 'status-empty';
        } else if (this.stack.size() >= this.stack.maxSize) {
            this.statusDisplay.textContent = 'Full';
            this.statusDisplay.className = 'status-error';
        } else {
            this.statusDisplay.textContent = 'Active';
            this.statusDisplay.className = 'status-active';
        }

        // Update button states
        this.updateButtonStates();
    }

    /**
     * Update button enabled/disabled states
     */
    updateButtonStates() {
        const popBtn = document.getElementById('stackPopBtn');
        const peekBtn = document.getElementById('stackPeekBtn');
        const clearBtn = document.getElementById('stackClearBtn');

        const isEmpty = this.stack.isEmpty();

        if (popBtn) {
            popBtn.disabled = isEmpty;
            popBtn.title = isEmpty ? 'Stack is empty' : 'Pop from stack';
        }

        if (peekBtn) {
            peekBtn.disabled = isEmpty;
            peekBtn.title = isEmpty ? 'Stack is empty' : 'View top element';
        }

        if (clearBtn) {
            clearBtn.disabled = isEmpty;
            clearBtn.title = isEmpty ? 'Stack is empty' : 'Clear all elements';
        }

        // Validate input for push button
        this.validateInput();
    }

    /**
     * Get current stack state for debugging
     */
    getState() {
        return {
            items: this.stack.toArray(),
            size: this.stack.size(),
            isEmpty: this.stack.isEmpty(),
            top: this.stack.peek()
        };
    }

    /**
     * Load state from array (for testing)
     */
    loadState(items) {
        this.clear();
        items.forEach(item => {
            this.stack.push(item);
            this.addStackItem(item);
        });
        this.updateDisplay();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('stackVisualization')) {
        window.stackDemo = new StackDemo();
    }
});