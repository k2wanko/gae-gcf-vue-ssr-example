import Vue from 'vue'
import App from './App.vue'
import store from './store'

// const app = new Vue({
//   render: h => h(App)
// })

const app = new Vue(App)

export { app, store }