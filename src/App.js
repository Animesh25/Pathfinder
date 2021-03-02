import React, { useState, useEffect } from 'react';

import './CSS/grid.css';
import Node from './Components/Node';
import { a_star_search } from './algorithms/a_star_search';
import { dijkstra_algorithm } from './algorithms/dijkstra';
import { bfs } from './algorithms/breadth_first';
import { dfs } from './algorithms/depth_first';
import { best_first } from './algorithms/best_first';
import { bidirectional } from './algorithms/bidirectional_search';
import { timeout, find_path_from_closed, draw_path, findPathBidirectional } from './Helpers/path_finder';
import Dropdown from './Components/Dropdown';
import { makeMaze } from './Helpers/maze_creation';
import ColourCode from './Components/ColourCode';
import Results from './Components/Results';
import { clear_old_path, clear_visited_path, clearWalls, emptyGrid } from './Helpers/gridMethods';
import { algorithmOptions, directionOptions, mazeOptions } from './Components/dropdownOptions';


function App() {
  // main grid, start & end points
  const [Grid, setGrid] = useState([]);
  const [startLoc, setStartLoc] = useState([5, 5]);
  const [endLoc, setEndLoc] = useState([5, 15]);
  // variables for dragging and dropping
  const [MouseDown, setMouseDown] = useState(false);
  const [startDrag, setStartDrag] = useState(false);
  const [endDrag, setEndDrag] = useState(false);
  //variables for algorithm execution
  const [isRunning, setRunning] = useState(false);
  const [wantStop, setStop] = useState(false);
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
          <Node/>
        );
      }
    }
    grid[startLoc[0]][startLoc[1]] = <Node
      isStart={true}
    />;
    grid[endLoc[0]][endLoc[1]] = <Node
      isEnd={true}

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
      let newGrid = Grid.slice();
      if (newGrid[x][y].props.isStart || newGrid[x][y].props.isEnd) return;
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
    if (x === endLoc[0] && y === endLoc[1]) return;
    if (x === startLoc[0] && y === startLoc[1]) return;
    if (MouseDown) {
      let newGrid = Grid.slice();
      if (!startDrag && !endDrag) {
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
      setGrid(newGrid)
    }
  }


  const handleMouseUp = (x, y) => {
    setMouseDown(false);
    if (x === null || y === null || x < 0 || y < 0) return;
    setStartDrag(false);
    setEndDrag(false);
  }



  const bidirectional_search = async () => {
    const biOutput = bidirectional(ROWS, COLS, startLoc, endLoc, Grid, chosenDirection);
    let closed_nodes = biOutput[0];
    const intersect = biOutput[1];

    // console.log("bi-biOutput=", biOutput);
    stepsBeforeExecution(closed_nodes);
    await draw_path_helper(closed_nodes, 1, "visited");
    let biPath = await findPathBidirectional(closed_nodes, intersect);
    setPath(biPath.slice(0,biPath.length-1));
    // console.log("Find path from closed=", biPath);
    await draw_path_helper(biPath, 1, "path");

  }


  const stepsBeforeExecution = (closed_nodes) => {
    setGrid(clear_visited_path(visitedPath, Grid));
    setGrid(clear_old_path(gridPath, Grid));
    setVisited(closed_nodes);
  }
  const stepsAfterExecution = async (closed_nodes) => {
    await draw_path_helper(closed_nodes, 1, "visited");
    await checkEndLocExists(closed_nodes);
  }
  const checkEndLocExists = async (closed_nodes) => {
    const lastElement = closed_nodes[closed_nodes.length - 1];
    if (lastElement[0] === endLoc[0] && lastElement[1] === endLoc[1]) {
      await find_path_from_closed_helper(closed_nodes);
    }
    else {
      setPath([]); //Necessary to trigger re-render of App
      setPath(null);
    }
  }

  const find_path_from_closed_helper = async (closed_nodes) => {
    let path = await find_path_from_closed(closed_nodes, startLoc);;
    setPath(path);

    await draw_path_helper(path, 1, "path");
  }

  const draw_path_helper = async (path, i, type) => {
    if (i > 0 && i <= path.length - 1) {
      let newGrid = await draw_path(Grid, path, i, type)
      setGrid(newGrid);
      await timeout(2);
      await draw_path_helper(path, i + 1, type);
    }


  }


  const startAlgorithm = async () => {
    if (isRunning) return;
    setRunning(true);

    setStartTime(performance.now());
    let closed_nodes;
    if (chosenAlgorithm === "A* Search") {
      closed_nodes = a_star_search(ROWS, COLS, startLoc, endLoc, Grid, chosenDirection);

    }
    else if (chosenAlgorithm === "Dijkstra") {
      closed_nodes = dijkstra_algorithm(ROWS, COLS, startLoc, endLoc, Grid, chosenDirection);
    }
    else if (chosenAlgorithm === "Breadth-First Search") {
      closed_nodes = bfs(ROWS, COLS, startLoc, endLoc, Grid, chosenDirection);
    }
    else if (chosenAlgorithm === "Depth-First Search") {
      closed_nodes = dfs(ROWS, COLS, startLoc, endLoc, Grid, chosenDirection);
    }
    else if (chosenAlgorithm === "Best-First Search") {
      closed_nodes = best_first(ROWS, COLS, startLoc, endLoc, Grid, chosenDirection);
    }
    else if (chosenAlgorithm === "Bidirectional search") {
      await bidirectional_search();
      setRunning(false);
      return;

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
