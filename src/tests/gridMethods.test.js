import React from 'react';
import Node from '../Components/Node';
import { makeMaze } from '../Helpers/maze_creation';
import {clearWalls,setBomb,removeBomb} from '../Helpers/gridMethods';




let startLoc = [5, 5];
let endLoc = [5, 15];
const ROWS = 18;
const COLS = 55;
const createGrid = () => {

    let grid = [];
    for (let y = 0; y < ROWS; y++) {
        grid.push([]);
        for (let x = 0; x < COLS; x++) {
            grid[y].push(
                <Node

                    isWall={false} />
            );
        }
    }
    grid[startLoc[0]][startLoc[1]] = <Node
        isWall={false}
        isStart={true}
        isEnd={false}
        isPath={false}
        isVisited={false}

    />;
    grid[endLoc[0]][endLoc[1]] = <Node
        isWall={false}
        isStart={false}
        isPath={false}
        isVisited={false}
        isEnd={true}

    />;

    return grid;
}



it("Bomb node placed test", () => {
    let grid=createGrid();
    grid=setBomb(grid,10,20);
    expect(grid[10][20].props.isBomb).toBe(true);

});
it("Bomb node removed test", () => {
    let grid=createGrid();
    grid=setBomb(grid,10,20);
    grid=removeBomb(grid,10,20);
    expect(grid[10][20].props.isBomb).toBe(false);

});
it("Clear wall test", () => {
    let grid=makeMaze(startLoc,endLoc,createGrid(),"maze 1");
    grid=clearWalls(grid,ROWS,COLS);
    for(let i=0;i<grid.length;i++){
        for(let j=0;j<grid[0].length;j++){
            expect(grid[i][j].props.isWall).toBe(false);
        }
    }
});
