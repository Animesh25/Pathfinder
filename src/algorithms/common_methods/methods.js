export const getSixNeighbours = (node, ROWS, COLS) => {
    // node=node.value
    // console.log("row in get neigbours=", ROWS);
    let neighbours = [];
    // console.log("niehgbours func node=",node.value)
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