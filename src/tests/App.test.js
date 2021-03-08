import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import { isTSAnyKeyword } from '@babel/types';
// import {getQueriesForElement} from '@testing-library/dom';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import Node from '../Components/Node';
import { timeout, findPathFromClosed, drawPath } from '../Helpers/path_finder';



const a_star = require("../algorithms/a_star_search");
const dijkstra = require("../algorithms/dijkstra");
const app = require("../App");
const pathfinder = require("../Helpers/path_finder");


it("renders everything without crashing", () => {
    const root = document.createElement("div");
    ReactDOM.render(<App />, root)
});

it("renders buttons properly", () => {
    const root = document.createElement("div");
    ReactDOM.render(<App />, root)

    //use DOM APIs to make assertions
    // const {getByText,getByLabelText} =getQueriesForElement(root);
    // getByText("A* search");
    // getByText("Clear Walls");
    // getByText("Dijkstra");
    // getByText("BFS");
    // getByText("DFS");
    // getByText("Best First Search");

});
// it("grid is created with no problems",()=>{
//     const grid_mock=jest.spyOn(app,"createGrid");
//     const result=grid_mock();
//     expect(result.length).toBe(15);
// });



let startLoc = [5, 5];
let endLoc = [5, 15];
const ROWS = 15;
const COLS = 30;
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
describe("A* tests",()=>{
    let grid=createGrid();

    it("A* test - Horizontal", async () => {
        startLoc=[5,5];
        endLoc=[5,15];
        const findPath_mock = jest.spyOn(a_star, "findPath");
        const result = a_star.findPath(ROWS, COLS, startLoc, endLoc, grid);
        const path = await findPathFromClosed(result, startLoc);
        expect(path.length).toBe(11);

        findPath_mock.mockRestore();
    });
    
    it("A* test - Horizontal close", async () => {
        startLoc=[5,5];
        endLoc=[5,6];
        const findPath_mock = jest.spyOn(a_star, "findPath");
        const result = a_star.findPath(ROWS, COLS, startLoc, endLoc, grid);
        const path = await findPathFromClosed(result, startLoc);
        expect(path.length).toBe(2);

        findPath_mock.mockRestore();
    });
    it("A* test - Diagonal", async () => {
        startLoc=[0,0]
        endLoc=[8,8];
        const findPath_mock = jest.spyOn(a_star, "findPath");
        const result = a_star.findPath(ROWS, COLS, startLoc, endLoc, grid);
        const path = await findPathFromClosed(result, startLoc);
        expect(path.length).toBe(9);

        findPath_mock.mockRestore();
    });
})

describe("Dijkstra tests",()=>{
    let grid=createGrid();

    it("Dijkstra test - Horizontal", async () => {
        startLoc=[5,5]
        endLoc=[5,15];
        const findPath_mock = jest.spyOn(dijkstra, "dijkstra_algorithm");
        const result = dijkstra.dijkstra_algorithm(ROWS, COLS, startLoc, endLoc, grid);
        const path = await findPathFromClosed(result, startLoc);
        expect(path.length).toBe(11);

        findPath_mock.mockRestore();
    });
    
    it("Dijkstra test - Horizontal close", async () => {
        startLoc=[5,5];
        endLoc=[5,6];
        const findPath_mock = jest.spyOn(dijkstra, "dijkstra_algorithm");
        const result = dijkstra.dijkstra_algorithm(ROWS, COLS, startLoc, endLoc, grid);
        const path = await findPathFromClosed(result, startLoc);
        expect(path.length).toBe(2);

        findPath_mock.mockRestore();
    });
    it("Dijkstra test - Diagonal", async () => {
        startLoc=[0,0]
        endLoc=[8,8];
        const findPath_mock = jest.spyOn(dijkstra, "dijkstra_algorithm");
        const result = dijkstra.dijkstra_algorithm(ROWS, COLS, startLoc, endLoc, grid);
        const path = await findPathFromClosed(result, startLoc);
        expect(path.length).toBe(9);

        findPath_mock.mockRestore();
    });
})



