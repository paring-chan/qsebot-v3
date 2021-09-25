const mix = require('laravel-mix')

mix.ts('client/src/index.tsx', 'static/dist').preact()
