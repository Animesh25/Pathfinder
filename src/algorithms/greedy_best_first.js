import { getFourNeighbours, getEightNeighbours,contains,distanceFromEnd} from './common_methods/methods';
import BinaryHeap from '../Components/binaryHeap';


export const greedy_best_first = (ROWS, COLS, startLoc, endLoc, Grid, chosenDirection) => {
    let open_nodes = new BinaryHeap();
    open_nodes.add([startLoc[0], startLoc[1], 0, 0, 0])
    let closed_nodes = [];

    while (open_nodes.length() > 0 && open_nodes.length() < 20000) {

        const node_lowest_cost = open_nodes.removeMin();

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
            let h_score;

            if (Grid[neighbour[0]][neighbour[1]].props.isWall && !Grid[neighbour[0]][neighbour[1]].props.isEnd) {
                continue;
            }
            else {
                h_score = distanceFromEnd(neighbour, endLoc);
            }

            if (neighbour[0] === endLoc[0] && neighbour[1] === endLoc[1]) {
                closed_nodes.push(node_lowest_cost);
                closed_nodes.push([neighbour[0], neighbour[1], h_score, node_lowest_cost]);

                return closed_nodes;
            }

            if(!contains(closed_nodes, neighbour)){
                if(!open_nodes.contains(neighbour)){
                    open_nodes.add([neighbour[0], neighbour[1], h_score,node_lowest_cost]);
                }
                else{
                    const visitedNeighbour=open_nodes.get(neighbour);
                    const visited_h_score=visitedNeighbour[visitedNeighbour.length-2];
                    if(visited_h_score>h_score){
                        // new path is better
                        open_nodes.remove(neighbour);
                        open_nodes.add([neighbour[0], neighbour[1], h_score,node_lowest_cost]);
                    }
                }
            }
        }
        open_nodes.remove(node_lowest_cost);
            closed_nodes.push(node_lowest_cost);
    }

    return closed_nodes;

}







