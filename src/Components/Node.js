import React, { useState, useEffect } from 'react';
import '../CSS/node.css';

function Node(props) {

  const x = props.x;
  const y = props.y;

  useEffect(() => {
    setWall(props.isWall) 
    setStart(props.isStart) 
    setEnd(props.isEnd)
    setPath(props.isPath)
    setVisited(props.isVisited)
    setBomb(props.isBomb)
  }, [props.isWall, props.isStart, props.isEnd, props.isPath, props.isVisited, props.isBomb])

  const [isWall, setWall] = useState(false);
  const [isStart, setStart] = useState(false);
  const [isEnd, setEnd] = useState(false);
  const [isPath, setPath] = useState(false);
  const [isVisited, setVisited] = useState(false);
  const [isBomb, setBomb] = useState(false);


  let className = "node";
  if (isEnd === true) {
    className = "end";
  }
  else if (isStart === true) {
    className = "start";
  }
  else if (isBomb === true) {
    className = "bomb";
  }
  else if (isWall === true) {
    className = "wall";
  }
  else if (isVisited === true) {
    className = "visited";
  }
  else if (isPath === true) {
    className = "path";
  }
  else {
    className = "node";
  }

  let mainBody = <div className={className} />;
  if (props.handleMouseEnter === undefined) {
    mainBody = <div className={className} />
  }
  else {
    mainBody = <div
      onMouseDown={() => props.handleMouseDown(x, y)}
      onMouseEnter={() => props.handleMouseEnter(x, y)}
      onMouseUp={() => props.handleMouseUp()}
      className={className} />
  }
  return (
    mainBody
  );
}

export default Node;
