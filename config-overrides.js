const CopyPlugin = require("copy-webpack-plugin");

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
    config.plugins.push(new CopyPlugin({
        patterns: [
            { from: "src/cspuz_solver_backend.wasm", to: "static/js/cspuz_solver_backend.wasm" },
        ],
    }));
    config.output.filename = "static/js/main.js";
    config.output.chunkFilename = "static/js/main.js";

    return config;
}
