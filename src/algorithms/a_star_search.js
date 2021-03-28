
import { getFourNeighbours, getEightNeighbours,contains,distanceFromEnd} from './common_methods/methods';
import BinaryHeap from '../Components/binaryHeap';




/*
        list        heap
add     1           O(logN)
findMin O(N)        O(1)
contains O(N)       o(N)

*/

export const a_star_search = (ROWS, COLS, startLoc, endLoc, Grid, chosenDirection) => {

    let open_nodes = new BinaryHeap();
    open_nodes.add([startLoc[0], startLoc[1], 0, 0, 0])
    let closed_nodes = [];

    while (open_nodes.length() >0 && open_nodes.length() < 1000) {

        let node_lowest_cost = open_nodes.removeMin();

        if (node_lowest_cost === undefined) break;

        let neighbours;
        if (chosenDirection.indexOf("4") > -1) {
            neighbours = getFourNeighbours(node_lowest_cost, ROWS, COLS);
        }
        else {
            neighbours = getEightNeighbours(node_lowest_cost, ROWS, COLS);
        }


        for (let i = 0; i < neighbours.length; i++) {
            const neighbour = neighbours[i][0];
            const isDiagonal = neighbours[i][1];
            let g_score, h_score, f_score = 0;

            if (Grid[neighbour[0]][neighbour[1]].props.isWall && !Grid[neighbour[0]][neighbour[1]].props.isEnd) {
                continue;
            }
            else {
                // const parent_f_cost=node_lowest_cost[node_lowest_cost.length-2];
                const parent_g_cost=node_lowest_cost[3];

                if (isDiagonal) g_score = parent_g_cost + 2.4;
                else g_score = parent_g_cost + 2;
                h_score = distanceFromEnd(neighbour, endLoc);
                f_score = g_score + h_score;
            }

            if (neighbour[0] === endLoc[0] && neighbour[1] === endLoc[1]) {
                closed_nodes.push(node_lowest_cost);
                closed_nodes.push([neighbour[0], neighbour[1], h_score, g_score, f_score,node_lowest_cost]);
                return closed_nodes;
            }
            
            if(!contains(closed_nodes, neighbour)){
                if(!open_nodes.contains(neighbour)){
                    open_nodes.add([neighbour[0], neighbour[1], h_score, g_score, f_score, node_lowest_cost]);
                }
                else{
                    const visitedNeighbour=open_nodes.get(neighbour);
                    const visited_g_score=visitedNeighbour[3];
                    if(visited_g_score>g_score){
                        // new path is better
                        open_nodes.remove(neighbour);
                        open_nodes.add([neighbour[0], neighbour[1], h_score, g_score, f_score, node_lowest_cost]);
                    }
                }
            }
            
            

           
        }
        open_nodes.remove(node_lowest_cost);
        closed_nodes.push(node_lowest_cost);
        
    }

    return closed_nodes;

}








