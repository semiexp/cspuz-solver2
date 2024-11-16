import Worker from "./solverWorker?worker";

let worker = null;
let currentResolve = null;
let currentUrl = null;

export function solveProblem(url, numAnswers) {
  if (worker === null) {
    worker = new Worker();
  }
  if (currentResolve !== null) {
    return new Promise((resolve) => {
      resolve({
        status: "error",
        url,
        error: "solver already running",
      })
    });
  }
  currentUrl = url;
  return new Promise((resolve) => {
    const start = Date.now();
    worker.onmessage = (e) => {
      currentResolve = null;

      if (e.data === "no answer") {
        resolve({
          status: "noAnswer",
          url,
        });
      } else if (typeof e.data === "string") {
        resolve({
          status: "error",
          url,
          error: e.data,
        });
      } else {
        resolve({
          status: "success",
          url,
          result: e.data,
          elapsed: Date.now() - start,
        });
      }
    };
    worker.postMessage({url, numAnswers});
    currentResolve = resolve;
  });
}

export function terminateWorker() {
  if (worker === null) return;
  worker.terminate();
  worker = null;

  if (currentResolve !== null) {
    const resolve = currentResolve;
    currentResolve = null;
    resolve({
      status: "terminated",
      url: currentUrl,
    });
  }
}
