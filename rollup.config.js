import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { readFile } from 'node:fs/promises';
import { defineConfig } from 'rollup';

const production = !process.env.ROLLUP_WATCH;

const pkg = JSON.parse(await readFile('./package.json', 'utf8'));

const banner = `/**!
 * ⚡ Random Play ⚡
 * ${pkg.description}
 *
 * Version: ${pkg.version}
 * Author: ${pkg.author ? (typeof pkg.author === 'string' ? pkg.author : pkg.author.name) : ''}
 * License: ${pkg.license || 'MIT'}
 * Repository: ${pkg.repository ? (typeof pkg.repository === 'string' ? pkg.repository : pkg.repository.url) : ''}
 *
 * (c) 2025 All rights reserved.
 */`;

function onwarn(warning, warn) {
    if (warning.code === 'CIRCULAR_DEPENDENCY') return;
    warn(warning);
}

export default defineConfig({
    input: './src/main.ts',
    output: { format: 'module', file: './build/main.js', banner },
    context: 'this',
    external: ['process'],
    plugins: [
        typescript(),
        commonjs(),
        nodeResolve({ preferBuiltins: true }),
        production && terser({ format: { comments: /^\**!/i } }),
    ],
    onwarn,
});
