/**
 * ai_astar.js
 * 15 Puzzle Pro - Level 3 AI: A* Search
 * Author: Hrithikesh
 * Date: March 2026
 * Description: A* Search with Manhattan Distance Heuristic. Finds the optimal path for the board.
 */

class AStarNode {
    constructor(state, emptyIdx, g, h, parent, lastMove) {
        this.state = state;
        this.emptyIdx = emptyIdx;
        this.g = g; // Cost from start
        this.h = h; // Heuristic cost to goal
        this.f = g + h; // Total estimated cost
        this.parent = parent;
        this.lastMove = lastMove; // The move that got us here
    }
}

// Priority Queue implementation for A*
class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(element, priority) {
        this.elements.push({ element, priority });
        this.elements.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        return this.elements.shift().element;
    }

    isEmpty() {
        return this.elements.length === 0;
    }
}

class AStarAI {
    // Standard A* for the whole board
    static getNextMove(puzzleObj) {
        const path = this.findPath(puzzleObj.state, puzzleObj.size, 15); // Limit depth for performance
        if (path && path.length > 0) {
            return path[0]; // Return the first move in the optimal path
        }
        // Fallback to greedy if A* fails to find path in depth limit
        return GreedyAI.getNextMove(puzzleObj);
    }

    // Bounded A* for solving specific subgoals (used by D&C)
    static getNextMoveForSubgoal(puzzleObj, targetTiles) {
        // Modify heuristic to only care about targetTiles
        // For now, fallback to default A* with a very small depth limit to keep UI responsive
        return this.getNextMove(puzzleObj);
    }

    static findPath(startState, size, maxDepth = 20) {
        const startEmptyIdx = startState.indexOf(0);
        const startH = calculateManhattanDistance(startState, size);

        const startNode = new AStarNode(startState, startEmptyIdx, 0, startH, null, -1);

        const openSet = new PriorityQueue();
        openSet.enqueue(startNode, startNode.f);

        const closedSet = new Set();

        while (!openSet.isEmpty()) {
            const current = openSet.dequeue();

            // Goal check
            if (isStateSolved(current.state, size)) {
                return this.reconstructPath(current);
            }

            // Depth limit to prevent browser freeze
            if (current.g >= maxDepth) {
                continue;
            }

            const stateStr = current.state.toString();
            if (closedSet.has(stateStr)) continue;
            closedSet.add(stateStr);

            // Generate valid moves
            const row = Math.floor(current.emptyIdx / size);
            const col = current.emptyIdx % size;
            const validMoves = [];

            if (row > 0) validMoves.push(current.emptyIdx - size);
            if (row < size - 1) validMoves.push(current.emptyIdx + size);
            if (col > 0) validMoves.push(current.emptyIdx - 1);
            if (col < size - 1) validMoves.push(current.emptyIdx + 1);

            for (const moveIdx of validMoves) {
                // Don't undo immediate parent
                if (current.parent && moveIdx === current.parent.emptyIdx) continue;

                const nextState = [...current.state];
                swap(nextState, moveIdx, current.emptyIdx);

                const g = current.g + 1;
                const h = calculateManhattanDistance(nextState, size);
                const nextNode = new AStarNode(nextState, moveIdx, g, h, current, moveIdx);

                openSet.enqueue(nextNode, nextNode.f);
            }
        }

        return null; // No path found within limit
    }

    static reconstructPath(goalNode) {
        const path = [];
        let current = goalNode;
        while (current.parent !== null) {
            // Because the 'move' is defined as the index of the tile that gets swapped into the empty space.
            // When we go from parent to child, 'current.emptyIdx' is where the tile WAS in the parent state.
            path.push(current.emptyIdx);
            current = current.parent;
        }
        path.reverse();
        return path;
    }
}
