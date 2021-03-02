
export default class BinaryHeap {
    constructor() {
        this.values = [];
    }
    length() {
        return this.values.length;
    }
    add(element) {
        this.values.push(element);
        let index = this.values.length - 1;
        const current = this.values[index];

        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            let parent = this.values[parentIndex];

            const parentPriority = parent[parent.length - 2];
            const currentPriority = current[current.length - 2];

            if (parentPriority > currentPriority) {
                this.values[parentIndex] = current;
                this.values[index] = parent;
                index = parentIndex;
            } else break;
        }
    }
    remove(node) {
        for (let i = 0; i < this.values.length; i++) {
            const current = this.values[i];
            if (current[0] === node[0] && current[1] === node[1]) {
                this.values.splice(i,1);
            }
        }
        return false;
    }
    get(node) {
        for (let i = 0; i < this.values.length; i++) {
            const current = this.values[i];
            if (current[0] === node[0] && current[1] === node[1]) {
                return current;
            }
        }
        return null;
    }
    contains(node) {
        for (let i = 0; i < this.values.length; i++) {
            const current = this.values[i];
            if (current[0] === node[0] && current[1] === node[1]) {
                return true;
            }
        }
        return false;
    }
    peekMin() {
        if (this.values.length > 0) return this.values[0];
        return -1;
    }
    removeMin() {
        const min = this.values[0];
        const end = this.values.pop();
        this.values[0] = end;

        let index = 0;
        const length = this.values.length;
        const current = this.values[0];
        while (true) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let leftChild, rightChild;
            let temp = null;

            let leftPriority,rightPriority;
            let currentPriority = current[current.length - 2];

            if (leftChildIndex < length) {
                leftChild = this.values[leftChildIndex];
                leftPriority = leftChild[leftChild.length - 2];
                currentPriority = current[current.length - 2];
                if (leftPriority < currentPriority) temp = leftChildIndex;
            }
            if (rightChildIndex < length) {
                rightChild = this.values[rightChildIndex];
                leftPriority = leftChild[leftChild.length - 2];
                rightPriority = rightChild[rightChild.length - 2]; 
                if ((temp === null && rightPriority < currentPriority) || (temp !== null && rightPriority < leftPriority)){
                    temp = rightChildIndex;
                }
            }

            if (temp === null) break;
            this.values[index] = this.values[temp];
            this.values[temp] = current;
            index = temp;
        }

        return min;
    }
}