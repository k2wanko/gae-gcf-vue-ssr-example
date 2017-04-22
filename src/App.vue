<template>
  <div id="app">
    <h1>Guestbook</h1>
    <div class="input-box">
      <form id="form" v-on:submit.prevent="postGreet">
        <input type="text" placeholder="Name" v-model="name">
        <input type="text" placeholder="Message" v-model="newContent">
        <input type="submit" value="Submit">
      </form>
    </div>
    <div class="list-box">
      <dl>
        <div v-for="{name, content} in greetingsSorted">
          <dt>{{name}}</dt>
          <dd>{{content}}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import firebase from 'firebase'


firebase.initializeApp({
  apiKey: "AIzaSyBgDiWqxHuD9ixMLAqjT4Rp0_TVhtZBnfE",
  authDomain: "gae-go-functions-ssr-example.firebaseapp.com",
  databaseURL: "https://gae-go-functions-ssr-example.firebaseio.com",
  projectId: "gae-go-functions-ssr-example",
  storageBucket: "gae-go-functions-ssr-example.appspot.com",
  messagingSenderId: "103140705885"
})

const auth = firebase.auth()
const database = firebase.database()

function fetchGreetings() {
  return database.ref('greetings').once('value').then(data => data.val())
}

export default {
  name: 'app',
  data () {
    return {
      user: null,
      name: '',
      newContent: '',
      greetings: {},
    }
  },
  computed: {
    greetingsSorted () {
      return Object.keys(this.greetings).map(key => this.greetings[key]).sort((a, b) => b.created - a.created)
    }
  },
  mounted() {
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged(user => {
        if (user) {
          return resolve(user)
        } else {
          auth.signInAnonymously().then(resolve).catch(reject)
        }
      })
    }).then(user => this.user = user).then(() => {
      const ref = database.ref('greetings')
      ref.on('child_added', data => {
        Vue.set(this.greetings, data.key, data.val())
      })
      ref.on('child_changed', data => {
        Vue.set(this.greetings, data.key, data.val())
      })
      ref.on('child_removed', data => {
        Vue.delete(greetings, data.key)
      })
    })
  },
  methods: {
    postGreet() {
      if (!this.newContent) {
        return
      }

      if (!this.user) {
        return
      }

      const newPostKey = database.ref().child('greetings').push().key
      const updates = {}
      updates['/greetings/' + newPostKey] = {
        uid: this.user.uid,
        name: this.name || '???',
        content: this.newContent,
        created: firebase.database.ServerValue.TIMESTAMP,
      }

      return database.ref().update(updates).then(()=> {
        this.newContent = ''
      })
    },
    preFetch() {
      return fetchGreetings().then(data => {
        Object.keys(data).forEach(key => Vue.set(this.greetings, key, data[key]))
      })
    }
  }
}
</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

.list-box {
  text-align: left;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
