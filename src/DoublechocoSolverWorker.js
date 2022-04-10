import Module from "./doublechoco_solver";

let Solver = null;

function solveProblem(url) {
    const resultStr = Solver.solve(url);
    const result = JSON.parse(resultStr.substring(0, resultStr.length));

    self.postMessage(result["description"]);
}

self.onmessage = function (e) {
    const data = e.data;
    if (Solver) {
        solveProblem(data);
    } else {
        Module().then(mod => {
            Solver = mod;
            solveProblem(data);
        });
    }
};

Module().then(mod => {
    Solver = mod;
});
