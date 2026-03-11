const fs = require('fs');
const path = require('path');

// 1. Mock DOM
global.document = {
    getElementById: function () {
        return { style: { setProperty: function () { } }, innerHTML: '', appendChild: function () { }, className: '' };
    },
    createElement: function () {
        return { className: '', textContent: '', addEventListener: function () { } };
    }
};

// 2. Read source code
const utilsCode = fs.readFileSync(path.join(__dirname, 'js', 'utils.js'), 'utf8');
const gameCode = fs.readFileSync(path.join(__dirname, 'js', 'game.js'), 'utf8');

// 3. Define Tests
const testCode = `
console.log("=== Running Utility Tests ===");
let passed = 0;
let failed = 0;

function assertEqual(actual, expected, testName) {
    if (JSON.stringify(actual) === JSON.stringify(expected)) {
        console.log("[PASS] " + testName);
        passed++;
    } else {
        console.error("[FAIL] " + testName + " (Expected " + JSON.stringify(expected) + ", got " + JSON.stringify(actual) + ")");
        failed++;
    }
}

try {
    const arr = [1, 2, 3];
    swap(arr, 0, 2);
    assertEqual(arr, [3, 2, 1], "swap()");

    assertEqual(formatTime(0), "00:00", "formatTime(0)");
    assertEqual(formatTime(65), "01:05", "formatTime(65)");

    assertEqual(getSolvedState(3), [1, 2, 3, 4, 5, 6, 7, 8, 0], "getSolvedState(3)");
    assertEqual(isSolvable([1, 2, 3, 4, 5, 6, 7, 8, 0], 3), true, "isSolvable(solved 3x3)");
    assertEqual(isSolvable([1, 2, 3, 4, 5, 6, 8, 7, 0], 3), false, "isSolvable(unsolvable 3x3)");

    const state = [1, 2, 3];
    const cloned = cloneState(state);
    assertEqual(cloned, [1, 2, 3], "cloneState()");

    console.log("\\n=== Running Game Logic Tests ===");
    const game = new PuzzleGame('test-board', 3);
    assertEqual(game.size, 3, "PuzzleGame size");
    assertEqual(game.moves, 0, "PuzzleGame moves");
    
    game.state = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    const validMoves = game.getValidMoves(8);
    assertEqual(validMoves, [5, 7], "validMoves from 8 in 3x3");

    game.move(5);
    assertEqual(game.moves, 1, "move() increments moves");
    assertEqual(game.state[8], 6, "move() moves tile");

    game.undo();
    assertEqual(game.moves, 0, "undo() decrements moves");
    assertEqual(game.state[5], 6, "undo() reverts state");
    
} catch (e) {
    console.error("Test execution failed:", e.stack);
    failed++;
}

console.log("\\n=== Test Summary ===");
console.log(passed + " passed, " + failed + " failed.");
if (failed > 0) process.exit(1);
`;

// 4. Run Everything in a Single Eval
try {
    eval(utilsCode + '\n' + gameCode + '\n' + testCode);
} catch (e) {
    console.error("Failed to run code:", e.stack);
    process.exit(1);
}
