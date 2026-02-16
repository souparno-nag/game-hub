"use client";
import { useState, useEffect } from "react";
import "./sudoku.css";

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
                const numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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
function shuffle(array: number[]): number[] {
    for (let i = 0; i < array.length - 1; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export default function Sudoku() {
    // Initialize state with empty board
    const [board, setBoard] = useState<number[][]>([]);

    // Generate a valid board only on the client using useEffect
    useEffect(() => {
        requestAnimationFrame(() => {
            const newBoard = generateFullBoard();
            fillDiagonalBoxes(newBoard);
            solveSudoku(newBoard);
            setBoard(newBoard);
        })
    }, []);

    // Don't render the grid until the board is generated
    if (board.length == 0) {
        return (
            <div className="min-h-screen bg-sudoku-vermillion text-black flex items-center justify-center">
                Loading Game...
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-sudoku-vermillion text-black flex flex-col items-center justify-center content-evenly">
            <div className="flex-1 flex items-center justify-center font-caveat text-6xl">Sudoku</div>
            <div className="flex-1 flex flex-col gap-0 m-2">
                {
                    board.map((row, rowIndex) => {
                        return (
                            <div key={rowIndex} className="border-2 border-sudoku-blueandgrey h-10 flex items-center justify-center">{
                                row.map((cell, cellIndex) => (
                                    <span className="p-2 border-2 border-sudoku-blueandgrey bg-sudoku-offwhite" key={cellIndex}>{cell}</span>
                                ))
                            }</div>
                        )
                    })
                }
            </div>
        </div>
    )
}