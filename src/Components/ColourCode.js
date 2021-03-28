import React from 'react';
import Node from './Node';
import '../CSS/grid.css';

export default function ColourCode(props) {
    return (
        <div className="keySet">
            <div className="key">
                <Node
                    key={-1}
                    isWall={true}
                    isEnd={false}
                    isPath={false}
                    isVisited={false}
                    isStart={false}
                    
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
                    
                />
                <h3>Path</h3>
            </div>
            <div className="key">
                <Node
                    key={-1}
                    isWall={false}
                    isEnd={false}
                    isPath={false}
                    isVisited={false}
                    isStart={false}
                    isBomb={true}
                    
                />
                <h4>Bomb Node</h4>
            </div>

        </div>
    )
}
