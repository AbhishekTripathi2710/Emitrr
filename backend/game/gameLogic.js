import { ROWS, COLS, EMPTY } from "./constants.js";

export function createBoard(){
    return Array.from({length: ROWS}, () => 
        Array(COLS).fill(EMPTY)
    );
}

export function dropDisc(board, column, player){
    if(column < 0 || column >= board[0].length) return -1;

    for(let row = board.length - 1; row >= 0; row--){
        if(board[row][column] === EMPTY){
            board[row][column] = player;
            return row;
        }
    }
    return -1;
}

export function checkWin(board,player){
    const directions = [
        [0,1],
        [1,0],
        [1,1],
        [1,-1]
    ];

    for(let r =0;r<board.length;r++){
        for(let c = 0;c<board[0].length;c++){
            if(board[r][c] !== player) continue;

            for(const [dr, dc] of directions){
                if(hasFour(board, r, c, dr, dc, player)){
                    return true;
                }
            }
        }
    }

    return false;
}

function hasFour(board, r, c, dr, dc, player){
    for(let i =0;i< 4;i++){
        const nr = r+ dr*i;
        const nc = c + dc*i;

        if(
            nr<0 ||
            nc<0 ||
            nr >= board.length ||
            nc >= board[0].length ||
            board[nr][nc] !== player
        ){
            return false;
        }
    }
    return true;
}

export function isDraw(board){
    return board[0].every(cell => cell !== EMPTY);
}