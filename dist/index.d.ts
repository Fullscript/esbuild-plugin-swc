import { Options as SWCOptions } from '@swc/core';
import { Plugin } from 'esbuild';
export declare const swcPlugin: (options?: SWCOptions, isAsync?: boolean) => Plugin;
