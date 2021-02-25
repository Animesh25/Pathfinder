import React, { useState, useEffect } from 'react';
import Node from './Node';
import '../CSS/grid.css';

export default function Results(props) {

    useEffect(() => {
        // setStartTime(props.startTime);
        if(props.content===null){
            setBody(body + '\nNo path found for: '+props.chosenAlgorithm);
        }
        else if (props.content.length !== 0) {
            const timeTaken=Math.round((performance.now() - props.startTime)/1000 * 100) / 100
            
            setBody(body + '\n'+props.chosenAlgorithm+' Algorithm & Path Length = ' + props.content.length + " & Time Taken = " + timeTaken+" seconds")
        }

    }, [props.content])


    const [body, setBody] = useState("");



    return (
        <div className={"resultContainer"}>
            <h3 className={"resultHeader"}>Results</h3>
            <div className="resultBody">
                {body.split('\n').map(line => <p>{line}</p>)}
            </div>
        </div>
    )
}
