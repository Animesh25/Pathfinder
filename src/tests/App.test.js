import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';

import Node from '../Components/Node';
import {findPathFromClosed, findPathBidirectional } from '../Helpers/path_finder';
import { makeMaze } from '../Helpers/maze_creation';



const a_star = require("../algorithms/a_star_search");
const dijkstra = require("../algorithms/dijkstra");
const breadth_first = require("../algorithms/breadth_first");
const depth_first = require("../algorithms/depth_first");
const greedy_best_first = require("../algorithms/greedy_best_first");
const bidirectional_search = require("../algorithms/bidirectional_search");




it("renders everything without crashing", () => {
    const root = document.createElement("div");
    ReactDOM.render(<App />, root)
});

it("renders buttons properly", () => {
    const root = document.createElement("div");
    ReactDOM.render(<App />, root)
});



let startLoc = [5, 5];
let endLoc = [5, 15];
const ROWS = 18;
const COLS = 55;
const createGrid = () => {

    let grid = [];
    for (let y = 0; y < ROWS; y++) {
        grid.push([]);
        for (let x = 0; x < COLS; x++) {
            grid[y].push(
                <Node

                    isWall={false} />
            );
        }
    }
    grid[startLoc[0]][startLoc[1]] = <Node
        isWall={false}
        isStart={true}
        isEnd={false}
        isPath={false}
        isVisited={false}

    />;
    grid[endLoc[0]][endLoc[1]] = <Node
        isWall={false}
        isStart={false}
        isPath={false}
        isVisited={false}
        isEnd={true}

    />;

    return grid;
}
const runAlgorithm = async (name, startLoc, endLoc, grid, neighbourEval) => {
    name = name.toLowerCase();
    let result = [];
    if (name === "a*") {
        result = a_star.a_star_search(ROWS, COLS, startLoc, endLoc, grid, neighbourEval);
    }
    else if (name === "best first") {
        result = greedy_best_first.greedy_best_first(ROWS, COLS, startLoc, endLoc, grid, neighbourEval);
    }
    else if (name === "dijkstra") {
        result = dijkstra.dijkstra_algorithm(ROWS, COLS, startLoc, endLoc, grid, neighbourEval);
    }
    else if (name === "breadth first") {
        result = breadth_first.bfs(ROWS, COLS, startLoc, endLoc, grid, neighbourEval);
    }
    else if (name === "depth first") {
        result = depth_first.dfs(ROWS, COLS, startLoc, endLoc, grid, neighbourEval);
    }
    else if (name === "bidirectional") {
        const result = bidirectional_search.bidirectional(ROWS, COLS, startLoc, endLoc, grid, neighbourEval);
        let closed_nodes = result[0];
        const intersect = result[1];
        let path = await findPathBidirectional(closed_nodes, intersect);
        return path;

    }
    const path = await findPathFromClosed(result, startLoc);
    return path;
}
describe("A* tests", () => {
    let grid = createGrid();
    it("A* test - Path around Wall", async () => {
        const newGrid = makeMaze(startLoc, endLoc, grid, "maze 1");
        startLoc = [5, 5]
        endLoc = [5, 15];
        let path = await runAlgorithm("a*", startLoc, endLoc, newGrid, "8");
        expect(path.length).toBe(19);

    });
    it("A* test - Horizontal", async () => {
        grid = createGrid();
        startLoc = [5, 5];
        endLoc = [5, 15];
        let path = await runAlgorithm("a*", startLoc, endLoc, grid, "4");
        expect(path.length).toBe(11);
    });


    it("A* test - Horizontal close", async () => {
        startLoc = [5, 5];
        endLoc = [5, 6];

        let path = await runAlgorithm("a*", startLoc, endLoc, grid, "4");
        expect(path.length).toBe(2);


    });
    it("A* test - Diagonal", async () => {
        startLoc = [0, 0]
        endLoc = [8, 8];

        let path = await runAlgorithm("a*", startLoc, endLoc, grid, "8");
        expect(path.length).toBe(10);


    });

    it("A* test - No Path", async () => {
        const newGrid = makeMaze(startLoc, endLoc, grid, "small boxed");
        startLoc = [5, 5]
        endLoc = [5, 15];

        let path = await runAlgorithm("a*", startLoc, endLoc, newGrid, "8");
        const length = path.length;
        const containsEnd = (path[length - 1][0] === endLoc[0]) && (path[length - 1][1] === endLoc[1])
        expect(containsEnd).toBe(false);


    });
})
describe("Greedy Best First  tests", () => {
    let grid = createGrid();
    it("Greedy Best First test - Path around Wall", async () => {
        const newGrid = makeMaze(startLoc, endLoc, grid, "maze 1");
        startLoc = [5, 5]
        endLoc = [5, 15];
        // 
        let path = await runAlgorithm("best first", startLoc, endLoc, newGrid, "8");
        expect(path.length).toBe(19);
        // 
    });

    it("Greedy Best First test - Horizontal", async () => {
        grid = createGrid();
        startLoc = [5, 5];
        endLoc = [5, 15];

        const path = await runAlgorithm("best first", startLoc, endLoc, grid, "4");
        expect(path.length).toBe(11);


    });

    it("Greedy Best First test - Horizontal close", async () => {
        startLoc = [5, 5];
        endLoc = [5, 6];
        // 
        const path = await runAlgorithm("best first", startLoc, endLoc, grid, "4");
        expect(path.length).toBe(2);

        // 
    });
    it("Greedy Best First test - Diagonal", async () => {
        startLoc = [0, 0]
        endLoc = [8, 8];

        const path = await runAlgorithm("best first", startLoc, endLoc, grid, "8");
        expect(path.length).toBe(10);


    });
    it("Greedy Best First test - No Path", async () => {
        grid = makeMaze(startLoc, endLoc, grid, "small boxed");
        startLoc = [5, 5]
        endLoc = [5, 15];

        let path = await runAlgorithm("best first", startLoc, endLoc, grid, "8");
        const length = path.length;
        const containsEnd = (path[length - 1][0] === endLoc[0]) && (path[length - 1][1] === endLoc[1])
        expect(containsEnd).toBe(false);


    });
})

