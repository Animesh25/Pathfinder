import { getFourNeighbours, getEightNeighbours } from './common_methods/methods';

let removed = [];
let intersect;
export const bidirectional = (ROWS, COLS, startLoc, endLoc, Grid, chosenDirection) => {
    removed=[];

    /*
    create unvisited list
        Node | Cost (from start) | Previous node
    
    1. Assign starting node cost=0
    2. Assign all other nodes cost=10000
    3. Assign none for previous for all nodes

    create visited list
    
    REPEAT 
    4. Choose lowest cost node - from unvisited and put into visited
    5.Get node neighbours that are unvisited
    6.Update unvisted list costs
        if current cost+new node edge cost> new node current cost
            don't update the cost
        else 
            update cost and previous
    
    */


    //                 -------Node------------ | Cost | Previous
    
    let start_queue = [[startLoc[0], startLoc[1], 0, null]];
    let end_queue = [[endLoc[0], endLoc[1], 0, null]];
    let startResult,endResult

    while (start_queue.length > 0) {

        const updateStart=update_queue(start_queue,ROWS,COLS,Grid,chosenDirection);
        start_queue=updateStart[0];
        startResult=updateStart[1];

        const updateEnd=update_queue(end_queue,ROWS,COLS,Grid,chosenDirection);
        end_queue=updateEnd[0];
        endResult=updateEnd[1];
                
        if(startResult || endResult){
            console.log("removed before=", [removed,(intersect[0],intersect[1])]);
            return [removed,intersect];
        } 
        
    }
    
    return [removed,intersect];


}

const update_queue = (queue,ROWS,COLS,Grid,chosenDirection) => {
    const head = queue[0];
    if (head === undefined) { console.log("head=undefined so break"); queue.shift(); return queue }
    
    if(contains(removed,head)){
        intersect=head;
        console.log("head=",head,"  in queue");
        removed.push(head);
        return [queue,true]
    } 
    
    let neighbours;
    if (chosenDirection.indexOf("4") > -1) {
        neighbours = getFourNeighbours(head, ROWS, COLS);
    }
    else {
        neighbours = getEightNeighbours(head, ROWS, COLS);
    }

    for (let i = 0; i < neighbours.length; i++) {
        const neighbour = neighbours[i][0];
        const isDiagonal = neighbours[i][1];

        if (contains(queue, neighbour) || contains(removed, neighbour)) continue;
        let cost = 0;
        if (Grid[neighbour[0]][neighbour[1]].props.isWall && !Grid[neighbour[0]][neighbour[1]].props.isEnd) {
            console.log("---------------------------------------")
            continue
        }
        else {
            if (isDiagonal) cost = 1.41 + head[2];
            else cost = 1 + head[2];
        }
        queue.push([neighbour[0], neighbour[1], cost, head]);
        // if (neighbour[0] === endLoc[0] && neighbour[1] === endLoc[1]) {
        //     removed.push(queue.shift());
        //     removed.push([neighbour[0], neighbour[1], cost, head]);
        //     return removed;
        // }

    }
    removed.push(queue.shift());
    return [queue,false];
    // unvisited = remove_from_unvisited(node_lowest_cost, unvisited);

}




const contains = (discovered_nodes, node) => {
    for (let i = 0; i < discovered_nodes.length; i++) {
        if (discovered_nodes[i][0] === node[0] && discovered_nodes[i][1] === node[1]) {
            return true;
        }
    }
    return false;
}



