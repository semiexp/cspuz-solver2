module.exports = function override(config, env) {
    config.module.rules.push({
        test: /\/SolverWorker\.js/,
        use: {
            loader: "worker-loader",
            options: {
                filename: "SolverWorker.worker.js"
            }
        }
    });
    config.module.rules.push({
        test: /DoublechocoSolverWorker\.js/,
        use: {
            loader: "worker-loader",
            options: {
                filename: "DoublechocoSolverWorker.worker.js"
            }
        }
    });
    return config;
}
