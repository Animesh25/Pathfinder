
/*
  Returns the Top,Left,Bottom, Right and diagonal nodes of a given node (if they exist)
*/
export const getEightNeighbours = (node, ROWS, COLS) => {
    let neighbours = [];
    if (node[0] > 0) {
        neighbours.push([[node[0] - 1, node[1]],false]);
        if (node[1] > 0) {
            neighbours.push([[node[0] - 1, node[1] - 1],true]);
        }
    }
    if (node[1] > 0) {
        neighbours.push([[node[0], node[1] - 1],false]);
        if (node[0] < ROWS - 1) {
            neighbours.push([[node[0] + 1, node[1] - 1],true]);
        }
    }
    if (node[0] < ROWS - 1) {
        neighbours.push([[node[0] + 1, node[1]],false]);
        if (node[1] < COLS - 1) {
            neighbours.push([[node[0] + 1, node[1] + 1],true]);
        }
    }
    if (node[1] < COLS - 1) {
        neighbours.push([[node[0], node[1] + 1],false]);
        if (node[0] > 0) {
            neighbours.push([[node[0] - 1, node[1] + 1],true]);
        }
    }

    return neighbours;
}

/*
  Returns the Top,Left,Bottom and Right nodes of a given node (if they exist)
*/
export const getFourNeighbours = (node, ROWS, COLS) => {
    let neighbours = [];
    if (node[0] > 0) {
        neighbours.push([[node[0] - 1, node[1]],false]);
    }
    if (node[1] > 0) {
        neighbours.push([[node[0], node[1] - 1],false]);
    }
    if (node[0] < ROWS - 1) {
        neighbours.push([[node[0] + 1, node[1]],false]);
    }
    if (node[1] < COLS - 1) {
        neighbours.push([[node[0], node[1] + 1],false]);
    }

    return neighbours;

}
/*
    chceks to see if a node is within a given array
*/
export const contains = (discovered_nodes, node) => {
    for (let i = 0; i < discovered_nodes.length; i++) {
        if (discovered_nodes[i][0] === node[0] && discovered_nodes[i][1] === node[1]) {
            return true;
        }
    }
    return false;
}
/*
    Calculates the euclidean distance between 2 nodes
*/
export const distanceFromEnd = (node, endLoc) => {
    const x = Math.abs(node[0] - endLoc[0]);
    const y = Math.abs(node[1] - endLoc[1]);
    return ((x * x) + (y * y))

}