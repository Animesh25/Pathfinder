import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './CSS/grid.css';
import Node from './Components/Node';


function App() {

  const [Grid, setGrid] = useState([]);
  const [mouseDown, setMouseDown] = useState(false);
  const [startLoc,setStartLoc]=useState([5,5]);
  const [endLoc,setEndLoc]=useState([5,15]);
  const [startDrag,setStartDrag]=useState(false);
  const [endDrag,setEndDrag]=useState(false);
  useEffect(() => {
    setGrid(createGrid());
  }, []);

  

  const createGrid = () => {
    
    let grid = [];
    for (let y = 0; y < 10; y++) {
      grid.push([]);
      for (let x = 0; x < 30; x++) {
        grid[y].push(
          <Node
            handleMouseDown={() => handleMouseDown(x, y)}
            handleMouseEnter={() => handleMouseEnter(x, y)}
            handleMouseUp={() => handleMouseUp()}
            isWall={false} />
        );
      }
    }
    
    return grid;
  }


  const handleMouseDown = (x, y) => {
    // console.log("mouse down at", x, ",", y);
    setMouseDown(true);
    console.log("start drag-------------x,y=",x,",",y);
    console.log("start drag-------------startLoc0,startLoc1=",startLoc[0],",",startLoc[1]);
    if(x==startLoc[0] && y==startLoc[1]){
      setStartDrag(true);
    }
    else if(x==endLoc[0] && y==endLoc[1]){
      setEndDrag(true);
    }
    else{
      // else setStartDrag(false);
      let newGrid = Grid.slice();
      if (newGrid[x][y].props.isStart || newGrid[x][y].props.isEnd) return;
      // console.log("boolean=", newGrid[x][y].props.isWall)
      newGrid[x][y] =
        <Node
          key={y}
          handleMouseDown={() => handleMouseDown(x, y)}
          handleMouseEnter={() => handleMouseEnter(x, y)}
          handleMouseUp={() => handleMouseUp(x,y)}
          isWall={!newGrid[x][y].props.isWall} />

      // console.log("new grid[", x, "][", y, "]=", newGrid[x][y])
      setGrid(newGrid)
    }
    
  }
  const handleMouseEnter = (x, y) => {
    if (mouseDown) {
      let newGrid = Grid.slice();
      if ( (x!=startLoc[0] && y!=startLoc[1]) || (!newGrid[x][y].props.isStart && !newGrid[x][y].props.isEnd)) {
        newGrid[x][y] =
          <Node
            key={y}
            handleMouseDown={() => handleMouseDown(x, y)}
            handleMouseEnter={() => handleMouseEnter(x, y)}
            handleMouseUp={() => handleMouseUp(x,y)}
            isStart={false}
            isWall={!newGrid[x][y].props.isWall} />
      }
      if(startDrag){
        newGrid[x][y] =
        <Node
          key={y}
          handleMouseDown={() => handleMouseDown(x, y)}
          handleMouseEnter={() => handleMouseEnter(x, y)}
          handleMouseUp={() => handleMouseUp(x,y)}
          isStart={true}
          isWall={false} />
        newGrid[startLoc[0]][startLoc[1]] = <Node 
                      isWall={false} 
                      isStart={false} 
                      isEnd={false}
                      handleMouseDown={() => handleMouseDown(x,y)}
                      handleMouseEnter={() => handleMouseEnter(x,y)}
                      handleMouseUp={() => handleMouseUp(x,y)}
                    />;
        setStartLoc([x,y])
      }
      else if(endDrag){
          newGrid[x][y] =
          <Node
            key={y}
            handleMouseDown={() => handleMouseDown(x, y)}
            handleMouseEnter={() => handleMouseEnter(x, y)}
            handleMouseUp={() => handleMouseUp(x,y)}
            isStart={false}
            isEnd={true}
            isWall={false} />
          newGrid[endLoc[0]][endLoc[1]] = <Node 
                        isWall={false} 
                        isStart={false} 
                        isEnd={false}
                        handleMouseDown={() => handleMouseDown(x,y)}
                        handleMouseEnter={() => handleMouseEnter(x,y)}
                        handleMouseUp={() => handleMouseUp(x,y)}
                      />;
          setEndLoc([x,y])
      }
      setGrid(newGrid)
    }



  }
  const handleMouseUp = (x,y) => {
    setMouseDown(false);
    if(startDrag){
      setStart(x,y) 
    }
    else if(endDrag){
      // setEnd(x,y);
    }
    setStartDrag(false);
    setEndDrag(false);
  }

  const findPath = () => {
    const newGrid = Grid.slice();// doing a deep copy of the array
    newGrid[5][5] = <Node isWall={true} />;//This gets overwritten by renderCol
    setGrid(newGrid);

  }
  const setStart = (x,y) => {
    const newGrid = Grid.slice();// doing a deep copy of the array
    newGrid[startLoc[0]][startLoc[1]] = <Node 
                      isWall={false} 
                      isStart={true} 
                      isEnd={false}
                      handleMouseDown={() => handleMouseDown(x,y)}
                      handleMouseEnter={() => handleMouseEnter(x,y)}
                      handleMouseUp={() => handleMouseUp(x,y)}
                    />;
    newGrid[endLoc[0]][endLoc[1]] = <Node 
                                  isWall={false} 
                                  isStart={false} 
                                  isEnd={true}
                                  handleMouseDown={() => handleMouseDown(x,y)}
                                  handleMouseEnter={() => handleMouseEnter(x,y)}
                                  handleMouseUp={() => handleMouseUp(x,y)}
                                />;
    setGrid(newGrid);

  }
  const clearWalls = () => {
    let grid = [];
    for (let y = 0; y < 10; y++) {
      grid.push([]);
      for (let x = 0; x < 30; x++) {
        grid[y].push(
          <Node
            handleMouseDown={() => handleMouseDown(x, y)}
            handleMouseEnter={() => handleMouseEnter(x, y)}
            handleMouseUp={() => handleMouseUp(x,y)}
            isWall={false} 
            isStart={Grid[y][x].props.isStart} 
            isEnd={Grid[y][x].props.isEnd} />
        );
      }
    }
    setGrid(grid);
  }
  console.log("------------------------------------------");
  return (
    <div className="App">
      <button onClick={() => clearWalls()}>Clear Walls</button>
      <button onClick={() => setStart(startLoc[0],startLoc[1])}>set Start & End</button>
      <button>Find Path</button>
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
                    isStart={node.props.isStart}
                    handleMouseDown={() => handleMouseDown(yIndex, xIndex)}
                    handleMouseEnter={() => handleMouseEnter(yIndex, xIndex)}
                    handleMouseUp={() => handleMouseUp(yIndex,xIndex)}
                  />
                )

              })}
            </div>
          )

        })}
      </div>
    </div>
  );
}

export default App;
