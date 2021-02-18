import Node from '../Components/Node';

export function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
}

export const find_path_from_closed = async (closed_nodes, startLoc) => {
    let path = [];
    let found_start = false;
    let last = closed_nodes[closed_nodes.length - 1];
    while (found_start === false) {
        path.unshift(last);
        if (last === undefined) break;
        if (last[0] === startLoc[0] && last[1] === startLoc[1]) found_start = true;
        else {
            last = last[last.length - 1];
        }
    }
    return path;
}
export const draw_path = async (Grid, path, i, type) => {
    const newGrid = Grid.slice();
    if (i > 0 && i < path.length - 1) {
        const x = path[i][0];
        const y = path[i][1]
        // console.log("node=", x, y);
        // console.log(newGrid[x][y])
        if (type === "visited") {
            newGrid[x][y] = <Node
                isWall={false}
                isStart={Grid[x][y].props.isStart}
                isEnd={Grid[x][y].props.isEnd}
                isPath={false}
                isVisited={true}
            />;
        }
        else {
            newGrid[x][y] = <Node
                isWall={false}
                isStart={Grid[x][y].props.isStart}
                isEnd={Grid[x][y].props.isEnd}
                isPath={true}
                isVisited={false}
            />;
        }
    }
    return newGrid;


}