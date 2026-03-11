/**
 * ai_greedy.js
 * 15 Puzzle Pro - Level 1 AI: Greedy Best-First Search
 * Author: Hrithikesh
 * Date: March 2026
 * Description: Looks at immediate valid moves and picks the one with the lowest Manhattan Distance. 
 *              Not optimal, but very fast and gives a "medium" challenge as it gets stuck in local minima.
 */

class GreedyAI {
    static getNextMove(puzzleObj) {
        const state = puzzleObj.state;
        const size = puzzleObj.size;
        const emptyIdx = state.indexOf(0);
        const validMoves = puzzleObj.getValidMoves(emptyIdx);

        let bestMove = -1;
        let minDistance = Infinity;

        // Prevent immediate backtracking (1-step memory)
        let lastMoveIdx = -1;
        if (puzzleObj.history.length > 0) {
            lastMoveIdx = puzzleObj.history[puzzleObj.history.length - 1].emptyIndex;
        }

        // Shuffle valid moves to add some randomness when heuristics are tied
        validMoves.sort(() => Math.random() - 0.5);

        for (const moveIdx of validMoves) {
            // Skip immediate reverse move if possible
            if (moveIdx === lastMoveIdx && validMoves.length > 1) {
                continue;
            }

            // Simulate move
            const testState = [...state];
            swap(testState, moveIdx, emptyIdx);

            const distance = calculateManhattanDistance(testState, size);

            if (distance < minDistance) {
                minDistance = distance;
                bestMove = moveIdx;
            }
        }

        // If all moves we checked were backtracks (shouldn't happen with length > 1, but fallback)
        if (bestMove === -1 && validMoves.length > 0) {
            bestMove = validMoves[0];
        }

        return bestMove;
    }
}
