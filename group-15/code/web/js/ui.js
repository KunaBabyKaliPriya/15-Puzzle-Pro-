/**
 * ui.js
 * 15 Puzzle Pro - User Interface Controller
 * Author: Hrithikesh
 * Date: March 2026
 * Description: Handles UI interactions, game modes, timer, and main game loop coordination.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- State variables ---
    let currentMode = 'single'; // 'single', 'pvp', 'pvai'
    let currentSize = 4;

    let player1 = null;

    let globalTimerInterval = null;
    let secondsElapsed = 0;
    let gameActive = false;
    let isHumanTurn = true;
    let humanScore = 0;
    let aiScore = 0;
    let humanMoves = 0;
    let lastKnownTotalMoves = 0;

    // --- DOM Elements ---
    const screens = {
        welcome: document.getElementById('screen-welcome'),
        modes: document.getElementById('screen-modes'),
        diff: document.getElementById('screen-diff'),
        loading: document.getElementById('screen-loading'),
        game: document.getElementById('screen-game')
    };

    const btnStartGame = document.getElementById('btn-start-game');
    const loadingText = document.getElementById('loading-text');

    const modeBtns = document.querySelectorAll('.mode-btn');
    const diffBtns = document.querySelectorAll('.diff-btn');

    const p1Area = document.getElementById('player1-area');
    const aiControls = document.getElementById('ai-controls');

    const p1MovesEl = document.getElementById('p1-moves');
    const p1ScoreEl = document.getElementById('p1-score');
    const p2ScoreEl = document.getElementById('p2-score');

    const p1ScoreLabel = document.getElementById('p1-score-label');
    const p2ScoreLabel = document.getElementById('p2-score-label');

    const turnBox = document.getElementById('turn-box');
    const currentTurnEl = document.getElementById('current-turn');
    const p2ScoreBox = document.getElementById('p2-score-box');

    const timerEl = document.getElementById('global-timer');
    const messageLog = document.getElementById('message-log');

    const btnShuffle = document.getElementById('btn-shuffle-p1');
    const btnUndo = document.getElementById('btn-undo-p1');

    const victoryModal = document.getElementById('victory-modal');
    const btnPlayAgain = document.getElementById('btn-play-again');
    const victoryTitle = document.getElementById('victory-title');
    const victoryStats = document.getElementById('victory-stats');


    // --- Screen Navigation ---
    function showScreen(screenName, customLoadingText = "Loading...") {
        // Hide all screens
        Object.values(screens).forEach(s => s.classList.add('hidden'));

        // Show target screen
        if (screenName === 'loading') {
            loadingText.textContent = customLoadingText;
            screens.loading.classList.remove('hidden');
        } else {
            screens[screenName].classList.remove('hidden');
        }
    }

    function transitionTo(targetScreen, delay = 800, text = "Loading...") {
        showScreen('loading', text);
        setTimeout(() => {
            showScreen(targetScreen);
        }, delay);
    }

    // --- Initialization ---
    function initApp() {
        setupListeners();
        // Start at welcome screen
        showScreen('welcome');
    }

    function createNewGame() {
        stopTimer();
        secondsElapsed = 0;
        updateTimerDisplay();
        gameActive = false;

        isHumanTurn = true;
        humanScore = 0;
        aiScore = 0;
        humanMoves = 0;
        lastKnownTotalMoves = 0;

        // Reset UI metrics
        p1MovesEl.textContent = '0';
        p1ScoreEl.textContent = '0';
        if (p2ScoreEl) p2ScoreEl.textContent = '0';

        // Set Dynamic Labels
        if (currentMode === 'single') {
            p1ScoreLabel.textContent = "SCORE";
            p2ScoreBox.classList.add('hidden');
            aiControls.classList.add('hidden');
            turnBox.classList.add('hidden');
        } else if (currentMode === 'pvp') {
            p1ScoreLabel.textContent = "P1 SCORE";
            p2ScoreLabel.textContent = "P2 SCORE";
            p2ScoreBox.classList.remove('hidden');
            aiControls.classList.add('hidden');
            turnBox.classList.remove('hidden');
            currentTurnEl.textContent = 'Player 1';
            currentTurnEl.style.color = '';
        } else if (currentMode === 'pvai') {
            p1ScoreLabel.textContent = "YOUR SCORE";
            p2ScoreLabel.textContent = "AI SCORE";
            p2ScoreBox.classList.remove('hidden');
            aiControls.classList.remove('hidden');
            turnBox.classList.remove('hidden');
            currentTurnEl.textContent = 'Human';
            currentTurnEl.style.color = '';
        }

        btnUndo.disabled = true;

        // Instantiate game object
        player1 = new PuzzleGame('board1', currentSize, false);

        player1.onMove = (moves) => {
            // Guard clause to ignore clicks if it's the AI's turn
            if (currentMode === 'pvai' && !isHumanTurn && gameActive) {
                lastKnownTotalMoves = moves;
                return; // Human cannot move during AI turn
            }

            if (!gameActive && moves > 0) {
                startGame();
            }

            // Detect Undo
            if (moves < lastKnownTotalMoves) {
                lastKnownTotalMoves = moves;
                humanMoves = Math.max(0, humanMoves - 1); // Decrease displayed moves
                p1MovesEl.textContent = humanMoves;

                let undoPenalty = 15;

                if (currentMode === 'pvp') {
                    // Turn toggled immediately after move, so penalize the person whose turn it IS NOT right now
                    if (!isHumanTurn) {
                        humanScore -= undoPenalty;
                        p1ScoreEl.textContent = humanScore;
                    } else {
                        aiScore -= undoPenalty;
                        if (p2ScoreEl) p2ScoreEl.textContent = aiScore;
                    }
                    isHumanTurn = !isHumanTurn; // revert turn
                    currentTurnEl.textContent = isHumanTurn ? 'Player 1' : 'Player 2';
                    currentTurnEl.style.color = isHumanTurn ? '' : 'blue';
                } else {
                    humanScore -= undoPenalty;
                    p1ScoreEl.textContent = humanScore;
                }
                btnUndo.disabled = player1.history.length === 0;
                return; // skip normal scoring
            }

            lastKnownTotalMoves = moves;
            let scoreChange = 10;

            if (player1.history.length > 0) {
                let prevDist = calculateManhattanDistance(player1.history[player1.history.length - 1].state, currentSize);
                let currDist = calculateManhattanDistance(player1.state, currentSize);
                scoreChange = (currDist < prevDist) ? 20 : -10;
            }

            if (currentMode === 'pvp') {
                if (isHumanTurn) { // Player 1 Move
                    humanMoves++;
                    humanScore += scoreChange;
                    p1MovesEl.textContent = humanMoves;
                    p1ScoreEl.textContent = humanScore;
                } else { // Player 2 Move
                    humanMoves++; // Shared total moves
                    aiScore += scoreChange;
                    if (p2ScoreEl) p2ScoreEl.textContent = aiScore;
                }

                // Hotseat PvP turn toggling
                isHumanTurn = !isHumanTurn;
                currentTurnEl.textContent = isHumanTurn ? 'Player 1' : 'Player 2';
                currentTurnEl.style.color = isHumanTurn ? '' : 'blue';
                btnUndo.disabled = player1.history.length === 0;

            } else if (isHumanTurn) { // Single or PvAI (Human move)
                humanMoves++;
                humanScore += scoreChange;
                p1MovesEl.textContent = humanMoves;
                p1ScoreEl.textContent = humanScore;
                btnUndo.disabled = player1.history.length === 0;

                if (currentMode === 'pvai') {
                    isHumanTurn = false;
                    currentTurnEl.textContent = 'AI (Thinking...)';
                    currentTurnEl.style.color = 'red';
                    btnUndo.disabled = true; // disable undo during AI turn
                    document.getElementById('board1').style.pointerEvents = 'none'; // Lock board
                    setTimeout(executeAITurn, 300); // Add a small delay for AI turn
                }
            }
        };

        player1.onWin = () => {
            // Let's decide winner based on WHO made the winning move
            let winnerName = 'Player 1';
            if (currentMode === 'pvai' && !isHumanTurn) {
                winnerName = 'AI';
            }
            handleWin(winnerName);
        };

        logMessage(`Ready to play ${currentSize}x${currentSize} mode!`);
    }

    // --- Game flow ---
    function startGame() {
        gameActive = true;
        startTimer();
        logMessage("Game started! Good luck.");
    }

    function handleWin(winnerName) {
        stopTimer();
        gameActive = false;

        // Apply Winning Bonus
        const baseScore = currentSize === 3 ? 1000 : (currentSize === 4 ? 5000 : 15000);
        let finalScore = humanScore + baseScore;
        let finalAIScore = aiScore + baseScore;

        if (winnerName === 'Player 1' || winnerName === 'You') {
            p1ScoreEl.textContent = finalScore;
            victoryTitle.textContent = currentMode === 'single' ? "Puzzle Solved!" : "You Win!";
            victoryTitle.style.color = "var(--success-color)";
            victoryStats.textContent = `Moves: ${humanMoves} | Time: ${formatTime(secondsElapsed)} | Score: ${finalScore}`;
        } else {
            victoryTitle.textContent = `${winnerName} Wins!`;
            victoryTitle.style.color = "var(--danger-color)"; // Red for loss
            finalScore = 0; // AI wins, you get 0 (or keep the finalScore minus baseScore)
            if (p2ScoreEl) p2ScoreEl.textContent = finalAIScore;

            victoryStats.textContent = `Moves: ${humanMoves} | Time: ${formatTime(secondsElapsed)} | AI Score: ${finalAIScore}`;
        }

        victoryModal.classList.remove('hidden');
    }

    function triggerShuffle() {
        player1.shuffle();

        stopTimer();
        secondsElapsed = 0;
        updateTimerDisplay();
        gameActive = false;

        isHumanTurn = true;
        humanScore = 0;
        aiScore = 0;
        humanMoves = 0;
        lastKnownTotalMoves = 0;

        btnUndo.disabled = true;
        document.getElementById('board1').style.pointerEvents = 'auto';
        p1MovesEl.textContent = '0';
        p1ScoreEl.textContent = '0';
        if (p2ScoreEl) p2ScoreEl.textContent = '0';
        currentTurnEl.textContent = currentMode === 'single' ? 'You' : 'Player 1';
        currentTurnEl.style.color = '';

        logMessage("Board shuffled. Make a move to start timer.");
    }

    // --- Timers & Logging ---
    function startTimer() {
        if (globalTimerInterval) clearInterval(globalTimerInterval);
        globalTimerInterval = setInterval(() => {
            secondsElapsed++;
            updateTimerDisplay();

            // Negative marking over time: only deduct from active player
            if (currentMode === 'pvp' || currentMode === 'pvai') {
                if (isHumanTurn) {
                    if (humanScore > -1000) humanScore -= 2;
                    p1ScoreEl.textContent = humanScore;
                } else {
                    if (aiScore > -1000) aiScore -= 2;
                    if (p2ScoreEl) p2ScoreEl.textContent = aiScore;
                }
            } else { // Single player
                if (humanScore > -1000) humanScore -= 2;
                p1ScoreEl.textContent = humanScore;
            }

            // Auto lose if taking too long (e.g 10 minutes)
            if (secondsElapsed > 600) {
                handleWin("Nobody (Timeout)");
            }
        }, 1000);
    }

    function stopTimer() {
        if (globalTimerInterval) {
            clearInterval(globalTimerInterval);
            globalTimerInterval = null;
        }
    }

    function updateTimerDisplay() {
        timerEl.textContent = formatTime(secondsElapsed);
    }

    function logMessage(msg) {
        messageLog.textContent = msg;
    }

    // --- Real AI loop ---
    function executeAITurn() {
        if (!gameActive || player1.isSolved()) {
            return;
        }

        const strategySelect = document.getElementById('ai-strategy-select');
        const strategy = strategySelect.value;
        currentTurnEl.textContent = `AI (${strategy})...`;

        // Allow UI to update before heavy computation
        setTimeout(() => {
            const startTime = performance.now();
            let nextMoveIdx = -1;

            try {
                switch (strategy) {
                    case 'greedy':
                        nextMoveIdx = GreedyAI.getNextMove(player1);
                        break;
                    case 'dnc':
                        nextMoveIdx = DnCAI.getNextMove(player1);
                        break;
                    case 'astar':
                        nextMoveIdx = AStarAI.getNextMove(player1);
                        break;
                }
            } catch (e) {
                console.error("AI error:", e);
                // Fallback to random if AI crashes
                const valid = player1.getValidMoves(player1.state.indexOf(0));
                nextMoveIdx = valid[Math.floor(Math.random() * valid.length)];
            }

            if (nextMoveIdx !== -1) {
                // Record history for AI moves too so human can undo
                player1.move(nextMoveIdx, true);

                let scoreChange = 10;
                if (player1.history.length > 0) {
                    let prevDist = calculateManhattanDistance(player1.history[player1.history.length - 1].state, currentSize);
                    let currDist = calculateManhattanDistance(player1.state, currentSize);
                    scoreChange = (currDist < prevDist) ? 20 : -10;
                }

                aiScore += scoreChange;
                if (p2ScoreEl) p2ScoreEl.textContent = aiScore;
            }

            if (!player1.isSolved()) {
                isHumanTurn = true;
                currentTurnEl.textContent = 'Human';
                currentTurnEl.style.color = '';
                btnUndo.disabled = player1.history.length === 0;
                document.getElementById('board1').style.pointerEvents = 'auto'; // Unlock board
            }
        }, 30); // Small delay to unblock main thread briefly
    }

    // --- Events Setup ---
    function setupListeners() {
        // Welcome Screen
        btnStartGame.addEventListener('click', () => {
            transitionTo('modes', 300, ""); // Fast transition
        });

        // Mode Selector
        modeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                modeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentMode = btn.dataset.mode;
                transitionTo('diff', 600, "Loading Difficulties...");
            });
        });

        // Difficulty Selector
        diffBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                diffBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentSize = parseInt(btn.dataset.size);

                showScreen('loading', "Preparing Board...");
                setTimeout(() => {
                    createNewGame();
                    showScreen('game');
                }, 1000);
            });
        });

        // Game Actions
        btnShuffle.addEventListener('click', triggerShuffle);

        btnUndo.addEventListener('click', () => {
            if (gameActive) player1.undo();
        });

        // Modals
        btnPlayAgain.addEventListener('click', () => {
            victoryModal.classList.add('hidden');
            triggerShuffle();
        });
    }

    // Start automatically
    initApp();
});
