import {getFourNeighbours,getEightNeighbours,contains} from './common_methods/methods';
import BinaryHeap from '../Components/binaryHeap';


export const dijkstra_algorithm = (ROWS, COLS, startLoc, endLoc, Grid,chosenDirection) => {
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


   
    let visited = [];
    let unvisited =new BinaryHeap();
    unvisited.add([startLoc[0], startLoc[1], 0, null]);



    while (unvisited.length() > 0 && unvisited.length() < 20000) {

        const node_lowest_cost = unvisited.removeMin();
        
        if (node_lowest_cost[0] === endLoc[0] && node_lowest_cost[1] === endLoc[1]) {
            visited.push(node_lowest_cost);
            return visited;
        }
        
        let neighbours;
        if (node_lowest_cost === undefined) {break; }
        
        if(chosenDirection.indexOf("4")>-1){
            neighbours= getFourNeighbours(node_lowest_cost, ROWS, COLS);
        }
        else{
            neighbours= getEightNeighbours(node_lowest_cost, ROWS, COLS);
        }
        
        
        
        for (let i = 0; i < neighbours.length; i++) {
            const neighbour = neighbours[i][0];
            const isDiagonal=neighbours[i][1];
            if (contains(visited, neighbour)) continue;
            let cost = 0;
            if (Grid[neighbour[0]][neighbour[1]].props.isWall && !Grid[neighbour[0]][neighbour[1]].props.isEnd) {
                continue
            }
            else {
                if(isDiagonal) cost = 1.41 + node_lowest_cost[2];
                else cost = 1 + node_lowest_cost[2];
                
            }
            
            unvisited=update_cost(neighbour, cost, node_lowest_cost, unvisited);

        }
        unvisited.remove(node_lowest_cost);
        
        visited.push(node_lowest_cost);
      


    }
    return visited;


}

const update_cost = (node, cost, previous, unvisited) => {
    
    if(unvisited.contains(node)){
        const visitedNode=unvisited.get(node);
        const visitedCost=visitedNode[visitedNode.length-2];
        if(visitedCost>cost){
            unvisited.remove(node);
            unvisited.add([node[0], node[1], cost, previous]);
        }
        
    }
    else unvisited.add([node[0], node[1], cost, previous]);
    
    return unvisited;
    
}
