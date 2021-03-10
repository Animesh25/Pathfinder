import {getFourNeighbours,getEightNeighbours} from './common_methods/methods';


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


    //                 -------Node------------ | Cost | Previous
    let removed=[];
    let stack = [[startLoc[0], startLoc[1], 0, null]];
    while (stack.length>=0 && stack.length<10000) {

        const head = stack[stack.length-1];
        console.log("stack =",stack);
        if (head === undefined) { 
            // stack.splice(stack.length-1,1);
            console.log("head=undefined so break"); 
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
        
        // unvisited = remove_from_unvisited(node_lowest_cost, unvisited);
     


    }
    
    console.log("dfs returns=",removed);
    return removed;


}
const update_cost = (node, cost, previous, unvisited) => {
    let found = false;
    for (let i = 0; i < unvisited.length; i++) {
        let current = unvisited[i];
        if (current[0] == node[0] && current[1] == node[1]) {
            found = true;
            if (unvisited[2] > cost) {
                unvisited[2] = cost;
                unvisited[3] = previous;
                return unvisited;
            }
        }
    }
    if (!found) unvisited.push([node[0], node[1], cost, previous]);
    return unvisited;
}
const remove_from_unvisited = (node, unvisited) => {

    for (let i = 0; i < unvisited.length; i++) {
        let current = unvisited[i];
        if (current[0] == node[0] && current[1] == node[1]) unvisited.splice(i, 1);
    }
    return unvisited;
}




const contains = (discovered_nodes, node) => {
    for (let i = 0; i < discovered_nodes.length; i++) {
        if (discovered_nodes[i][0] === node[0] && discovered_nodes[i][1] === node[1]) {
            return true;
        }
    }
    return false;
}

const remove = (list, node) => {
    for (let i = 0; i < list.length; i++) {
        if (list[i][0] === node[0] && list[i][1] === node[1]) {
            return list.splice(i, 1);
        }
    }
}
const find_lowest_node = (unvisted) => {

    // console.log("find lowest slice=", copy);
    let min_cost = 10000000;
    let node;
    for (let i = 0; i < unvisted.length; i++) {
        if (unvisted[i][2] < min_cost) {
            min_cost = unvisted[i][2];
            node = unvisted[i];
        }

    }
    return node;
}

