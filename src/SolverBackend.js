import Worker from "worker-loader!./SolverWorker.js";

let worker = null;
let currentReject = null;

export function solveProblem(url) {
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
        worker.postMessage(url);
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
