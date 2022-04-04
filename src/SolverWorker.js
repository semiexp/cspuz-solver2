import Module from "./cspuz_solver_backend";

let Solver = null;

function solveProblem(url) {
    const urlEncoded = new TextEncoder().encode(url);
    const buf = Solver._malloc(urlEncoded.length);
    Solver.HEAPU8.set(urlEncoded, buf);

    const ans = Solver._solve_problem(buf, urlEncoded.length);
    Solver._free(buf);

    const length = Solver.HEAPU8[ans] | (Solver.HEAPU8[ans + 1] << 8) | (Solver.HEAPU8[ans + 2] << 16) | (Solver.HEAPU8[ans + 3] << 24);
    const resultStr = new TextDecoder().decode(Solver.HEAPU8.slice(ans + 4, ans + 4 + length));
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

