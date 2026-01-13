export default function Sudoku() {
    function generateFullBoard() {
        // initialize an empty 9*9 board
        const board = Array(9).fill(null).map(() => Array(9).fill(0));
    }
    return (
        <div className="min-h-screen bg-orange-300 text-black flex items-center justify-center">
            Sudoku
        </div>
    )
}