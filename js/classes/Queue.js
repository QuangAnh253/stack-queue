/**
 * Queue Data Structure Implementation
 * FIFO - First In, First Out
 * 
 * @author Your Name
 * @version 1.0.0
 */

class Queue {
    /**
     * Initialize empty queue
     */
    constructor() {
        this.items = [];
        this.maxSize = 50; // Prevent memory issues in demo
    }

    /**
     * Add element to rear of queue
     * @param {*} item - Element to add
     * @returns {boolean} - Success status
     */
    enqueue(item) {
        if (this.size() >= this.maxSize) {
            throw new Error(`Queue overflow! Maximum size is ${this.maxSize}`);
        }
        
        this.items.push(item);
        return true;
    }

    /**
     * Remove and return front element
     * @returns {*} - Front element or null if empty
     */
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift();
    }

    /**
     * Return front element without removing it
     * @returns {*} - Front element or null if empty
     */
    front() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[0];
    }

    /**
     * Return rear element without removing it
     * @returns {*} - Rear element or null if empty
     */
    rear() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[this.items.length - 1];
    }

    /**
     * Check if queue is empty
     * @returns {boolean} - True if empty
     */
    isEmpty() {
        return this.items.length === 0;
    }

    /**
     * Get number of elements in queue
     * @returns {number} - Size of queue
     */
    size() {
        return this.items.length;
    }

    /**
     * Remove all elements from queue
     */
    clear() {
        this.items = [];
    }

    /**
     * Get array copy of queue items (for visualization)
     * @returns {Array} - Copy of queue items
     */
    toArray() {
        return [...this.items];
    }

    /**
     * Convert queue to string representation
     * @returns {string} - String representation
     */
    toString() {
        if (this.isEmpty()) {
            return 'Queue: []';
        }
        return `Queue: front -> [${this.items.join(', ')}] <- rear`;
    }

    /**
     * Search for element in queue
     * @param {*} item - Element to search for
     * @returns {number} - Index of element, -1 if not found
     */
    search(item) {
        return this.items.indexOf(item);
    }

    /**
     * Check if queue contains element
     * @param {*} item - Element to check
     * @returns {boolean} - True if contains element
     */
    contains(item) {
        return this.items.includes(item);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Queue;
}