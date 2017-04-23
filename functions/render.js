const fs = require('fs')
const path = require('path')
const express = require('express')
const cors = require('cors')({ origin: true })
const app = express()

const htmlTemplate = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8')

const createBundleRenderer = require('vue-server-renderer').createBundleRenderer
let bundleRenderer = createBundleRenderer(require('./dist/vue-ssr-bundle.json'), {
    template: htmlTemplate,
})


app.use(cors)
app.get('*', (req, res) => {
    bundleRenderer
        .renderToStream({ url: '/' })
        .pipe(res)
})

module.exports = app