import Node from '../Components/Node';

export const clearEverything = (ROWS,COLS,grid) => {
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
                grid[x][y]=<Node
                    isWall={false}
                    isPath={false}
                    isVisited={false}
                    isStart={grid[y][x].props.isStart}
                    isEnd={grid[y][x].props.isEnd} />
        }
    }
    return grid;
}