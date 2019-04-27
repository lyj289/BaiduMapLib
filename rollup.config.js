import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

let {
    name, 
    version, 
    description, 
    homepage, 
    author,
} = require('./package.json');

const banner = `/* @preserve
 * ${name} ${version}, ${description}. ${homepage}
 * @author ${author} 
 */
`;

export default {
	input: 'index.js',
    output: {
        name: 'MapGeo',
        file: 'dist/MapGeo.js',
        format: 'umd',
        banner: banner
    },
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**'
        })
    ],
}