"use client";
import { useState, useEffect } from "react";
import "./sudoku.css";

// Helper functions

function generateFullBoard(): number[][] {
    // initialize an empty 9*9 board
    const board: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));
    return board;
}
function fillDiagonalBoxes(board: number[][]): void {
    for (let box = 0; box < 9; box += 3) {
        // Generate random numbers 1-9 for each 3*3 box
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        let index: number = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[box + i][box + j] = numbers[index++];
            }
        }
    }
}
function solveSudoku(board: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] == 0) {
                const numbers: number[] = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                for (const num of numbers) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board)) return true;
                        // backtrack
                        board[row][col] = 0;
                    }
                }
                return false; // no valid number found
            }
        }
    }
    return true; // board is complete
}
function isValid(board: number[][], row: number, col: number, num: number): boolean {
    // Check row and column
    for (let i = 0; i < 9; i++) {
        if (board[row][i] == num) return false; // row
        if (board[i][col] == num) return false; // column
    }
    // check 3x3 sub-matrix
    const startRow: number = row - (row % 3), startCol: number = col - (col % 3);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] == num) return false;
        }
    }
    return true;
}
function shuffle<T>(array: T[]): T[] {
    for (let i = 0; i < array.length - 1; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function createPuzzle(board: number[][], difficulty: string): number[][] {
    // Copy the complete board
    const puzzle = board.map(row => [...row]);
    // Determine ow many cells to remove based on difficulty
    const cellsToRemove: number = {
        easy: 40, // ~41 cells remain
        medium: 50, // ~31 cells remain
        hard: 55, // ~26 cells remain
        expert: 60 // ~21 cells remain
    }[difficulty] ?? 40;
    // Get all cell positions
    const positions: number[][] = [];
    for (let i = 0; i < 81; i++) {
        positions.push([Math.floor(i / 9), i % 9]);
    }
    // Shuffle positions
    shuffle(positions);
    // Try to remove each cell while ensuring unique solutions
    let removeCount: number = 0;
    for (const [row, col] of positions) {
        if (removeCount >= cellsToRemove) break;
        // Store the value before removing
        const temp: number = puzzle[row][col];
        puzzle[row][col] = 0;
        if (hasUniqueSolution(puzzle)) {
            removeCount++;
        } else {
            puzzle[row][col] = temp;
        }
    }
    return puzzle;
}
function hasUniqueSolution(puzzle: number[][]) {
    const solutions = [];
    function countSolutions(board: number[][]) {
        if (solutions.length > 1) return;
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            countSolutions(board);
                            board[row][col] = 0;
                            if (solutions.length > 1) return;
                        }
                    }
                    return; // no valid number for this cell
                }
            }
        }
        // Found a solution
        solutions.push(board.map(row => [...row]));
    }
    countSolutions(puzzle.map(row => [...row]));
    return solutions.length === 1;
}
function handleCellChange(board: number[][], row: number, col: number, value: number) {
    const tempBoard = board.map(row => [...row]);
    if (value <= 0 || value > 9 || isNaN(value)) value = 0;
    tempBoard[row][col] = value;
    return tempBoard;
}
export default function Sudoku() {
    // --- Existing State ---
    const [board, setBoard] = useState<number[][]>([]);
    const [solutionBoard, setSolutionBoard] = useState<number[][]>([]);
    const [initialBoard, setInitialBoard] = useState<number[][]>([]);
    const [gameStatus, setGameStatus] = useState<"Won" | "Playing" | "Lost">("Playing");    const [difficulty, setDifficulty] = useState<string>("easy"); // Changed default to match UI
    const [timer, setTimer] = useState(0);
    const [score, setScore] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // --- New State for UI ---
    const [selectedCell, setSelectedCell] = useState<{r: number, c: number} | null>(null);
    const [mistakes, setMistakes] = useState(0);

    const resetGame = (level: string) => {
        const newBoard = generateFullBoard();
        fillDiagonalBoxes(newBoard);
        solveSudoku(newBoard);
        setSolutionBoard(newBoard);
        const puzzleBoard = createPuzzle(newBoard, level);
        setBoard(puzzleBoard);
        setInitialBoard(puzzleBoard);
        setDifficulty(level);
        setTimer(0);
        setMistakes(0); // Reset mistakes
        setSelectedCell(null); // Clear selection
        setGameStatus("Playing");
    };

    // Initialization
    useEffect(() => {
        requestAnimationFrame(() => {
            resetGame("easy"); // Initialize with easy to match your screenshot
        });
    }, []);

    // Win check logic (Unchanged)
    useEffect(() => {
        const boardSize: number = board.length;
        let check: boolean = true;
        if (boardSize === 0) return;
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] !== solutionBoard[i][j]) {
                    check = false;
                    break;
                }
                if (!check) break;
            }
        }
        if (check) setGameStatus("Won");
        else setGameStatus("Playing");
    }, [board, solutionBoard]);

    // Timer Logic (Unchanged)
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (gameStatus === "Playing" && !isPaused && initialBoard.length > 0) {
            interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [gameStatus, isPaused, initialBoard]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // --- New Handler for Number Pad ---
    const handleNumberPadClick = (num: number) => {
        if (!selectedCell || gameStatus !== "Playing") return;
        const { r, c } = selectedCell;
        
        // Don't overwrite initial puzzle numbers
        if (initialBoard[r][c] !== 0) return;

        setBoard(prev => handleCellChange(prev, r, c, num));

        // Validation for mistakes counter
        if (num !== 0 && num !== solutionBoard[r][c]) {
            const newMistakeCount = mistakes + 1;
            setMistakes(newMistakeCount);

            // Check for Game Over condition
            if (newMistakeCount >= 3) {
                setGameStatus("Lost");
            } else {
                // If they haven't lost yet, wipe the wrong number after 3 seconds
                setTimeout(() => {
                    setBoard(prev => handleCellChange(prev, r, c, 0));
                }, 3000);
            }
        }
    };

    const handleErase = () => {
        // Prevent erasing if no cell is selected, or if the game is over
        if (!selectedCell || gameStatus !== "Playing") return;
        
        const { r, c } = selectedCell;
        
        // Prevent erasing the puzzle's starting numbers
        if (initialBoard[r][c] !== 0) return;

        // Reset the cell to 0 (empty)
        setBoard(prev => handleCellChange(prev, r, c, 0));
    };

    // --- Keyboard Support ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Do nothing if game is over or no cell is selected
            if (gameStatus !== "Playing" || !selectedCell) return;

            // Handle Numbers 1-9
            if (e.key >= '1' && e.key <= '9') {
                handleNumberPadClick(parseInt(e.key));
            }
            // Handle Erase (Backspace or Delete)
            else if (e.key === 'Backspace' || e.key === 'Delete') {
                handleErase();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        
        // Cleanup listener to prevent memory leaks
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedCell, gameStatus, handleNumberPadClick, handleErase]);

    if (initialBoard.length === 0) {
        return <div className="min-h-screen bg-background text-on-background flex items-center justify-center font-headline font-bold">Loading Kinetic Grid...</div>;
    }

    return (
        <div className="bg-background text-on-background font-body min-h-screen selection:bg-primary-container/30 pb-32">
            {/* Header */}
            <header className="bg-[#f8f5ff] top-0 z-50">
                <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
                    <span className="text-2xl font-black tracking-tight text-[#2a2b51] font-headline">Sudoku Kinetic</span>
                    <nav className="hidden md:flex items-center gap-6">
                        <a className="text-[#004be2] font-bold border-b-4 border-[#004be2] py-1" href="#">Play</a>
                        <a className="text-[#575881] font-medium hover:text-[#004be2] py-1" href="#">Stats</a>
                    </nav>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Difficulty & Stats */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-surface-container-low rounded-[2rem] p-6 space-y-6">
                            <div>
                                <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest block mb-4">Difficulty</span>
                                <div className="flex flex-col gap-2">
                                    {['easy', 'medium', 'hard'].map((lvl) => {
                                        const isActive = difficulty === lvl;
                                        return (
                                            <button
                                                key={lvl}
                                                onClick={() => resetGame(lvl)}
                                                className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all ${
                                                    isActive ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                                                }`}
                                            >
                                                <span className="capitalize">{lvl}</span>
                                                {isActive && <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="pt-4 border-t border-outline-variant/20">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">Timer</span>
                                        <div className="text-xl font-headline font-extrabold text-on-surface">{formatTime(timer)}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">Mistakes</span>
                                        <div className="text-xl font-headline font-extrabold text-error">{mistakes}/3</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* --- NEW: Quick Actions Block --- */}
                        <div className="bg-surface-container-low rounded-[2rem] p-6 mt-6">
                            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest block mb-4">Quick Actions</span>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface-container-highest text-on-surface hover:bg-surface-container-high transition-all active:scale-95">
                                    <span className="material-symbols-outlined">undo</span>
                                    <span className="text-[10px] font-bold uppercase">Undo</span>
                                </button>
                                <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface-container-highest text-on-surface hover:bg-surface-container-high transition-all active:scale-95">
                                    <span className="material-symbols-outlined">lightbulb</span>
                                    <span className="text-[10px] font-bold uppercase">Hint</span>
                                </button>
                                <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface-container-highest text-on-surface hover:bg-surface-container-high transition-all active:scale-95">
                                    <span className="material-symbols-outlined">edit</span>
                                    <span className="text-[10px] font-bold uppercase">Notes</span>
                                </button>
                                <button 
                                    onClick={handleErase}
                                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface-container-highest text-on-surface hover:bg-surface-container-high transition-all active:scale-95"
                                >
                                    <span className="material-symbols-outlined">delete</span>
                                    <span className="text-[10px] font-bold uppercase">Erase</span>
                                </button>
                            </div>
                        </div>
                        {/* --- End Quick Actions --- */}

                    </div>

                    {/* Middle Column: The Grid */}
                    <div className="lg:col-span-6 flex justify-center">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-primary-container/10 blur-3xl rounded-full opacity-50"></div>

                            {/* NEW: Game Over / Win Overlay */}
                            {gameStatus !== "Playing" && (
                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface-container-high/80 backdrop-blur-sm rounded-3xl">
                                    <span className={`text-5xl font-black mb-2 ${gameStatus === "Won" ? "text-tertiary" : "text-error"}`}>
                                        {gameStatus === "Won" ? "You Win!" : "Game Over"}
                                    </span>
                                    <button 
                                        onClick={() => resetGame(difficulty)}
                                        className="mt-4 px-6 py-2 bg-primary text-on-primary rounded-full font-bold shadow-lg"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}
                            
                            {/* React Matrix mapped to 3x3 Block Grid */}
                            <div className="relative bg-surface-container-high p-1.5 rounded-3xl shadow-xl grid grid-cols-3 gap-1.5">
                                {[...Array(9)].map((_, boxIndex) => (
                                    <div key={boxIndex} className="grid grid-cols-3 gap-0.5 bg-surface-container-highest p-0.5 rounded-lg overflow-hidden">
                                        {[...Array(9)].map((_, cellIdx) => {
                                            // Calculate actual row/col from block logic
                                            const r = Math.floor(boxIndex / 3) * 3 + Math.floor(cellIdx / 3);
                                            const c = (boxIndex % 3) * 3 + (cellIdx % 3);
                                            
                                            const isInitial = initialBoard[r][c] !== 0;
                                            const currentValue = board[r][c];
                                            const solutionValue = solutionBoard[r][c];
                                            
                                            const isWrong = !isInitial && currentValue !== 0 && currentValue !== solutionValue;
                                            const isSelected = selectedCell?.r === r && selectedCell?.c === c;

                                            // Determine text color
                                            let textClass = "text-on-surface"; // Default for initial
                                            if (!isInitial && currentValue !== 0) {
                                                textClass = isWrong ? "text-error" : "text-primary";
                                            }

                                            return (
                                                <div
                                                    key={`${r}-${c}`}
                                                    onClick={() => !isInitial && setSelectedCell({r, c})}
                                                    className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-surface-container-lowest text-2xl font-headline font-bold cursor-pointer transition-colors
                                                        ${isSelected ? 'bg-secondary-container shadow-[inset_0_0_0_3px_#fdd400]' : 'hover:bg-surface-container'}
                                                        ${textClass}
                                                    `}
                                                >
                                                    {currentValue === 0 ? '' : currentValue}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Number Pad */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-surface-container-low rounded-[2rem] p-6 space-y-6">
                            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest block mb-4">Input Pad</span>
                            <div className="grid grid-cols-3 gap-3">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => handleNumberPadClick(num)}
                                        className="aspect-square flex items-center justify-center text-2xl font-headline font-bold bg-secondary-container text-on-secondary-container rounded-2xl shadow-sm hover:scale-105 active:scale-95 transition-transform"
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                            <button 
                                onClick={() => resetGame(difficulty)}
                                className="w-full py-4 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all group"
                            >
                                <span>New Game</span>
                                <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">refresh</span>
                            </button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}