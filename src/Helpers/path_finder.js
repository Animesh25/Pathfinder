import Node from '../Components/Node';

export function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
}

export const find_path_from_closed = async (closed_nodes, startLoc) => {
    console.log("given=", closed_nodes);
    let path = [];
    let found_start = false;
    let last = closed_nodes[closed_nodes.length - 1];
    while (found_start === false) {
        path.unshift(last);
        
        if (last === undefined || last===null) break;
        if (last[0] === startLoc[0] && last[1] === startLoc[1]) found_start = true;
        else {
            last = last[last.length - 1];
        }
    }
    console.log("find_path_from_closed", path);
    return path;
}
export const findPathBidirectional = async (closed_nodes, targetNode) => {
    // 1. Find 1st intersect
    //Backtrack from it
    let path = [];
    let intersectOne;
    for (let i = 0; i < closed_nodes.length; i++) {
        const node = closed_nodes[i];
        if (node[0] === targetNode[0] && node[1] === targetNode[1]) {
            intersectOne = node;
            break;
        }
    }
    let one = backTrack(intersectOne);
    let two = backTrack(targetNode);

    // let pathA=

    return one.concat(two);
}
const backTrack = (node) => {
    let list = [node];
    let iterator = node;
    while (iterator !== undefined && iterator[3] !== null) {
        list.push(iterator[3]);
        iterator = iterator[3];
    }
    // console.log("backTrack from node=",node," is=",list);
    return list;
}
export const draw_path = async (Grid, path, i, type) => {
    const newGrid = Grid.slice();
    if (i > 0 && i <= path.length - 1) {
        const x = path[i][0];
        const y = path[i][1];
        if (x === undefined || y === undefined) return newGrid;
        if (newGrid[x][y].props.isBomb) return newGrid;
        if (type === "visited") {
            newGrid[x][y] = <Node
                isWall={false}
                isBomb={Grid[x][y].props.isBomb}
                isStart={Grid[x][y].props.isStart}
                isEnd={Grid[x][y].props.isEnd}
                isPath={false}
                isVisited={true}
            />;
        }
        else {
            newGrid[x][y] = <Node
                isWall={false}
                isBomb={Grid[x][y].props.isBomb}
                isStart={Grid[x][y].props.isStart}
                isEnd={Grid[x][y].props.isEnd}
                isPath={true}
                isVisited={false}
            />;
        }
    }
    return newGrid;


}
export const createBombVisit = (firstList, secondList) => {
    console.log("secondList=", secondList);
    console.log("firstList*=", firstList);

    secondList.shift();
    // secondList[secondList.length - 1][secondList[0].length - 1] = firstList[firstList.length - 1];
    secondList[0][secondList[0].length - 1] = firstList[firstList.length - 1];
    const finalList = firstList.concat(secondList);
    
    
    return finalList;
    
}