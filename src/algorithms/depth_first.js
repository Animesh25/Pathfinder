import {getFourNeighbours,getEightNeighbours,contains} from './common_methods/methods';


export const dfs = (ROWS, COLS, startLoc, endLoc, Grid,chosenDirection) => {

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

    let removed=[];
    let stack = [[startLoc[0], startLoc[1], 0, null]];
    while (stack.length>=0 && stack.length<100000) {

        const head = stack[stack.length-1];
        if (head === undefined) { 
            break; 
        }
        removed.push(head);
        stack.splice(stack.length-1,1);
        

        let neighbours;

        if(chosenDirection.indexOf("4")>-1){
            neighbours= getFourNeighbours(head, ROWS, COLS);
        }
        else{
            neighbours= getEightNeighbours(head, ROWS, COLS);
        }
        
        for (let i = 0; i < neighbours.length; i++) {
            const neighbour = neighbours[i][0];
            const isDiagonal=neighbours[i][1];
            //if node already in stack, then remove it and push it to the back
            if (contains(removed,neighbour)) continue;
            let cost = 0;
            if (Grid[neighbour[0]][neighbour[1]].props.isWall && !Grid[neighbour[0]][neighbour[1]].props.isEnd) {
                continue
            }
            else {
                if(isDiagonal) cost = 1.41 + head[2];
                else cost = 1 + head[2];
            }
            stack.push([neighbour[0], neighbour[1], cost, head]);
            if (neighbour[0] === endLoc[0] && neighbour[1] === endLoc[1]) {
                removed.push(head);
                removed.push([neighbour[0], neighbour[1], cost, head]);
                return removed;
            }  

        }

    }

    return removed;


}






