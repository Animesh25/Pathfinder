

export const dijkstra_algorithm = (ROWS, COLS, startLoc, endLoc, Grid) => {


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
    let visited = [];
    let unvisited = [[startLoc[0], startLoc[1], 0, null]];



    while (unvisited.length > 0 && unvisited.length < 20000) {

        const node_lowest_cost = find_lowest_node(unvisited);

        if (node_lowest_cost === undefined) { console.log("node_lowest=undefined so break"); break; }
        let neighbours = getNeighbours(node_lowest_cost, visited, ROWS, COLS);
        for (let i = 0; i < neighbours.length; i++) {
            const neighbour = neighbours[i];
            
            if (contains(visited, neighbour)) continue;
            let cost = 0;
            if (Grid[neighbour[0]][neighbour[1]].props.isWall) {
                continue
            }
            else {
                cost = 1 + node_lowest_cost[2];
            }
            if (neighbour[0] === endLoc[0] && neighbour[1] === endLoc[1]) {
                visited.push(node_lowest_cost);
                visited.push([neighbour[0], neighbour[1], cost, node_lowest_cost]);
                console.log("end found");
                return visited;
            }
            update_cost(neighbour, cost, node_lowest_cost, unvisited);

        }
        unvisited = remove_from_unvisited(node_lowest_cost, unvisited);
        visited.push(node_lowest_cost);
        console.log("visited=" + visited);
        console.log("not visited=" + unvisited);


    }
    return visited;


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

const getNeighbours = (node, visited, ROWS, COLS) => {
    // node=node.value
    console.log("row in get neigbours=", ROWS);
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
const distance_from_start = (node, startLoc) => {
    const x = Math.abs(node[0] - startLoc[0]);
    const y = Math.abs(node[1] - startLoc[1]);
    return ((x * x) + (y * y))
}
const distance_from_end = (node, endLoc) => {
    console.log("distance end====================================", node, "  endLoc=", endLoc);
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

