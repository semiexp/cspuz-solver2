import Module from "./solver/cspuz_solver_backend.js";

let Solver = null;

function solveProblem(data) {
  const url = data.url;
  const numAnswers = data.numAnswers || 0;
  const urlEncoded = new TextEncoder().encode(url);
  const buf = Solver._malloc(urlEncoded.length);
  Solver.HEAPU8.set(urlEncoded, buf);

  let ans;
  if (numAnswers <= 0) {
    ans = Solver._solve_problem(buf, urlEncoded.length);
  } else {
    ans = Solver._enumerate_answers_problem(buf, urlEncoded.length, numAnswers);
  }
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
