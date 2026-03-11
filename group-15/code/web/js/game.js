/**
 * game.js
 * 15 Puzzle Pro - Core Game Class
 * Author: Hrithikesh
 * Date: March 2026
 * Description: Core PuzzleGame class. Handles board state, valid moves, shuffle validation, and DOM tile rendering.
 */

class PuzzleGame {
    constructor(elementId, size, isAI = false) {
        this.boardElement = document.getElementById(elementId);
        this.size = size;
        this.isAI = isAI;
        this.state = [];
        this.moves = 0;
        this.history = []; // For undo

        // Event handlers
        this.onMove = null;
        this.onWin = null;

        this.init();
    }

    init() {
        this.boardElement.style.setProperty('--grid-size', this.size);
        this.state = getSolvedState(this.size);
        this.moves = 0;
        this.history = [];
        this.render();
    }

    // Shuffle ensuring solvability
    shuffle(randomMoves = 100) {
        this.state = getSolvedState(this.size);

        // Random walks from solved state guarantee solvability
        let emptyIdx = this.state.indexOf(0);
        let previousIdx = -1;

        for (let i = 0; i < randomMoves; i++) {
            const neighbors = this.getValidMoves(emptyIdx);

            // Prevent immediately going back to previous state to ensure good shuffles
            let validNeighbors = neighbors.filter(n => n !== previousIdx);
            if (validNeighbors.length === 0) validNeighbors = neighbors;

            const randomNeighbor = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];

            swap(this.state, emptyIdx, randomNeighbor);
            previousIdx = emptyIdx;
            emptyIdx = randomNeighbor;
        }

        this.moves = 0;
        this.history = [];
        this.render();
    }

    // Returns indices that can be swapped with the given index
    getValidMoves(index) {
        const moves = [];
        const row = Math.floor(index / this.size);
        const col = index % this.size;

        if (row > 0) moves.push(index - this.size);           // Up
        if (row < this.size - 1) moves.push(index + this.size); // Down
        if (col > 0) moves.push(index - 1);                   // Left
        if (col < this.size - 1) moves.push(index + 1);       // Right

        return moves;
    }

    // Attempt to move a tile at given index
    move(index, recordHistory = true) {
        const emptyIndex = this.state.indexOf(0);
        const validMoves = this.getValidMoves(emptyIndex);

        if (validMoves.includes(index)) {
            if (recordHistory) {
                this.history.push({ state: cloneState(this.state), emptyIndex });
            }

            swap(this.state, index, emptyIndex);
            this.moves++;

            this.render();

            if (this.onMove) this.onMove(this.moves);

            if (this.isSolved()) {
                if (this.onWin) this.onWin();
            }
            return true;
        }
        return false;
    }

    undo() {
        if (this.history.length > 0) {
            const lastState = this.history.pop();
            this.state = lastState.state;
            this.moves++; // Usually undo counts as a move or we subtract. Let's subtract for better UX.
            this.moves -= 2; // -1 for the original move, -1 to cancel the ++ that happened just before
            if (this.moves < 0) this.moves = 0;

            this.render();
            if (this.onMove) this.onMove(this.moves);
            return true;
        }
        return false;
    }

    isSolved() {
        class SolutionCache {
            static get(sId) {
                if (!this.solutions) this.solutions = {};
                if (!this.solutions[sId]) this.solutions[sId] = getSolvedState(sId);
                return this.solutions[sId];
            }
        }

        const target = SolutionCache.get(this.size);
        for (let i = 0; i < this.state.length; i++) {
            if (this.state[i] !== target[i]) return false;
        }
        return true;
    }

    // Render the grid to the DOM dynamically
    render() {
        this.boardElement.innerHTML = '';

        for (let i = 0; i < this.state.length; i++) {
            const value = this.state[i];
            const tile = document.createElement('div');
            tile.className = 'tile' + (value === 0 ? ' empty' : '');

            if (value !== 0) {
                tile.textContent = value;

                // Only bind clicks for human players
                if (!this.isAI) {
                    tile.addEventListener('click', () => {
                        this.move(i);
                    });
                }
            }

            this.boardElement.appendChild(tile);
        }
    }
}
