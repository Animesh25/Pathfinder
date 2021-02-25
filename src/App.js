import React, { useState, useEffect } from 'react';

import './CSS/grid.css';
import Node from './Components/Node';
import { findPath } from './algorithms/a_star_search';
import { dijkstra_algorithm } from './algorithms/dijkstra';
import { bfs } from './algorithms/breadth_first';
import { dfs } from './algorithms/depth_first';
import { best_first } from './algorithms/best_first';
import { bidirectional } from './algorithms/bidirectional_search';
import { timeout, find_path_from_closed, draw_path } from './Helpers/path_finder';
import Dropdown from './Components/Dropdown';
import { makeMaze } from './Helpers/maze_creation';
import ColourCode from './Components/ColourCode';
import Results from './Components/Results';



function App() {

  const [Grid, setGrid] = useState([]);
  const [MouseDown, setMouseDown] = useState(false);
  const [startLoc, setStartLoc] = useState([5, 5]);
  const [endLoc, setEndLoc] = useState([5, 15]);
  const [startDrag, setStartDrag] = useState(false);
  const [endDrag, setEndDrag] = useState(false);
  const [gridPath, setPath] = useState([]);
  const [visitedPath, setVisited] = useState([]);
  const [chosenAlgorithm, setAlgorithm] = useState("");
  const [chosenDirection, setDirection] = useState("");
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    setGrid(createGrid());

  }, []);

  const ROWS = 18;
  const COLS = 55;

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
    setMouseDown(true);
    if (x === null || y === null || x < 0 || y < 0) return;
    // console.log("mouse down at", x, ",", y);

    console.log("start drag-------------x,y=", x, ",", y);
    if (x === startLoc[0] && y === startLoc[1]) {
      setStartDrag(true);
    }
    else if (x === endLoc[0] && y === endLoc[1]) {
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

  //if moving start or end we want to retain previous wall position
  /**
   * oldGrid=grid
   * if(start or end)
   *    
   */
  const handleMouseEnter = (x, y) => {
    if (x === null || y === null || x < 0 || y < 0) return;
    if (x === endLoc[0] && y === endLoc[1]) return;
    if (x === startLoc[0] && y === startLoc[1]) return;
    if (MouseDown) {
      let newGrid = Grid.slice();
      if (!startDrag && !endDrag) {
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
            isWall={newGrid[x][y].props.isWall} />
        newGrid[startLoc[0]][startLoc[1]] = <Node
          isWall={newGrid[startLoc[0]][startLoc[1]].props.isWall}
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
            isWall={newGrid[x][y].props.isWall}
            isPath={false}
            isVisited={false} />
        newGrid[endLoc[0]][endLoc[1]] = <Node
          isWall={newGrid[endLoc[0]][endLoc[1]].props.isWall}
          isStart={false}
          isEnd={false}
          isPath={false}
          isVisited={false}
          handleMouseDown={() => handleMouseDown(x, y)}
          handleMouseEnter={() => handleMouseEnter(x, y)}
          handleMouseUp={() => handleMouseUp(x, y)}
        />;
        console.log("set wall at endloc=", endLoc);
        setEndLoc([x, y])


      }
      setGrid(newGrid)
    }



  }
  const handleMouseUp = (x, y) => {
    setMouseDown(false);
    if (x === null || y === null || x < 0 || y < 0) return;

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
    let closed_nodes = dijkstra_algorithm(ROWS, COLS, startLoc, endLoc, Grid, chosenDirection);

    clear_visited_path();
    clear_old_path(gridPath);
    setVisited(closed_nodes);
    await draw_path_helper(closed_nodes, 1, "visited");
    await checkEndLocExists(closed_nodes);
  }
  const BFS = async () => {
    let closed_nodes = bfs(ROWS, COLS, startLoc, endLoc, Grid, chosenDirection);
    // console.log("BFS closed=", closed_nodes);
    clear_visited_path();
    clear_old_path(gridPath);
    setVisited(closed_nodes);
    await draw_path_helper(closed_nodes, 1, "visited");
    await checkEndLocExists(closed_nodes);
  }
  const bidirectional_search = async () => {
    let closed_nodes = bidirectional(ROWS, COLS, startLoc, endLoc, Grid, chosenDirection);
    console.log("bi-path=", closed_nodes);
    clear_visited_path();
    clear_old_path(gridPath);
    setVisited(closed_nodes);
    await draw_path_helper(closed_nodes, 1, "visited");

    let final_path = findPath(ROWS, COLS, startLoc, endLoc, Grid, chosenDirection);
    await checkEndLocExists(final_path);
  }

  const best_first_search = async () => {
    let closed_nodes = best_first(ROWS, COLS, startLoc, endLoc, Grid, chosenDirection);
    clear_visited_path();
    clear_old_path(gridPath);
    setVisited(closed_nodes);
    console.log("length=", closed_nodes);
    await draw_path_helper(closed_nodes, 1, "visited");
    await checkEndLocExists(closed_nodes);
  }
  const DFS = async () => {
    let closed_nodes = dfs(ROWS, COLS, startLoc, endLoc, Grid, chosenDirection);
    clear_visited_path();
    clear_old_path(gridPath);
    setVisited(closed_nodes);
    setPath(closed_nodes);
    // console.log("length=", closed_nodes.length);
    await draw_path_helper(closed_nodes, 1, "visited");
    await checkEndLocExists(closed_nodes);
  }
  const aStarSearch = async () => {
    clear_visited_path();
    clear_old_path(gridPath);
    let closed_nodes = findPath(ROWS, COLS, startLoc, endLoc, Grid, chosenDirection);
    setVisited(closed_nodes);
    await draw_path_helper(closed_nodes, 1, "visited");

    await checkEndLocExists(closed_nodes);

  }
  const checkEndLocExists = async(closed_nodes) => {
    const lastElement = closed_nodes[closed_nodes.length - 1];
    if (lastElement[0] === endLoc[0] && lastElement[1] === endLoc[1]) {
      await find_path_from_closed_helper(closed_nodes);
    }
    else {
      setPath([]);
      setPath(null);
    }
  }

  const find_path_from_closed_helper = async (closed_nodes) => {
    let path = await find_path_from_closed(closed_nodes, startLoc);;
    setPath(path);
    console.log("path==================", path);
    await draw_path_helper(path, 1, "path");
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
    if(path===null || path===undefined) return;
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


  const draw_path_helper = async (path, i, type) => {

    if (i > 0 && i <= path.length - 1) {
      let newGrid = await draw_path(Grid, path, i, type)
      setGrid(newGrid);
      await timeout(2);
      await draw_path_helper(path, i + 1, type);
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
  const emptyGrid = () => {
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
    return grid;

  }
  const algorithmOptions = [
    'A* Search', 'Dijkstra', 'Depth-First Search', 'Breadth-First Search', 'Best-First Search', 'bidirectional_search'
  ];
  const directionOptions = [
    '4-Directional', '8-Directional'
  ]
  const mazeOptions = [
    'Loop', 'Maze 1', 'Maze 2', 'Boxed'
  ]
  const startAlgorithm = async () => {
    setStartTime(performance.now());
    if (chosenAlgorithm === "A* Search") {
      await aStarSearch();

    }
    else if (chosenAlgorithm === "Dijkstra") {
      await dijkstra()
    }
    else if (chosenAlgorithm === "Breadth-First Search") {
      await BFS()
    }
    else if (chosenAlgorithm === "Depth-First Search") {
      await DFS()
    }
    else if (chosenAlgorithm === "Best-First Search") {
      await best_first_search();
    }
    else if (chosenAlgorithm === "bidirectional_search") bidirectional_search();


  }

  const createWalls = (value) => {
    setGrid(makeMaze(startLoc, endLoc, emptyGrid(), value));

  }
  const give2dArray = () => {
    let arr = [];
    console.log("grid=", Grid[0][1]);
    for (let i = 0; i < Grid.length; i++) {
      arr.push([]);
      for (let j = 0; j < Grid[i].length; j++) {
        if (Grid[i][j].props.isWall === true) {
          arr[i].push(1);
        }
        else {
          arr[i].push(0);
        }
      }
      // arr.push(subArr);
    }
    console.log("arr=", arr);
  }




  return (
    <div className="App">
      <div className="buttonGroup">
        <Dropdown options={algorithmOptions} default={"Search Algorithm"}
          dropDownValueChanged={(value) => setAlgorithm(value)}
        />
        <button className="startButton" onClick={() => startAlgorithm()}>Start {chosenAlgorithm}</button>
        <button className="button" onClick={() => clearWalls()}>Clear Walls</button>
        <Dropdown options={directionOptions} default={"8-Directional"}
          dropDownValueChanged={(value) => setDirection(value)}
        />
        <Dropdown options={mazeOptions} default={"Select Maze"}
          dropDownValueChanged={(value) => createWalls(value)}
        />
        <button className="button" onClick={() => give2dArray()}>Give 2d Arr</button>
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
        <div className={"bottomContainer"}>
          <Results chosenAlgorithm={chosenAlgorithm} startTime={startTime} content={gridPath} />
          <ColourCode />
        </div>

      </div>
    </div>
  );
}

export default App;