describe("Dijkstra tests", () => {
    let grid = createGrid();
    it("Dijkstra test - Path around Wall", async () => {
        const newGrid = makeMaze(startLoc, endLoc, grid, "maze 1");
        startLoc = [5, 5]
        endLoc = [5, 15];

        let path = await runAlgorithm("dijkstra", startLoc, endLoc, newGrid, "8");
        expect(path.length).toBe(19);


    });
    it("Dijkstra test - Horizontal", async () => {
        grid = createGrid();
        startLoc = [5, 5]
        endLoc = [5, 15];

        let path = await runAlgorithm("dijkstra", startLoc, endLoc, grid, "4");
        expect(path.length).toBe(11);


    });

    it("Dijkstra test - Horizontal close", async () => {
        startLoc = [5, 5];
        endLoc = [5, 6];

        let path = await runAlgorithm("dijkstra", startLoc, endLoc, grid, "8");
        expect(path.length).toBe(2);


    });
    it("Dijkstra test - Diagonal", async () => {
        startLoc = [0, 0]
        endLoc = [8, 8];

        let path = await runAlgorithm("dijkstra", startLoc, endLoc, grid, "8");
        expect(path.length).toBe(9);


    });

    it("Dijkstra test - No Path", async () => {
        const newGrid = makeMaze(startLoc, endLoc, grid, "small boxed");
        startLoc = [5, 5]
        endLoc = [5, 15];

        let path = await runAlgorithm("dijkstra", startLoc, endLoc, newGrid, "8");
        const length = path.length;
        const containsEnd = (path[length - 1][0] === endLoc[0]) && (path[length - 1][1] === endLoc[1])
        expect(containsEnd).toBe(false);


    });
})

