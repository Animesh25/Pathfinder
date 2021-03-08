import React, { useState, useEffect } from 'react';

import './CSS/grid.css';
import Node from './Components/Node';
import { a_star_search } from './algorithms/a_star_search';
import { dijkstra_algorithm } from './algorithms/dijkstra';
import { bfs } from './algorithms/breadth_first';
import { dfs } from './algorithms/depth_first';
import { best_first } from './algorithms/best_first';
import { bidirectional } from './algorithms/bidirectional_search';
import { timeout, findPathFromClosed, drawPath, findPathBidirectional, createBombVisit } from './Helpers/path_finder';
import Dropdown from './Components/Dropdown';
import { makeMaze } from './Helpers/maze_creation';
import ColourCode from './Components/ColourCode';
import Results from './Components/Results';
import { clear_old_path, clear_visited_path, clearWalls, emptyGrid, setBomb, removeBomb,speedSetter} from './Helpers/gridMethods';
import { algorithmOptions, directionOptions, mazeOptions, speedOptions } from './Components/dropdownOptions';
import bombSVG from './CSS/bomb.svg';


function App() {
  // main grid, start & end points
  const [Grid, setGrid] = useState([]);
  const [startLoc, setStartLoc] = useState([5, 5]);
  const [endLoc, setEndLoc] = useState([5, 15]);
  // variables for dragging and dropping
  const [MouseDown, setMouseDown] = useState(false);
  const [bombDrag, setBombDrag] = useState(false);
  const [startDrag, setStartDrag] = useState(false);
  const [endDrag, setEndDrag] = useState(false);
  //variables for algorithm execution
  const [isRunning, setRunning] = useState(false);
  const [speed,setSpeed]=useState(2);

  const [gridPath, setPath] = useState([]);
  const [visitedPath, setVisited] = useState([]);
  const [chosenAlgorithm, setAlgorithm] = useState("");
  const [chosenDirection, setDirection] = useState("");
  const [startTime, setStartTime] = useState(0);
  // bomb node
  const [bombLoc, setBombLoc] = useState([1]);



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
          <Node />
        );
      }
    }
    grid[startLoc[0]][startLoc[1]] = <Node isStart={true} />;
    grid[endLoc[0]][endLoc[1]] = <Node isEnd={true} />;
    if (bombLoc.length > 0) grid[bombLoc[0]][bombLoc[1]] = <Node isBomb={true} />;

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
    else if (x === bombLoc[0] && y === bombLoc[1]) {
      setBombDrag(true);
    }
    else {
      let newGrid = Grid.slice();
      if (newGrid[x][y].props.isStart || newGrid[x][y].props.isEnd || newGrid[x][y].props.isBomb) return;
      newGrid[x][y] =
        <Node
          key={y}
          isWall={!newGrid[x][y].props.isWall} />
      setGrid(newGrid)
    }
  }

  //if moving start or end we want to retain previous wall position
  const handleMouseEnter = (x, y) => {
    if (x === null || y === null || x < 0 || y < 0) return;
    if (x === bombLoc[0] && y === bombLoc[1]) return;
    if (x === endLoc[0] && y === endLoc[1]) return;
    if (x === startLoc[0] && y === startLoc[1]) return;
    if (MouseDown) {
      let newGrid = Grid.slice();
      if (!startDrag && !endDrag && !bombDrag) {
        newGrid[x][y] =
          <Node
            key={y}
            isWall={!newGrid[x][y].props.isWall} />
      }
      if (startDrag) {
        newGrid[x][y] =
          <Node
            key={y}
            isStart={true}
            isWall={newGrid[x][y].props.isWall} />

        newGrid[startLoc[0]][startLoc[1]] = <Node
          isWall={newGrid[startLoc[0]][startLoc[1]].props.isWall}
        />;
        setStartLoc([x, y])
      }
      else if (endDrag) {
        newGrid[x][y] =
          <Node
            key={y}
            isEnd={true}
            isWall={newGrid[x][y].props.isWall}

          />
        newGrid[endLoc[0]][endLoc[1]] = <Node
          isWall={newGrid[endLoc[0]][endLoc[1]].props.isWall}

        />;
        console.log("set wall at endloc=", endLoc);
        setEndLoc([x, y])


      }
      else if (bombDrag) {
        newGrid[x][y] =
          <Node
            key={y}
            isBomb={true}
            isWall={newGrid[x][y].props.isWall}
          />
        newGrid[bombLoc[0]][bombLoc[1]] = <Node
          isWall={newGrid[bombLoc[0]][bombLoc[1]].props.isWall}
        />;
        setBombLoc([x, y])
      }
      setGrid(newGrid)
    }
  }


  const handleMouseUp = (x, y) => {
    setMouseDown(false);
    if (x === null || y === null || x < 0 || y < 0) return;
    setStartDrag(false);
    setEndDrag(false);
    setBombDrag(false);
  }



  const bidirectional_search = async () => {
    let biOutput = [], intersect;
    if (bombLoc.length > 1) {
      const startToBomb = bidirectional(ROWS, COLS, startLoc, bombLoc, Grid, chosenDirection);
      const bombToEnd = bidirectional(ROWS, COLS, bombLoc, endLoc, Grid, chosenDirection);

      const firstHalf = startToBomb[0];
      const firstIntersect = startToBomb[1];

      const secondHalf = bombToEnd[0];
      const secondHalfIntersect = bombToEnd[1];

      const visitedNodes = firstHalf.concat(secondHalf);
      stepsBeforeExecution(visitedNodes);
      await drawPathHelper(visitedNodes, 1, "visited");

      const biPathOne = await findPathBidirectional(firstHalf, firstIntersect);
      const biPathTwo = await findPathBidirectional(secondHalf, secondHalfIntersect);

      const joined = biPathOne.concat(biPathTwo);
      setPath(joined);

      await drawPathHelper(joined, 1, "path");

    }
    else {
      biOutput = bidirectional(ROWS, COLS, startLoc, endLoc, Grid, chosenDirection);
      let closed_nodes = biOutput[0];
      intersect = biOutput[1];

      console.log("bi-biOutput=", biOutput);
      stepsBeforeExecution(closed_nodes);
      await drawPathHelper(closed_nodes, 1, "visited");
      if (intersect === null || intersect === undefined) {
        setPath(null); //Necessary to trigger re-render of App
        setPath([]);
        return;
      }
      let biPath = await findPathBidirectional(closed_nodes, intersect);
      setPath(biPath.slice(0, biPath.length - 1));
      // console.log("Find path from closed=", biPath);
      await drawPathHelper(biPath, 1, "path");
    }



  }


  const stepsBeforeExecution = (closed_nodes) => {
    setGrid(clear_visited_path(visitedPath, Grid));
    setGrid(clear_old_path(gridPath, Grid));
    setVisited(closed_nodes);
  }
  const stepsAfterExecution = async (closed_nodes) => {
    await drawPathHelper(closed_nodes, 1, "visited");
    await checkEndLocExists(closed_nodes);
  }
  const checkEndLocExists = async (closed_nodes) => {
    const lastElement = closed_nodes[closed_nodes.length - 1];
    if (lastElement !== null && lastElement !== undefined && lastElement[0] === endLoc[0] && lastElement[1] === endLoc[1]) {
      closed_nodes = await findPathFromClosedHelper(closed_nodes);
      console.log("checkEndLocExists finalPath=", closed_nodes);
      setPath(closed_nodes);

      await drawPathHelper(closed_nodes, 1, "path");
    }
    else {
      setPath(null); //Necessary to trigger re-render of App
      setPath([]);
    }
  }

  const findPathFromClosedHelper = async (closed_nodes) => {
    let path = await findPathFromClosed(closed_nodes, startLoc);
    return path;
  }

  const drawPathHelper = async (path, i, type) => {
    if (i > 0 && i <= path.length - 1) {
      let newGrid = await drawPath(Grid, path, i, type)
      setGrid(newGrid);
      await timeout(speed);
      await drawPathHelper(path, i + 1, type);
    }


  }


  const startAlgorithm = async () => {
    if (isRunning || chosenAlgorithm==="") return;
    setRunning(true);

    setStartTime(performance.now());
    let closed_nodes, secondHalf = [];
    if (chosenAlgorithm === "A* Search") {
      if (bombLoc.length > 1) {
        closed_nodes = a_star_search(ROWS, COLS, startLoc, bombLoc, Grid, chosenDirection);
        secondHalf = a_star_search(ROWS, COLS, bombLoc, endLoc, Grid, chosenDirection);
        // closed_nodes=createBombVisit(closed_nodes,secondHalf);
      }
      else closed_nodes = a_star_search(ROWS, COLS, startLoc, endLoc, Grid, chosenDirection);


    }
    else if (chosenAlgorithm === "Dijkstra") {
      if (bombLoc.length > 1) {
        closed_nodes = dijkstra_algorithm(ROWS, COLS, startLoc, bombLoc, Grid, chosenDirection);
        secondHalf = dijkstra_algorithm(ROWS, COLS, bombLoc, endLoc, Grid, chosenDirection);
        // closed_nodes=createBombVisit(closed_nodes,secondHalf);
      }
      else closed_nodes = dijkstra_algorithm(ROWS, COLS, startLoc, endLoc, Grid, chosenDirection);

    }
    else if (chosenAlgorithm === "Breadth-First Search") {
      if (bombLoc.length > 1) {
        closed_nodes = bfs(ROWS, COLS, startLoc, bombLoc, Grid, chosenDirection);
        secondHalf = bfs(ROWS, COLS, bombLoc, endLoc, Grid, chosenDirection);

        // closed_nodes=createBombVisit(closed_nodes,secondHalf);
      }
      else closed_nodes = bfs(ROWS, COLS, startLoc, endLoc, Grid, chosenDirection);
    }
    else if (chosenAlgorithm === "Depth-First Search") {
      if (bombLoc.length > 1) {
        closed_nodes = dfs(ROWS, COLS, startLoc, bombLoc, Grid, chosenDirection);
        secondHalf = dfs(ROWS, COLS, bombLoc, endLoc, Grid, chosenDirection);
        // closed_nodes=createBombVisit(closed_nodes,secondHalf);
      }
      else closed_nodes = dfs(ROWS, COLS, startLoc, endLoc, Grid, chosenDirection);
    }
    else if (chosenAlgorithm === "Best-First Search") {
      if (bombLoc.length > 1) {
        closed_nodes = best_first(ROWS, COLS, startLoc, bombLoc, Grid, chosenDirection);
        secondHalf = best_first(ROWS, COLS, bombLoc, endLoc, Grid, chosenDirection);
        // closed_nodes=createBombVisit(closed_nodes,secondHalf);
      }
      else closed_nodes = best_first(ROWS, COLS, startLoc, endLoc, Grid, chosenDirection);
    }
    else if (chosenAlgorithm === "Bidirectional search") {
      await bidirectional_search();
      setRunning(false);
      return;

    }
    console.log("closed nodes ******=", closed_nodes);
    if (bombLoc.length > 1) {
      closed_nodes = createBombVisit(closed_nodes, secondHalf);
    }

    stepsBeforeExecution(closed_nodes);
    await stepsAfterExecution(closed_nodes);
    setRunning(false)

  }


  const createWalls = (value) => {
    setGrid(makeMaze(startLoc, endLoc, emptyGrid(Grid, ROWS, COLS), value));
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
        {isRunning && (
          <button className="startButton running">Running {!isRunning && chosenAlgorithm}</button>
        )}
        {!isRunning && (
          <button className="startButton" onClick={async () => await startAlgorithm()}>Start {chosenAlgorithm}</button>
        )}
        <button className="button" onClick={() => setGrid(clearWalls(Grid, ROWS, COLS))}>Clear Walls</button>
        <Dropdown options={directionOptions} default={"8-Directional"}
          dropDownValueChanged={(value) => setDirection(value)}
        />
        <Dropdown options={mazeOptions} default={"Select Maze"}
          dropDownValueChanged={(value) => createWalls(value)}
        />
        {bombLoc.length > 1 && (
          <button className="button" onClick={() => { if (bombLoc.length !== 1) { setGrid(removeBomb(Grid, bombLoc[0], bombLoc[1])); setBombLoc([6]); } }}> <img src={bombSVG} alt="Bomb Logo" />REMOVE Bomb</button>
        )}
        {bombLoc.length === 1 && (
          <button className="button" onClick={() => { if (bombLoc.length === 1) { setBombLoc([6, 6]); setGrid(setBomb(Grid, 6, 6)) } }}> <img src={bombSVG} alt="Bomb Logo" />Add Bomb</button>
        )}
        <Dropdown options={speedOptions} default={"very fast"}
          dropDownValueChanged={(value) => setSpeed(speedSetter(value))}
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
                    isBomb={node.props.isBomb}
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

          <Results chosenAlgorithm={chosenAlgorithm} startTime={startTime} content={gridPath} expanded={visitedPath} />
          <ColourCode />
        </div>

      </div>
    </div>
  );
}

export default App;
