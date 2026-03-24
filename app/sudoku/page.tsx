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
    // Initialize state with empty board
    const [board, setBoard] = useState<number[][]>([]);
    const [solutionBoard, setSolutionBoard] = useState<number[][]>([]);
    const [initialBoard, setInitialBoard] = useState<number[][]>([]);
    const [gameStatus, setGameStatus] = useState<"Won" | "Playing">("Playing");

    // Generate a valid board only on the client using useEffect
    useEffect(() => {
        requestAnimationFrame(() => {
            const newBoard = generateFullBoard();
            fillDiagonalBoxes(newBoard);
            solveSudoku(newBoard);
            setSolutionBoard(newBoard);
            const puzzleBoard = createPuzzle(newBoard, "expert");
            setBoard(puzzleBoard);
            setInitialBoard(puzzleBoard);
        });
    }, []);

    // Check if the game has been won and duly update gameState
    useEffect(() => {
        const boardSize = board.length;
        let check: boolean = true;
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] !== solutionBoard[i][j]) {
                    check = false;
                    break;
                }
                if (!check) break;
            }
        }
        if (check) {
            setGameStatus("Won");
        } else {
            setGameStatus("Playing");
        }
    }, [board]);

    // Don't render the grid until the board is generated
    if (initialBoard.length == 0) {
        return (
            <div className="min-h-screen bg-sudoku-vermillion text-black flex items-center justify-center">
                Loading Game...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-sudoku-vermillion text-black flex flex-col items-center justify-center content-evenly">
            <div className="flex-1 flex items-center justify-center font-caveat text-6xl">Sudoku</div>
            <div className="flex-1 flex flex-col gap-0 m-2">
                {
                    board.map((row, rowIndex) => {
                        return (
                            <div
                                key={rowIndex}
                                className="border-2 border-sudoku-blueandgrey h-10 flex items-center justify-center">{
                                    row.map((cell, cellIndex) => (
                                        <span
                                            className="w-10 h-10 flex items-center justify-center border-2 border-sudoku-blueandgrey bg-sudoku-offwhite"
                                            key={cellIndex}>{(cell !== 0 ?
                                                <span className={`text-lg ${initialBoard[rowIndex][cellIndex] === 0 ? (cell === solutionBoard[rowIndex][cellIndex] ? 'text-green-600' : 'text-red-500') : ''}`}>{cell}</span> :
                                                <input
                                                    type="text"
                                                    value={""}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value);
                                                        setBoard(handleCellChange(board, rowIndex, cellIndex, isNaN(val) ? 0 : val));
                                                    }}
                                                    maxLength={1}
                                                    className={`w-full h-full text-center text-lg bg-transparent outline-none`}
                                                />)}
                                        </span>
                                    ))
                                }</div>
                        )
                    })
                }
            </div>
        </div>
    );
}