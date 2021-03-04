import Node from '../Components/Node';

export const clearEverything = (ROWS, COLS, grid) => {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      grid[x][y] = <Node
        isWall={false}
        isPath={false}
        isVisited={false}
        isStart={grid[y][x].props.isStart}
        isEnd={grid[y][x].props.isEnd}
        isBomb={grid[y][x].props.isBomb}
        />
        
    }
  }
  return grid;
}
export const clear_old_path = (path, Grid) => {
  if (path === null || path === undefined) return;
  const newGrid = Grid.slice();

  for (let i = 1; i < path.length - 1; i++) {
    const x = path[i][0];
    const y = path[i][1];
    if(x===undefined || y===undefined) return newGrid;
    newGrid[x][y] = <Node
      isWall={Grid[x][y].props.isWall}
      isStart={Grid[x][y].props.isStart}
      isEnd={Grid[x][y].props.isEnd}
      isPath={false}
      isVisited={false}
      isBomb={Grid[x][y].props.isBomb}
    />;
  }
  return newGrid;
}
export const clear_visited_path = (visitedPath, Grid) => {
  const newGrid = Grid.slice();
  for (let i = 1; i < visitedPath.length; i++) {
    const x = visitedPath[i][0];
    const y = visitedPath[i][1]
    newGrid[x][y] = <Node
      isWall={Grid[x][y].props.isWall}
      isBomb={Grid[x][y].props.isBomb}
      isStart={Grid[x][y].props.isStart}
      isEnd={Grid[x][y].props.isEnd}
      isPath={false}
      isVisited={false}
    />;
  }
  return newGrid;
}


// export const setStart = () => {
//     const newGrid = Grid.slice();// doing a deep copy of the array
//     newGrid[startLoc[0]][startLoc[1]] = <Node
//       isWall={false}
//       isStart={true}
//       isEnd={false}
//       isPath={false}
//       isVisited={false}
//       // handleMouseDown={() => handleMouseDown(x, y)}
//       // handleMouseEnter={() => handleMouseEnter(x, y)}
//       // handleMouseUp={() => handleMouseUp(x, y)}
//     />;
//     newGrid[endLoc[0]][endLoc[1]] = <Node
//       isWall={false}
//       isStart={false}
//       isPath={false}
//       isVisited={false}
//       isEnd={true}
//       // handleMouseDown={() => handleMouseDown(x, y)}
//       // handleMouseEnter={() => handleMouseEnter(x, y)}
//       // handleMouseUp={() => handleMouseUp(x, y)}
//     />;
//     return newGrid;
//   }
export const clearWalls = (Grid, ROWS, COLS) => {
  let grid = [];
  for (let y = 0; y < ROWS; y++) {
    grid.push([]);
    for (let x = 0; x < COLS; x++) {
      grid[y].push(
        <Node
          // handleMouseDown={() => handleMouseDown(x, y)}
          // handleMouseEnter={() => handleMouseEnter(x, y)}
          // handleMouseUp={() => handleMouseUp(x, y)}
          isWall={false}
          isPath={false}
          isVisited={false}
          isStart={Grid[y][x].props.isStart}
          isEnd={Grid[y][x].props.isEnd} 
          isBomb={Grid[y][x].props.isBomb}
          />
      );
    }
  }
  return grid

}
export const emptyGrid = (Grid, ROWS, COLS) => {
  let grid = [];
  for (let y = 0; y < ROWS; y++) {
    grid.push([]);
    for (let x = 0; x < COLS; x++) {
      grid[y].push(
        <Node
          isWall={false}
          isPath={false}
          isVisited={false}
          isStart={Grid[y][x].props.isStart}
          isEnd={Grid[y][x].props.isEnd} />
      );
    }
  }
  return grid;

}
export const setBomb = (Grid, x, y) => {
  let grid = Grid.slice();
  grid[x][y] =
    <Node
      isBomb={true}
      isStart={Grid[x][y].props.isStart}
      isEnd={Grid[x][y].props.isEnd} />
  return grid;

}
export const removeBomb = (Grid, x, y) => {
  let grid = Grid.slice();
  grid[x][y] =
    <Node
      isBomb={false}
      isStart={Grid[x][y].props.isStart}
      isEnd={Grid[x][y].props.isEnd} />
  return grid;

}