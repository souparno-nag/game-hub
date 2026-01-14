"use client";
import "./sudoku.css";

export default function Sudoku() {
    function generateFullBoard() : number[][] {
        // initialize an empty 9*9 board
        const board : number[][] = Array(9).fill(null).map(() => Array(9).fill(0));
        return board;
    }
    const board : number[][] = generateFullBoard();
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