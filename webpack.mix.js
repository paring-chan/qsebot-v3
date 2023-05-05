// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const mix = require('laravel-mix')

mix.ts('client/src/index.tsx', 'static/dist').preact()
