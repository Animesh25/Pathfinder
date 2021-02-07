import React, { useState, useEffect } from 'react';
import '../CSS/node.css';

function Node(props) {

  const x = props.x;
  const y = props.y;

  useEffect(() => {
    setWall(props.isWall) //> I'm dispatching an action here.
    setStart(props.isStart) //> I'm dispatching an action here.
    setEnd(props.isEnd)
    setPath(props.isPath)
    setVisited(props.isVisited)
  }, [props.isWall, props.isStart, props.isEnd,props.isPath,props.isVisited])

  const [isWall, setWall] = useState(false);
  const [isStart, setStart] = useState(false);
  const [isEnd, setEnd] = useState(false);
  const [isPath, setPath] = useState(false);
  const [isVisited, setVisited] = useState(false);


  let className = "node";
  if (isWall === true) {
    className = "wall";
  }
  else if (isVisited === true) {
    className = "visited";
  }
  else if (isPath === true) {
    className = "path";
  }
  else if (isStart === true) {
    className = "start";
  }
  else if (isEnd === true) {
    className = "end";
  }
  else {
    className = "node";
  }

  return (
    <div
      onMouseDown={() => props.handleMouseDown(x, y)}
      onMouseEnter={() => props.handleMouseEnter(x, y)}
      onMouseUp={() => props.handleMouseUp()}
      className={className} />
  );
}

export default Node;
