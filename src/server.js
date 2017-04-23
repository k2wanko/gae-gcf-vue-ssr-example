import fetch from 'node-fetch'
global.fetch = fetch

import { app, store } from './app'

export default context => {
    return new Promise((resolve, reject) => {
        app.preFetch().then(() => {
            context.state = store.state
            resolve(app)
        }).catch(reject)
    })
}