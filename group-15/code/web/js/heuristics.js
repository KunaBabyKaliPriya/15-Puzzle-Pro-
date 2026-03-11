/**
 * heuristics.js
 * 15 Puzzle Pro - Distance and Heuristics
 * Author: Hrithikesh
 * Date: March 2026
 * Description: Distance calculation methods (Manhattan Distance) used by UI scoring and A* / Greedy AI.
 */

// Calculate Manhattan Distance for the entire board
function calculateManhattanDistance(state, size) {
    let distance = 0;
    for (let i = 0; i < state.length; i++) {
        const value = state[i];
        if (value !== 0) {
            // Target position (1-based index mapped to 0-based grid)
            const targetRow = Math.floor((value - 1) / size);
            const targetCol = (value - 1) % size;

            // Current position
            const currentRow = Math.floor(i / size);
            const currentCol = i % size;

            distance += Math.abs(targetRow - currentRow) + Math.abs(targetCol - currentCol);
        }
    }
    return distance;
}

// Check if array is already solved (used by all search algorithms)
function isStateSolved(state, size) {
    for (let i = 0; i < state.length - 1; i++) {
        if (state[i] !== i + 1) return false;
    }
    return state[state.length - 1] === 0;
}
