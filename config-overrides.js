module.exports = function override(config, env) {
    config.module.rules.push({
        test: /\/SolverWorker\.js/,
        use: {
            loader: "worker-loader",
            options: {
                filename: "static/js/SolverWorker.worker.js"
            }
        }
    });
    config.module.rules.push({
        test: /DoublechocoSolverWorker\.js/,
        use: {
            loader: "worker-loader",
            options: {
                filename: "static/js/DoublechocoSolverWorker.worker.js"
            }
        }
    });
    config.output.filename = "static/js/main.js";
    config.output.chunkFilename = "static/js/main.js";

    return config;
}
