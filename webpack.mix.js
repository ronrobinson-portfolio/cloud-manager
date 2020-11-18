const mix = require('laravel-mix');

const resolve = {
    modules: [
        path.resolve(__dirname, 'resources/js'),
        path.resolve(__dirname, 'resources/sass'),
        path.resolve(__dirname, 'node_modules')
    ]
};

mix.webpackConfig({resolve})
    .ts('resources/js/app.ts', 'public/js')
    .sass('resources/sass/app.scss', 'public/css');
