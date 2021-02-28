import { getFourNeighbours, getEightNeighbours } from './common_methods/methods';
import BinaryHeap from '../Components/binaryHeap';


export const best_first = (ROWS, COLS, startLoc, endLoc, Grid, chosenDirection) => {
    console.log("rows=", ROWS, " cols=", COLS, " startLoc=", startLoc, "  endloc=", endLoc, "  grid=", Grid);

    let open_nodes = new BinaryHeap();
    open_nodes.add([startLoc[0], startLoc[1], 0, 0, 0])
    let closed_nodes = [];

    while (open_nodes.length() > 0 && open_nodes.length() < 2000) {

        const node_lowest_cost = open_nodes.removeMin();

        if (node_lowest_cost === undefined) break;

        console.log("lowest=", node_lowest_cost);


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
                h_score = distance_from_end(neighbour, endLoc);
            }

            if (neighbour[0] === endLoc[0] && neighbour[1] === endLoc[1]) {
                closed_nodes.push(node_lowest_cost);
                closed_nodes.push([neighbour[0], neighbour[1], h_score, node_lowest_cost]);
                console.log("end found at:", endLoc);
                return closed_nodes;
            }

            if (open_nodes.contains(neighbour)) {
                const visitedNeighbour = open_nodes.get(neighbour);
                const visited_h_score = visitedNeighbour[visitedNeighbour.length - 2];
                if (visited_h_score >= h_score) {
                    open_nodes.remove(neighbour);
                    open_nodes.add([neighbour[0], neighbour[1], h_score, node_lowest_cost]);
                }
            }
            else if (contains(closed_nodes, neighbour)) {
                continue;
            }
            else {
                open_nodes.add([neighbour[0], neighbour[1], h_score, node_lowest_cost]);
            }
        }

        if (!contains(closed_nodes, node_lowest_cost)) {
            closed_nodes.push(node_lowest_cost);
        }
    }

    return closed_nodes;

}

// export const best_first = (ROWS, COLS, startLoc, endLoc, Grid,chosenDirection) => {


//     console.log("rows=",ROWS," cols=",COLS," startLoc=",startLoc,"  endloc=",endLoc,"  grid=",Grid);

//     let open_nodes = new BinaryHeap();
//     open_nodes.add([startLoc[0], startLoc[1], 0, 0, 0])
//     let closed_nodes = [];

//     while (open_nodes.length() > 0 && open_nodes.length() < 20000) {
//         const node_lowest_cost = find_lowest_node(open_nodes, closed_nodes);
//         if (node_lowest_cost === undefined) break;

//         // console.log("lowest=", node_lowest_cost);
//         // console.log("chosen from", open_nodes);


//         let neighbours;

//         if(chosenDirection.indexOf("4")>-1){
//             neighbours= getFourNeighbours(node_lowest_cost, ROWS, COLS);
//         }
//         else{
//             neighbours= getEightNeighbours(node_lowest_cost, ROWS, COLS);
//         }
//         // console.log("neighbours================",neighbours);
//         for (let i = 0; i < neighbours.length; i++) {
//             const neighbour = neighbours[i][0];
//             const isDiagonal=neighbours[i][1];
//             let h_score= 0;

//             if (Grid[neighbour[0]][neighbour[1]].props.isWall && !Grid[neighbour[0]][neighbour[1]].props.isEnd) {
//                 continue;
//             }
//             else {
//                 h_score = distance_from_end(neighbour,endLoc);
//             }


//             if (neighbour[0] === endLoc[0] && neighbour[1] === endLoc[1]) {
//                 closed_nodes.push(node_lowest_cost);
//                 closed_nodes.push([neighbour[0], neighbour[1], h_score, node_lowest_cost]);
//                 // console.log("end found");
//                 return closed_nodes;
//             }

//             if (contains(open_nodes, neighbour)) {
//                 // if (distance_from_start(neighbour) <= f_score) console.log("1st if ", neighbour);
//             }
//             else if (contains(closed_nodes, neighbour)) {
//                 // console.log("neighbour ", neighbour, " in closed list");
//                 // if (distance_from_start(neighbour) <= f_score) console.log("2nd if ", neighbour);
//                 // else {
//                 // console.log("closed_nodes l=", closed_nodes.length)
//                 remove(closed_nodes, neighbour);
//                 // console.log("closed_nodes AFTER l=", closed_nodes.length);
//                 open_nodes.push([neighbour[0], neighbour[1],h_score, node_lowest_cost]);
//                 // }

//             }
//             else {
//                 open_nodes.push([neighbour[0], neighbour[1], h_score, node_lowest_cost]);
//             }
//         }
//         if (closed_nodes.length > 0) {
//             const last_closed = closed_nodes[closed_nodes.length - 1];
//             if (last_closed[0] === endLoc[0] && last_closed[1] === endLoc[1]) {
//                 return closed_nodes;
//             }
//         }

//         if (!contains(closed_nodes, node_lowest_cost)) {
//             closed_nodes.push(node_lowest_cost);
//         }

//         // remove(open_nodes, node_lowest_cost);
//         // console.log("dn=", open_nodes);


//         // break
//     }
//     // console.log("path=", closed_nodes);

//     return closed_nodes;

// }



const distance_from_end = (node, endLoc) => {
    //  console.log("distance end====================================",node,"  endLoc=",endLoc);
    const x = Math.abs(node[0] - endLoc[0]);
    const y = Math.abs(node[1] - endLoc[1]);
    return Math.sqrt((x * x) + (y * y))

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
const find_lowest_node = (discovered_nodes, path) => {
    const copy = discovered_nodes.slice();
    // console.log("find lowest slice=", copy);
    let min_heuristic = 10000000;
    let node;
    for (let i = 0; i < discovered_nodes.length; i++) {
        if (discovered_nodes[i][2] < min_heuristic && !contains(path, discovered_nodes[i])) {
            min_heuristic = discovered_nodes[i][2];
            node = discovered_nodes[i];
        }
    }
    return node;
}

