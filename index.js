class TicTacToeGame {
    constructor() {
        this.board = Array.from({ length: 3 }, () => Array(3).fill(' '));
        this.currentPlayer = 'X';
    }

    displayGameBoard() {
        for (const row of this.board) {
            console.log(row.join('|'));
            console.log('-'.repeat(5));
        }
    }

    makeMove(row, col) {
        if (0 <= row && row < 3 && 0 <= col && col < 3 && this.board[row][col] === ' ') {
            this.board[row][col] = this.currentPlayer;
            this.currentPlayer = (this.currentPlayer === 'X') ? 'O' : 'X';
            return true;
        }
        return false;
    }

    findWinner() {
        for (const row of this.board) {
            if (row[0] === row[1] && row[1] === row[2] && row[0] !== ' ') {
                return row[0];
            }
        }

        for (let col = 0; col < 3; col++) {
            if (this.board[0][col] === this.board[1][col] && this.board[1][col] === this.board[2][col] && this.board[0][col] !== ' ') {
                return this.board[0][col];
            }
        }

        if (this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2] && this.board[0][0] !== ' ') {
            return this.board[0][0];
        }

        if (this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0] && this.board[0][2] !== ' ') {
            return this.board[0][2];
        }

        return null;
    }

    isBoardDoneWithMOves() {
        return this.board.every(row => row.every(cell => cell !== ' '));
    }
}

function dfs(board, player) {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === player) {
                if (dfsHelper(board, player, row, col, new Set())) {
                    return true;
                }
            }
        }
    }
    return false;
}

function dfsHelper(board, player, row, col, visited) {
    if (!visited.has(`${row},${col}`)) {
        visited.add(`${row},${col}`);
        if (visited.size === 3) {
            return true;
        }
        for (const [i, j] of [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]]) {
            if (0 <= i && i < 3 && 0 <= j && j < 3 && board[i][j] === player) {
                if (dfsHelper(board, player, i, j, visited)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function bfs(board, player) {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === player) {
                if (bfsHelper(board, player, row, col)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function bfsHelper(board, player, startRow, startCol) {
    const queue = [[startRow, startCol]];
    const visited = new Set(queue.map(([i, j]) => `${i},${j}`));

    while (queue.length > 0) {
        const [row, col] = queue.shift();

        for (const [i, j] of [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]]) {
            if (0 <= i && i < 3 && 0 <= j && j < 3 && board[i][j] === player && !visited.has(`${i},${j}`)) {
                visited.add(`${i},${j}`);
                queue.push([i, j]);
                if (visited.size === 3) {
                    return true;
                }
            }
        }
    }

    return false;
}

function botMove(board, player) {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === ' ') {
                board[row][col] = player;
                if (dfs(board, player)) {
                    return { row, col };
                }
                board[row][col] = ' ';
            }
        }
    }

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === ' ') {
                board[row][col] = player;
                if (bfs(board, player)) {
                    return { row, col };
                }
                board[row][col] = ' ';
            }
        }
    }

    const availableMoves = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === ' ') {
                availableMoves.push({ row: i, col: j });
            }
        }
    }

    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
}

const ticTacToe = new TicTacToeGame();

while (true) {
    ticTacToe.displayGameBoard();
    console.log("current player: ", ticTacToe.currentPlayer);

    if (ticTacToe.currentPlayer === 'X') {
        const row = parseInt(prompt("Enter row (0, 1, or 2): "));
        const col = parseInt(prompt("Enter column (0, 1, or 2): "));
        if (!ticTacToe.makeMove(row, col)) {
            console.log("Invalid move. Try again.");
            continue;
        }
    } else {
        console.log("Computer's move:");
        const { row, col } = botMove(ticTacToe.board, 'O');
        ticTacToe.makeMove(row, col);
    }

    const winner = ticTacToe.findWinner();
    if (winner) {
        ticTacToe.displayGameBoard();
        console.log(`${winner} wins!`);
        break;
    } else if (ticTacToe.isBoardDoneWithMOves()) {
        ticTacToe.displayGameBoard();
        console.log("It's a tie!");
        break;
    }
}
