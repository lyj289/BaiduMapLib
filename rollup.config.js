import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
	input: 'index.js',
    output: {
        name: 'MapGeo',
        file: 'build/MapGeo.js',
        format: 'umd'
    },
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**'
        })
    ],
}