import { Options as SWCOptions, Output, transform, transformSync } from '@swc/core';
import { Plugin, OnLoadArgs, OnLoadResult } from 'esbuild';
import path from 'path';
import fs from 'fs/promises';
import deepmerge from 'deepmerge';

export const swcPlugin = (options: SWCOptions = {}, isAsync = true): Plugin => {
  return {
    name: 'esbuild:swc',
    setup: (builder) => {
      builder.onResolve({ filter: /\.(tsx?)$/ }, (args) => {
        const fullPath = path.resolve(args.resolveDir, args.path);
        return {
          path: fullPath
        }
      });

      builder.onLoad({ filter: /\.(tsx?)$/ }, async (args: OnLoadArgs): Promise<OnLoadResult> => {
        const code = await fs.readFile(args.path, 'utf-8');
        const isTSX = args.path.endsWith('x');

        const initialOptions: SWCOptions = {
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
        
        let result: Output;
        if (isAsync) {
          result = await transform(code, deepmerge(initialOptions, options));
        } else {
          result = transformSync(code, deepmerge(initialOptions, options));
        }

        return {
          contents: result.code,
          loader: 'js'
        }
      })
    }
  }
}