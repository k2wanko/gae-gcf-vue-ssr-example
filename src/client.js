import { app, store} from './app'
import Firebase from 'firebase'

Firebase.initializeApp({
  apiKey: "AIzaSyBgDiWqxHuD9ixMLAqjT4Rp0_TVhtZBnfE",
  authDomain: "gae-go-functions-ssr-example.firebaseapp.com",
  databaseURL: "https://gae-go-functions-ssr-example.firebaseio.com",
  projectId: "gae-go-functions-ssr-example",
  storageBucket: "gae-go-functions-ssr-example.appspot.com",
  messagingSenderId: "103140705885"
})

if (window.__INITIAL_STATE__) {
  store.state = window.__INITIAL_STATE__
  app.greetings = store.state.greetings
}

document.addEventListener('DOMContentLoaded', ()=> app.$mount('#app'))