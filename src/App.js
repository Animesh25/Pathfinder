import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './CSS/grid.css';
import Node from './Components/Node';
import { findPath } from './algorithms/a_star_search';
import { dijkstra_algorithm } from './algorithms/dijkstra';
import { bfs } from './algorithms/breadth_first';
import { dfs } from './algorithms/depth_first';
import { best_first } from './algorithms/best_first';



function App() {

  const [Grid, setGrid] = useState([]);
  const [mouseDown, setMouseDown] = useState(false);
  const [startLoc, setStartLoc] = useState([5, 5]);
  const [endLoc, setEndLoc] = useState([5, 15]);
  const [startDrag, setStartDrag] = useState(false);
  const [endDrag, setEndDrag] = useState(false);
  const [gridPath, setPath] = useState([]);
  const [visitedPath, setVisited] = useState([]);

  useEffect(() => {
    setGrid(createGrid());

  }, []);

  const ROWS = 15;
  const COLS = 30;

  const createGrid = () => {

    let grid = [];
    for (let y = 0; y < ROWS; y++) {
      grid.push([]);
      for (let x = 0; x < COLS; x++) {
        grid[y].push(
          <Node
            handleMouseDown={() => handleMouseDown(x, y)}
            handleMouseEnter={() => handleMouseEnter(x, y)}
            handleMouseUp={() => handleMouseUp()}
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
      handleMouseDown={() => handleMouseDown(startLoc[0], startLoc[1])}
      handleMouseEnter={() => handleMouseEnter(startLoc[0], startLoc[1])}
      handleMouseUp={() => handleMouseUp(startLoc[0], startLoc[1])}
    />;
    grid[endLoc[0]][endLoc[1]] = <Node
      isWall={false}
      isStart={false}
      isPath={false}
      isVisited={false}
      isEnd={true}
      handleMouseDown={() => handleMouseDown(endLoc[0], endLoc[1])}
      handleMouseEnter={() => handleMouseEnter(endLoc[0], endLoc[1])}
      handleMouseUp={() => handleMouseUp(endLoc[0], endLoc[1])}
    />;

    return grid;
  }


  const handleMouseDown = (x, y) => {
    if (x === null || y === null || x < 0 || y < 0) return;
    // console.log("mouse down at", x, ",", y);
    setMouseDown(true);
    console.log("start drag-------------x,y=", x, ",", y);
    console.log("start drag-------------startLoc0,startLoc1=", startLoc[0], ",", startLoc[1]);
    if (x == startLoc[0] && y == startLoc[1]) {
      setStartDrag(true);
    }
    else if (x == endLoc[0] && y == endLoc[1]) {
      setEndDrag(true);
    }
    else {
      // else setStartDrag(false);
      let newGrid = Grid.slice();
      if (newGrid[x][y].props.isStart || newGrid[x][y].props.isEnd) return;
      // console.log("boolean=", newGrid[x][y].props.isWall)
      newGrid[x][y] =
        <Node
          key={y}
          handleMouseDown={() => handleMouseDown(x, y)}
          handleMouseEnter={() => handleMouseEnter(x, y)}
          handleMouseUp={() => handleMouseUp(x, y)}
          isWall={!newGrid[x][y].props.isWall} />

      // console.log("new grid[", x, "][", y, "]=", newGrid[x][y])
      setGrid(newGrid)
    }

  }
  const handleMouseEnter = (x, y) => {
    if (x === null || y === null || x < 0 || y < 0) return;
    if (mouseDown) {
      let newGrid = Grid.slice();
      if ((x != startLoc[0] && y != startLoc[1]) || (!newGrid[x][y].props.isStart && !newGrid[x][y].props.isEnd)) {
        newGrid[x][y] =
          <Node
            key={y}
            handleMouseDown={() => handleMouseDown(x, y)}
            handleMouseEnter={() => handleMouseEnter(x, y)}
            handleMouseUp={() => handleMouseUp(x, y)}
            isStart={false}
            isPath={false}
            isVisited={false}
            isWall={!newGrid[x][y].props.isWall} />
      }
      if (startDrag) {
        newGrid[x][y] =
          <Node
            key={y}
            handleMouseDown={() => handleMouseDown(x, y)}
            handleMouseEnter={() => handleMouseEnter(x, y)}
            handleMouseUp={() => handleMouseUp(x, y)}
            isStart={true}
            isWall={false} />
        newGrid[startLoc[0]][startLoc[1]] = <Node
          isWall={false}
          isStart={false}
          isEnd={false}
          isPath={false}
          isVisited={false}
          handleMouseDown={() => handleMouseDown(x, y)}
          handleMouseEnter={() => handleMouseEnter(x, y)}
          handleMouseUp={() => handleMouseUp(x, y)}
        />;
        setStartLoc([x, y])
      }
      else if (endDrag) {
        newGrid[x][y] =
          <Node
            key={y}
            handleMouseDown={() => handleMouseDown(x, y)}
            handleMouseEnter={() => handleMouseEnter(x, y)}
            handleMouseUp={() => handleMouseUp(x, y)}
            isStart={false}
            isEnd={true}
            isWall={false}
            isPath={false}
            isVisited={false} />
        newGrid[endLoc[0]][endLoc[1]] = <Node
          isWall={false}
          isStart={false}
          isEnd={false}
          isPath={false}
          isVisited={false}
          handleMouseDown={() => handleMouseDown(x, y)}
          handleMouseEnter={() => handleMouseEnter(x, y)}
          handleMouseUp={() => handleMouseUp(x, y)}
        />;
        setEndLoc([x, y])
      }
      setGrid(newGrid)
    }



  }
  const handleMouseUp = (x, y) => {
    if (x === null || y === null || x < 0 || y < 0) return;
    setMouseDown(false);
    if (startDrag) {
      setStart(x, y)
    }
    else if (endDrag) {
      // setEnd(x,y);
    }
    setStartDrag(false);
    setEndDrag(false);
  }
  const dijkstra = async () => {
    let closed_nodes = dijkstra_algorithm(ROWS, COLS, startLoc, endLoc, Grid);

    clear_visited_path();
    clear_old_path(gridPath);
    setVisited(closed_nodes);
    await draw_path(closed_nodes, 1, "visited");
    await find_path_from_closed(closed_nodes);
  }
  const BFS = async () => {
    let closed_nodes = bfs(ROWS, COLS, startLoc, endLoc, Grid);
    console.log("BFS closed=", closed_nodes);
    clear_visited_path();
    clear_old_path(gridPath);
    setVisited(closed_nodes);
    await draw_path(closed_nodes, 1, "visited");
    await find_path_from_closed(closed_nodes);
  }

  const best_first_search = async () => {
    let closed_nodes = best_first(ROWS, COLS, startLoc, endLoc, Grid);
    clear_visited_path();
    clear_old_path(gridPath);
    setVisited(closed_nodes);
    console.log("length=", closed_nodes.length);
    await draw_path(closed_nodes, 1, "visited");
    await find_path_from_closed(closed_nodes);
  }
  const DFS = async () => {
    let closed_nodes = dfs(ROWS, COLS, startLoc, endLoc, Grid);
    clear_visited_path();
    clear_old_path(gridPath);
    setVisited(closed_nodes);
    console.log("length=", closed_nodes.length);
    await draw_path(closed_nodes, 1, "visited");
    await draw_path(closed_nodes, 1, "path");
  }
  const aStarSearch = () => {
    clear_visited_path();
    clear_old_path(gridPath);
    let closed_nodes = findPath(ROWS, COLS, startLoc, endLoc, Grid);
    await draw_path(closed_nodes, 1, "visited");
    find_path_from_closed(closed_nodes);
  }
  const find_path_from_closed = async (closed_nodes) => {
    let path = [];
    let found_start = false;
    let last = closed_nodes[closed_nodes.length - 1];
    while (found_start === false) {
      path.unshift(last);
      if (last === undefined) break;
      if (last[0] === startLoc[0] && last[1] === startLoc[1]) found_start = true;
      else {
        last = last[last.length - 1];
      }
    }


    setPath(path);
    console.log("path==================", path);
    await draw_path(path, 1, "path");
  }
  const clear_visited_path = () => {
    const newGrid = Grid.slice();
    for (let i = 1; i < visitedPath.length - 1; i++) {
      const x = visitedPath[i][0];
      const y = visitedPath[i][1]
      newGrid[x][y] = <Node
        isWall={Grid[x][y].props.isWall}
        isStart={Grid[x][y].props.isStart}
        isEnd={Grid[x][y].props.isEnd}
        isPath={false}
        isVisited={false}
      />;
    }
    setGrid(newGrid);
  }
  const clear_old_path = (path) => {
    const newGrid = Grid.slice();

    for (let i = 1; i < path.length - 1; i++) {
      const x = path[i][0];
      const y = path[i][1]
      newGrid[x][y] = <Node
        isWall={Grid[x][y].props.isWall}
        isStart={Grid[x][y].props.isStart}
        isEnd={Grid[x][y].props.isEnd}
        isPath={false}
        isVisited={false}

      />;
    }
    setGrid(newGrid);
  }
  function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
  }
  const draw_path = async (path, i, type) => {
    const newGrid = Grid.slice();
    if (i > 0 && i < path.length - 1) {
      const x = path[i][0];
      const y = path[i][1]
      // console.log("node=", x, y);
      // console.log(newGrid[x][y])
      if (type === "visited") {
        newGrid[x][y] = <Node
          isWall={false}
          isStart={Grid[x][y].props.isStart}
          isEnd={Grid[x][y].props.isEnd}
          isPath={false}
          isVisited={true}
        />;
      }
      else {
        newGrid[x][y] = <Node
          isWall={false}
          isStart={Grid[x][y].props.isStart}
          isEnd={Grid[x][y].props.isEnd}
          isPath={true}
          isVisited={false}
        />;
      }

      setGrid(newGrid);
      await timeout(10);
      await draw_path(path, i + 1, type);
    }


  }



  const setStart = (x, y) => {
    const newGrid = Grid.slice();// doing a deep copy of the array
    newGrid[startLoc[0]][startLoc[1]] = <Node
      isWall={false}
      isStart={true}
      isEnd={false}
      isPath={false}
      isVisited={false}
      handleMouseDown={() => handleMouseDown(x, y)}
      handleMouseEnter={() => handleMouseEnter(x, y)}
      handleMouseUp={() => handleMouseUp(x, y)}
    />;
    newGrid[endLoc[0]][endLoc[1]] = <Node
      isWall={false}
      isStart={false}
      isPath={false}
      isVisited={false}
      isEnd={true}
      handleMouseDown={() => handleMouseDown(x, y)}
      handleMouseEnter={() => handleMouseEnter(x, y)}
      handleMouseUp={() => handleMouseUp(x, y)}
    />;
    setGrid(newGrid);

  }
  const clearWalls = () => {
    let grid = [];
    for (let y = 0; y < ROWS; y++) {
      grid.push([]);
      for (let x = 0; x < COLS; x++) {
        grid[y].push(
          <Node
            handleMouseDown={() => handleMouseDown(x, y)}
            handleMouseEnter={() => handleMouseEnter(x, y)}
            handleMouseUp={() => handleMouseUp(x, y)}
            isWall={false}
            isPath={false}
            isVisited={false}
            isStart={Grid[y][x].props.isStart}
            isEnd={Grid[y][x].props.isEnd} />
        );
      }
    }
    setGrid(grid);
  }

  return (
    <div className="App">
      <div className="buttonGroup">
        <button className="button" onClick={() => clearWalls()}>Clear Walls</button>
        <button className="button" onClick={() => setStart(startLoc[0], startLoc[1])}>set Start & End</button>
        <button className="button" onClick={() => aStarSearch()}>A* search</button>
        <button className="button" onClick={() => dijkstra()}>Dijkstra</button>
        <button className="button" onClick={() => BFS()}>BFS</button>
        <button className="button" onClick={() => DFS()}>DFS</button>
        <button className="button" onClick={() => best_first_search()}>Best First Search</button>
      </div>
      <div className="container">
        {Grid.map((row, yIndex) => {
          return (
            <div key={yIndex} className={"row"}>
              {row.map((node, xIndex) => {
                return (
                  <Node
                    key={xIndex}
                    isWall={node.props.isWall}
                    isEnd={node.props.isEnd}
                    isPath={node.props.isPath}
                    isVisited={node.props.isVisited}
                    isStart={node.props.isStart}
                    handleMouseDown={() => handleMouseDown(yIndex, xIndex)}
                    handleMouseEnter={() => handleMouseEnter(yIndex, xIndex)}
                    handleMouseUp={() => handleMouseUp(yIndex, xIndex)}
                  />
                )

              })}
            </div>
          )

        })}

        <div className="keySet">
          <div className="key">
            <Node
              key={-1}
              isWall={true}
              isEnd={false}
              isPath={false}
              isVisited={false}
              isStart={false}
              handleMouseDown={() => handleMouseDown(-1, -1)}
              handleMouseEnter={() => handleMouseEnter(-1, -1)}
              handleMouseUp={() => handleMouseUp(-1, -1)}
            />
            <h3>Wall</h3>
          </div>
          <div className="key">
            <Node
              key={-1}
              isWall={false}
              isEnd={false}
              isPath={false}
              isVisited={false}
              isStart={true}
              handleMouseDown={() => handleMouseDown(-1, -1)}
              handleMouseEnter={() => handleMouseEnter(-1, -1)}
              handleMouseUp={() => handleMouseUp(-1, -1)}
            />
            <h3>Start</h3>
          </div>
          <div className="key">
            <Node
              key={-1}
              isWall={false}
              isEnd={true}
              isPath={false}
              isVisited={false}
              isStart={false}
              handleMouseDown={() => handleMouseDown(-1, -1)}
              handleMouseEnter={() => handleMouseEnter(-1, -1)}
              handleMouseUp={() => handleMouseUp(-1, -1)}
            />
            <h3>End</h3>
          </div>
          <div className="key">
            <Node
              key={-1}
              isWall={false}
              isEnd={false}
              isPath={false}
              isVisited={true}
              isStart={false}
              handleMouseDown={() => handleMouseDown(-1, -1)}
              handleMouseEnter={() => handleMouseEnter(-1, -1)}
              handleMouseUp={() => handleMouseUp(-1, -1)}
            />
            <h3>Visited</h3>
          </div>
          <div className="key">
            <Node
              key={-1}
              isWall={false}
              isEnd={false}
              isPath={true}
              isVisited={false}
              isStart={false}
              handleMouseDown={() => handleMouseDown(-1, -1)}
              handleMouseEnter={() => handleMouseEnter(-1, -1)}
              handleMouseUp={() => handleMouseUp(-1, -1)}
            />
            <h3>Path</h3>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
