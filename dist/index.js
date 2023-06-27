"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swcPlugin = void 0;
const core_1 = require("@swc/core");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const deepmerge_1 = __importDefault(require("deepmerge"));
const swcPlugin = (options = {}, isAsync = true) => {
    return {
        name: 'esbuild:swc',
        setup: (builder) => {
            builder.onResolve({ filter: /\.(tsx?)$/ }, (args) => {
                const fullPath = path_1.default.resolve(args.resolveDir, args.path);
                return {
                    path: fullPath
                };
            });
            builder.onLoad({ filter: /\.(tsx?)$/ }, async (args) => {
                const code = await promises_1.default.readFile(args.path, 'utf-8');
                const isTSX = args.path.endsWith('x');
                const initialOptions = {
                    jsc: {
                        parser: {
                            syntax: 'typescript',
                            tsx: isTSX,
                        }
                    },
                    filename: args.path,
                    sourceMaps: true,
                    sourceFileName: args.path
                };
                let result;
                if (isAsync) {
                    result = await (0, core_1.transform)(code, (0, deepmerge_1.default)(initialOptions, options));
                }
                else {
                    result = (0, core_1.transformSync)(code, (0, deepmerge_1.default)(initialOptions, options));
                }
                return {
                    contents: result.code,
                    loader: 'js'
                };
            });
        }
    };
};
exports.swcPlugin = swcPlugin;
//# sourceMappingURL=index.js.map