describe("Breadth first search tests", () => {
    let grid = createGrid();
    it("Breadth first search test - Path around Wall", async () => {
        const newGrid = makeMaze(startLoc, endLoc, grid, "maze 1");
        startLoc = [5, 5]
        endLoc = [5, 15];

        let path = await runAlgorithm("breadth first", startLoc, endLoc, newGrid, "8");
        expect(path.length).toBe(19);


    });
    it("Breadth first search test - Horizontal", async () => {
        grid = createGrid();
        startLoc = [5, 5]
        endLoc = [5, 15];

        let path = await runAlgorithm("breadth first", startLoc, endLoc, grid, "8");
        expect(path.length).toBe(11);


    });

    it("Breadth first search test - Horizontal close", async () => {
        startLoc = [5, 5];
        endLoc = [5, 6];

        let path = await runAlgorithm("breadth first", startLoc, endLoc, grid, "4");
        expect(path.length).toBe(2);


    });
    it("Breadth first search test - Diagonal", async () => {
        startLoc = [0, 0]
        endLoc = [8, 8];

        let path = await runAlgorithm("breadth first", startLoc, endLoc, grid, "8");
        expect(path.length).toBe(9);


    });
    it("Breadth first search test - No Path", async () => {
        const newGrid = makeMaze(startLoc, endLoc, grid, "small boxed");
        startLoc = [5, 5]
        endLoc = [5, 15];

        let path = await runAlgorithm("breadth first", startLoc, endLoc, newGrid, "8");
        const length = path.length;
        const containsEnd = (path[length - 1][0] === endLoc[0]) && (path[length - 1][1] === endLoc[1])
        expect(containsEnd).toBe(false);


    });
})
describe("Depth first search tests", () => {
    let grid = createGrid();
    it("Depth first search test - Path around Wall", async () => {
        const newGrid = makeMaze(startLoc, endLoc, grid, "maze 1");
        startLoc = [5, 5]
        endLoc = [5, 15];

        let path = await runAlgorithm("depth first", startLoc, endLoc, newGrid, "8");
        expect(path.length).toBe(55);


    });
    it("Depth first search test - Horizontal", async () => {
        grid = createGrid();
        startLoc = [5, 5]
        endLoc = [5, 15];
        // 
        let path = await runAlgorithm("depth first", startLoc, endLoc, grid, "4");
        expect(path.length).toBe(11);

        // 
    });

    it("Depth first search test - Horizontal close", async () => {
        startLoc = [5, 5];
        endLoc = [5, 6];
        // 
        let path = await runAlgorithm("depth first", startLoc, endLoc, grid, "4");
        expect(path.length).toBe(2);

        // 
    });
    it("Depth first search test - Diagonal", async () => {
        startLoc = [5, 5]
        endLoc = [1, 52];
        // 
        let path = await runAlgorithm("depth first", startLoc, endLoc, grid, "8");
        expect(path.length).toBe(48);

        // 
    });
    it("depth first search test - No Path", async () => {
        const newGrid = makeMaze(startLoc, endLoc, grid, "small boxed");
        startLoc = [5, 5]
        endLoc = [5, 15];
        // 
        let path = await runAlgorithm("depth first", startLoc, endLoc, newGrid, "8");
        const length = path.length;
        const containsEnd = (path[length - 1][0] === endLoc[0]) && (path[length - 1][1] === endLoc[1])
        expect(containsEnd).toBe(false);

        // 
    });
})

describe("Bidirectional search tests", () => {
    let grid = createGrid();
    it("Bidirectional search test - Path around wall", async () => {
        const newGrid = makeMaze(startLoc, endLoc, grid, "maze 1");
        startLoc = [5, 5]
        endLoc = [5, 15];

        let path = await runAlgorithm("bidirectional", startLoc, endLoc, newGrid, "8");
        expect(path.length - 1).toBe(19);

        // 
    });
    it("Bidirectional search test - Horizontal", async () => {
        grid = createGrid();
        startLoc = [5, 5]
        endLoc = [5, 15];

        let path = await runAlgorithm("bidirectional", startLoc, endLoc, grid, "4");
        expect(path.length - 1).toBe(11);

        // 
    });

    it("Bidirectional search test - Horizontal close", async () => {
        startLoc = [5, 5];
        endLoc = [5, 6];

        let path = await runAlgorithm("bidirectional", startLoc, endLoc, grid, "4");
        expect(path.length).toBe(3);

        // 
    });
    it("Bidirectional search test - Diagonal", async () => {
        startLoc = [5, 5]
        endLoc = [1, 32];
        let path = await runAlgorithm("bidirectional", startLoc, endLoc, grid, "8");
        expect(path.length - 1).toBe(28);
        // 
    });
    it("Bidirectional search test - No Path", async () => {
        const newGrid = makeMaze(startLoc, endLoc, grid, "small boxed");
        startLoc = [5, 5]
        endLoc = [5, 15];
        let path = await runAlgorithm("bidirectional", startLoc, endLoc, newGrid, "8");
        const length = path.length;
        const containsEnd = (path[length - 1][0] === endLoc[0]) && (path[length - 1][1] === endLoc[1])
        expect(containsEnd).toBe(false);

    });
})



