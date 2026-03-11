/**
 * utils.js
 * 15 Puzzle Pro - Utility Functions
 * Author: Hrithikesh
 * Date: March 2026
 * Description: Common utility functions for array grouping, solvability checks, and state cloning.
 */

// Swap two elements in an array
function swap(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

// Check if a puzzle state is solvable
// Inversion counting for NxN grids
function isSolvable(state, size) {
    let inversions = 0;
    const array = state.filter(val => val !== 0); // Remove empty tile

    for (let i = 0; i < array.length - 1; i++) {
        for (let j = i + 1; j < array.length; j++) {
            if (array[i] > array[j]) {
                inversions++;
            }
        }
    }

    // If grid size is odd (e.g., 3x3, 5x5)
    if (size % 2 !== 0) {
        return inversions % 2 === 0;
    } else {
        // If grid size is even (e.g., 4x4)
        const emptyIndex = state.indexOf(0);
        const blankRowFromBottom = size - Math.floor(emptyIndex / size);

        if (blankRowFromBottom % 2 !== 0) {
            return inversions % 2 === 0; // Blank on odd row from bottom
        } else {
            return inversions % 2 !== 0; // Blank on even row from bottom
        }
    }
}

// Format time in MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Generate the solved state array [1, 2, ..., N^2-1, 0]
function getSolvedState(size) {
    let state = [];
    for (let i = 1; i < size * size; i++) {
        state.push(i);
    }
    state.push(0); // 0 represents the empty tile
    return state;
}

// Deep copy an array
function cloneState(state) {
    return [...state];
}
