
import {getFourNeighbours,getSixNeighbours} from './common_methods/methods';

export const findPath = (ROWS, COLS, startLoc, endLoc, Grid,chosenDirection) => {


    // console.log("rows=",ROWS," cols=",COLS," startLoc=",startLoc,"  endloc=",endLoc,"  grid=",Grid);

    let open_nodes = [[startLoc[0], startLoc[1], 0, 0, 0]];
    let closed_nodes = [];

    while (open_nodes.length > 0 && open_nodes.length < 20000) {

        const node_lowest_cost = find_lowest_node(open_nodes, closed_nodes);
        if (node_lowest_cost === undefined) break;

        // console.log("lowest=", node_lowest_cost);
        // console.log("chosen from", open_nodes);

        let neighbours;
        if(chosenDirection.indexOf("4")>-1){
            neighbours= getFourNeighbours(node_lowest_cost, ROWS, COLS);
        }
        else{
            neighbours= getSixNeighbours(node_lowest_cost, ROWS, COLS);
        }
        // console.log("neighbours================",neighbours);
        for (let i = 0; i < neighbours.length; i++) {
            const neighbour = neighbours[i];
            let g_score, h_score, f_score = 0;

            if (Grid[neighbour[0]][neighbour[1]].props.isWall) {
                continue;
                // console.log("isWall")
                // g_score = 10000;
                // h_score = 10000;
                // f_score = g_score + h_score;
            }
            else {
                g_score = node_lowest_cost[2] + 2;
                h_score = distance_from_end(neighbour,endLoc);
                f_score = g_score + h_score;
            }


            if (neighbour[0] === endLoc[0] && neighbour[1] === endLoc[1]) {
                closed_nodes.push(node_lowest_cost);
                closed_nodes.push([neighbour[0], neighbour[1], f_score, h_score, g_score, node_lowest_cost]);
                // console.log("end found");
                break;
            }

            if (contains(open_nodes, neighbour)) {
                // if (distance_from_start(neighbour) <= f_score) console.log("1st if ", neighbour);
            }
            else if (contains(closed_nodes, neighbour)) {
                // console.log("neighbour ", neighbour, " in closed list");
                // if (distance_from_start(neighbour) <= f_score) console.log("2nd if ", neighbour);
                // else {
                // console.log("closed_nodes l=", closed_nodes.length)
                remove(closed_nodes, neighbour);
                // console.log("closed_nodes AFTER l=", closed_nodes.length);
                open_nodes.push([neighbour[0], neighbour[1], f_score, h_score, g_score, node_lowest_cost]);
                // }

            }
            else {
                open_nodes.push([neighbour[0], neighbour[1], f_score, h_score, g_score, node_lowest_cost]);
            }
        }
        if (closed_nodes.length > 0) {
            const last_closed = closed_nodes[closed_nodes.length - 1];
            if (last_closed[0] === endLoc[0] && last_closed[1] === endLoc[1]) {       
                break;
            }
        }
        if (!contains(closed_nodes, node_lowest_cost)) {
            closed_nodes.push(node_lowest_cost);
        }
    }
    return closed_nodes;

}

 const getNeighbours = (node,ROWS,COLS) => {
    // node=node.value
    // console.log("row in get neigbours=",ROWS);
    let neighbours = [];
    // console.log("niehgbours func node=",node.value)
    if (node[0] > 0) {
        neighbours.push([node[0] - 1, node[1]]);
        if (node[1] > 0) {
            neighbours.push([node[0] - 1, node[1] - 1]);
        }
    }
    if (node[1] > 0) {
        neighbours.push([node[0], node[1] - 1]);
        if (node[0] < ROWS - 1) {
            neighbours.push([node[0] + 1, node[1] - 1]);
        }
    }
    if (node[0] < ROWS - 1) {
        neighbours.push([node[0] + 1, node[1]]);
        if (node[1] < COLS - 1) {
            neighbours.push([node[0] + 1, node[1] + 1]);
        }
    }
    if (node[1] < COLS - 1) {
        neighbours.push([node[0], node[1] + 1]);
        if (node[0] > 0) {
            neighbours.push([node[0] - 1, node[1] + 1]);
        }
    }

    return neighbours;

}
 const distance_from_start = (node,startLoc) => {
    const x = Math.abs(node[0] - startLoc[0]);
    const y = Math.abs(node[1] - startLoc[1]);
    return ((x * x) + (y * y))
}
 const distance_from_end = (node,endLoc) => {
    //  console.log("distance end====================================",node,"  endLoc=",endLoc);
    const x = Math.abs(node[0] - endLoc[0]);
    const y = Math.abs(node[1] - endLoc[1]);
    return ((x * x) + (y * y))

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
    let min_distance_to_end = 1000000;
    let node;
    for (let i = 0; i < discovered_nodes.length; i++) {
        if (discovered_nodes[i][2] < min_heuristic && !contains(path, discovered_nodes[i])) {
            min_heuristic = discovered_nodes[i][2];
            min_distance_to_end = discovered_nodes[i][3];
            node = discovered_nodes[i];
        }
        else if (discovered_nodes[i][2] === min_heuristic && discovered_nodes[i][3] < min_distance_to_end && !contains(path, discovered_nodes[i])) {
            min_heuristic = discovered_nodes[i][2];
            min_distance_to_end = discovered_nodes[i][3];
            node = discovered_nodes[i];
            // console.log("found lowest ", node);
        }
    }
    return node;
}

