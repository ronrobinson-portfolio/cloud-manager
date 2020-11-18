// Used to configure phpstorm to resolve paths. File > Settings > Languages & Frameworks > Javascript > Webpack
// https://gist.github.com/nachodd/4e120492a5ddd56360e8cff9595753ae
const path = require('path')

module.exports = {
    entry: './resources/js/app.ts',
    resolve : {
        modules: [
            path.resolve(__dirname, 'resources/js'),
            path.resolve(__dirname, 'resources/sass'),
            path.resolve(__dirname, 'node_modules')
        ]
    }
}
