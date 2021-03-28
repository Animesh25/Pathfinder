import { getFourNeighbours, getEightNeighbours,contains} from './common_methods/methods';

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
            return [removed,intersect];
        } 
        
    }
    
    return [removed,intersect];


}

const update_queue = (queue,ROWS,COLS,Grid,chosenDirection) => {
    const head = queue[0];
    if (head === undefined) {queue.shift(); return queue }
    
    if(contains(removed,head)){
        intersect=head;
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
            continue
        }
        else {
            if (isDiagonal) cost = 1.41 + head[2];
            else cost = 1 + head[2];
        }
        queue.push([neighbour[0], neighbour[1], cost, head]);
    }
    removed.push(queue.shift());
    return [queue,false];

}







