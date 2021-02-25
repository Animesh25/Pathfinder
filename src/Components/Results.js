import React, { useState, useEffect } from 'react';
import Node from './Node';
import '../CSS/grid.css';

export default function Results(props) {

    useEffect(() => {
        setContent(props.content) //> I'm dispatching an action here.
        // setStartTime(props.startTime);
        setBody(body + '\nPath Length = ' + props.content.length + " & Time Taken = " + (performance.now() - props.startTime))
    }, [props.content])
    const [content, setContent] = useState(props.content);

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
