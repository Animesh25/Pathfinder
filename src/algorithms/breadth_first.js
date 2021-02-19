import {getFourNeighbours,getSixNeighbours} from './common_methods/methods';


export const bfs = (ROWS, COLS, startLoc, endLoc, Grid,chosenDirection) => {


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
    let removed=[];
    let queue = [[startLoc[0], startLoc[1], 0, null]];
    while (queue.length>0) {

        const head = queue[0];

        if (head === undefined) { console.log("head=undefined so break"); break; }

        let neighbours;
        if(chosenDirection.indexOf("4")>-1){
            neighbours= getFourNeighbours(head, ROWS, COLS);
        }
        else{
            neighbours= getSixNeighbours(head, ROWS, COLS);
        }

        for (let i = 0; i < neighbours.length; i++) {
            const neighbour = neighbours[i];
            
            if (contains(queue, neighbour) || contains(removed,neighbour)) continue;
            let cost = 0;
            if (Grid[neighbour[0]][neighbour[1]].props.isWall) {
                continue
            }
            else {
                cost = 1 + head[2];
            }
            queue.push([neighbour[0], neighbour[1], cost, head]);
            if (neighbour[0] === endLoc[0] && neighbour[1] === endLoc[1]) {
                removed.push(queue.shift());
                removed.push([neighbour[0], neighbour[1], cost, head]);
                return removed;
            }  

        }
        removed.push(queue.shift());
        // unvisited = remove_from_unvisited(node_lowest_cost, unvisited);
     


    }
    return removed;


}





const contains = (discovered_nodes, node) => {
    for (let i = 0; i < discovered_nodes.length; i++) {
        if (discovered_nodes[i][0] === node[0] && discovered_nodes[i][1] === node[1]) {
            return true;
        }
    }
    return false;
}



