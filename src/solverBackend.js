import Worker from "./solverWorker?worker";

let worker = null;
let currentReject = null;

export function solveProblem(url, numAnswers) {
  if (worker === null) {
    worker = new Worker();
  }
  if (currentReject !== null) {
    return new Promise((resolve, reject) => {
      reject("solver already running");
    });
  }
  return new Promise((resolve, reject) => {
    worker.onmessage = (e) => {
      currentReject = null;
      resolve(e.data);
    };
    worker.postMessage({url, numAnswers});
    currentReject = reject;
  });
}

export function terminateWorker() {
  if (worker === null) return;
  worker.terminate();
  worker = null;

  if (currentReject !== null) {
    const reject = currentReject;
    currentReject = null;
    reject("terminated");
  }
}
