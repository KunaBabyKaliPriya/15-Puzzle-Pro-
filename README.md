🧩 15 Puzzle Pro

An interactive web-based implementation of the classic sliding puzzle problem, enhanced with AI solving algorithms, heuristic evaluation, and scoring mechanisms.

The puzzle consists of numbered tiles arranged in an N × N grid with one empty space. The objective is to rearrange the tiles into ascending order by sliding them into the empty position.

This project demonstrates core computer science concepts such as:

State-space search
Heuristic evaluation
Algorithmic complexity
Data structure design
Artificial Intelligence search algorithms

---

🚀 Features

Interactive sliding puzzle board
Randomized solvable puzzle generation
Undo functionality
Real-time scoring system
Manhattan Distance heuristic evaluation
AI-based puzzle solving
Multiple solving algorithms

---

🛠️ Technologies Used

  HTML
  CSS
  JavaScript
  DOM Manipulation
  Heuristic Search Algorithms

---

📂 Project Structure

```
group-15/
│
├── code/
│   └── web/
│       ├── game.js        # Game logic and board management
│       ├── heuristics.js  # Manhattan Distance heuristic
│       ├── utils.js       # Utility functions and solvability checks
│       ├── ui.js          # UI handling and scoring system
│       ├── ai_astar.js    # A* Search algorithm
│       ├── ai_greedy.js   # Greedy Best First Search
│       ├── ai_divide.js   # Divide and Conquer solver
│       ├── index.html
│       ├── style.css
│
└── README.md
```

---

🧠 System Architecture

The system is modularly designed with different components handling separate responsibilities.

| Module          | Responsibility                                |
| --------------- | --------------------------------------------- |
| `game.js`       | Board state management, moves, undo system    |
| `utils.js`      | Mathematical utilities and solvability checks |
| `heuristics.js` | Heuristic functions (Manhattan Distance)      |
| `ui.js`         | Rendering and scoring system                  |
| `ai_*.js`       | Artificial intelligence solving algorithms    |

---

🎮 How the Game Works

1. The puzzle board is represented as a **1-D array of size N²**.
2. The value **0 represents the empty tile**.
3. Tiles adjacent to the empty space can move.
4. The goal is to arrange numbers **1 → 15 in order**.

---

⚙️ Game Algorithms

Manhattan Distance Heuristic

The heuristic estimates how far the puzzle is from the solution by calculating:

```
distance += |current_row - target_row| + |current_column - target_column|
```

Time Complexity: **O(T)**
Space Complexity: **O(1)**

---

🤖 Artificial Intelligence Solvers

A* Search Algorithm

Evaluation Function:

```
f(n) = g(n) + h(n)
```

 `g(n)` → cost to reach current state
`h(n)` → heuristic estimate (Manhattan Distance)

Time Complexity: **O(b^d)**
Space Complexity: **O(b^d)**

---

Greedy Best First Search

Uses only the heuristic function:

```
f(n) = h(n)
```

Selects the node that appears closest to the goal.

Time Complexity: **O(b^d)**
Space Complexity: **O(b^d)**

---

Divide and Conquer Solver

Solves the puzzle by fixing rows and columns sequentially, reducing the puzzle dimension step by step.

Time Complexity: **O(T³)**
Space Complexity: **O(T)**

---

📊 Complexity Summary

| Component          | Time Complexity | Space Complexity |
| ------------------ | --------------- | ---------------- |
| Shuffle            | O(M)            | O(T)             |
| Valid Moves        | O(1)            | O(1)             |
| Move Execution     | O(T)            | O(KT)            |
| Rendering          | O(T)            | O(T)             |
| Solvability Check  | O(T²)           | O(T)             |
| Manhattan Distance | O(T)            | O(1)             |
| A* Search          | O(b^d)          | O(b^d)           |
| Greedy Search      | O(b^d)          | O(b^d)           |
| Divide & Conquer   | O(T³)           | O(T)             |

---

🏆 Scoring System

| Action                    | Score |
| ------------------------- | ----- |
| Move closer to solution   | +20   |
| Move away or sideways     | -10   |
| Undo action               | -15   |
| Time penalty (per second) | -2    |

---

▶️ How to Run the Project

1. Clone the repository

```
git clone https://github.com/KunaBabyKaliPriya/15-Puzzle-Pro-.git
```

2. Open the project folder

3. Run the game by opening:

```
index.html
```

in any web browser.

---

🎯 Learning Outcomes

This project demonstrates:

Implementation of state-space search problems
Heuristic based problem solving
Use of AI algorithms in interactive systems
Algorithm complexity analysis
Web-based interactive UI design

---

👨‍💻 Contributors

Group 15

Kuna Baby Kali Priya
Reddy Srija
K.S.Abhigna
G.Hrithikesh
S.Lalitesh

---

📄 License

This project is created for **educational and academic purposes**.
