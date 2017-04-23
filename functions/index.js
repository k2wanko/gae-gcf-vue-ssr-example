const fs = require('fs')
const functions = require('firebase-functions')
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase)

const htmlTemplate = fs.readFileSync('./dist/index.html', 'utf-8')

const createBundleRenderer = require('vue-server-renderer').createBundleRenderer
let bundleRenderer = createBundleRenderer(require('./dist/vue-ssr-bundle.json'), {
    template: htmlTemplate,
})

exports.render = functions.https.onRequest((req, res) => {
    bundleRenderer
        .renderToStream({ url: '/' })
        .pipe(res)
})
