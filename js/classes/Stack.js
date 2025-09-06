/**
 * Stack Data Structure Implementation
 * LIFO (Last In, First Out) principle
 */

class Stack {
    constructor() {
        this.items = [];
        this.maxSize = 10; // Maximum size for visualization
    }

    /**
     * Add an element to the top of the stack
     * @param {*} element - Element to push
     * @returns {boolean} - Success status
     */
    push(element) {
        if (this.items.length >= this.maxSize) {
            throw new Error('Stack overflow: Maximum size reached');
        }
        
        if (element === undefined || element === null || element === '') {
            throw new Error('Invalid element: Cannot push empty value');
        }
        
        this.items.push(element);
        return true;
    }

    /**
     * Remove and return the top element from the stack
     * @returns {*} - The popped element
     */
    pop() {
        if (this.isEmpty()) {
            throw new Error('Stack underflow: Cannot pop from empty stack');
        }
        
        return this.items.pop();
    }

    /**
     * Return the top element without removing it
     * @returns {*} - The top element
     */
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        
        return this.items[this.items.length - 1];
    }

    /**
     * Check if the stack is empty
     * @returns {boolean} - True if empty
     */
    isEmpty() {
        return this.items.length === 0;
    }

    /**
     * Get the size of the stack
     * @returns {number} - Number of elements
     */
    size() {
        return this.items.length;
    }

    /**
     * Clear all elements from the stack
     */
    clear() {
        this.items = [];
    }

    /**
     * Convert stack to array (bottom to top)
     * @returns {Array} - Array representation
     */
    toArray() {
        return [...this.items];
    }

    /**
     * Get string representation of the stack
     * @returns {string} - String representation
     */
    toString() {
        return this.items.join(' <- ');
    }

    /**
     * Check if stack contains an element
     * @param {*} element - Element to search for
     * @returns {boolean} - True if found
     */
    contains(element) {
        return this.items.includes(element);
    }

    /**
     * Get element at specific index (0 = bottom, -1 = top)
     * @param {number} index - Index position
     * @returns {*} - Element at index
     */
    at(index) {
        if (index < 0) {
            return this.items[this.items.length + index];
        }
        return this.items[index];
    }

    /**
     * Get the maximum capacity of the stack
     * @returns {number} - Maximum size
     */
    getMaxSize() {
        return this.maxSize;
    }

    /**
     * Set the maximum capacity of the stack
     * @param {number} size - New maximum size
     */
    setMaxSize(size) {
        if (size < 1) {
            throw new Error('Invalid size: Maximum size must be at least 1');
        }
        
        this.maxSize = size;
        
        // Trim stack if it exceeds new max size
        if (this.items.length > size) {
            this.items = this.items.slice(-size);
        }
    }

    /**
     * Check if stack is full
     * @returns {boolean} - True if full
     */
    isFull() {
        return this.items.length >= this.maxSize;
    }

    /**
     * Get remaining capacity
     * @returns {number} - Number of elements that can still be added
     */
    getRemainingCapacity() {
        return this.maxSize - this.items.length;
    }

    /**
     * Create a copy of the stack
     * @returns {Stack} - New stack instance with same elements
     */
    clone() {
        const newStack = new Stack();
        newStack.maxSize = this.maxSize;
        newStack.items = [...this.items];
        return newStack;
    }

    /**
     * Reverse the order of elements in the stack
     */
    reverse() {
        this.items.reverse();
    }

    /**
     * Search for an element and return its position from the top (0-based)
     * @param {*} element - Element to search for
     * @returns {number} - Position from top, -1 if not found
     */
    search(element) {
        for (let i = this.items.length - 1; i >= 0; i--) {
            if (this.items[i] === element) {
                return this.items.length - 1 - i;
            }
        }
        return -1;
    }

    /**
     * Get stack statistics
     * @returns {Object} - Statistics object
     */
    getStats() {
        return {
            size: this.size(),
            maxSize: this.maxSize,
            isEmpty: this.isEmpty(),
            isFull: this.isFull(),
            remainingCapacity: this.getRemainingCapacity(),
            top: this.peek(),
            bottom: this.items.length > 0 ? this.items[0] : null
        };
    }

    /**
     * Validate stack integrity
     * @returns {boolean} - True if stack is valid
     */
    isValid() {
        return Array.isArray(this.items) && 
               this.items.length <= this.maxSize && 
               this.maxSize > 0;
    }

    /**
     * Iterator to make stack iterable (from top to bottom)
     */
    *[Symbol.iterator]() {
        for (let i = this.items.length - 1; i >= 0; i--) {
            yield this.items[i];
        }
    }

    /**
     * Convert to JSON representation
     * @returns {Object} - JSON object
     */
    toJSON() {
        return {
            type: 'Stack',
            items: this.items,
            maxSize: this.maxSize,
            size: this.size(),
            top: this.peek()
        };
    }

    /**
     * Create Stack from JSON representation
     * @param {Object} json - JSON object
     * @returns {Stack} - New Stack instance
     */
    static fromJSON(json) {
        if (!json || json.type !== 'Stack') {
            throw new Error('Invalid JSON: Not a Stack representation');
        }
        
        const stack = new Stack();
        stack.maxSize = json.maxSize || 10;
        stack.items = json.items || [];
        
        return stack;
    }

    /**
     * Merge two stacks (other stack's elements go on top)
     * @param {Stack} other - Another stack to merge
     * @returns {Stack} - New merged stack
     */
    merge(other) {
        if (!(other instanceof Stack)) {
            throw new Error('Invalid parameter: Expected Stack instance');
        }
        
        const merged = this.clone();
        const otherArray = other.toArray();
        
        for (const item of otherArray) {
            if (!merged.isFull()) {
                merged.push(item);
            } else {
                break;
            }
        }
        
        return merged;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Stack;
} else if (typeof window !== 'undefined') {
    window.Stack = Stack;
}