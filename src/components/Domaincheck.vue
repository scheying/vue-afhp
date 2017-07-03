<template>
  <div class="domaincheck">

    <button class="domainlist-button" @click="showDomainList = !showDomainList">
        {{ domainlist.length + (domainlist.length > 1 || domainlist.length === 0 ? " domains" : " domain") }}
    </button>

    <div class="domainlist-container" v-show="showDomainList">
      <div v-for="domain in domainlist">
        {{ domain }}&nbsp;
        <span  @click="removeFromDomainList(domain)"><icon name="trash"></icon></span>
      </div>
    </div>

    <input v-model="domainname" placeholder="domainname">

    <button class="start-domaincheck" @click="startDomaincheck">
      Start Domaincheck
    </button>

    <icon name="refresh" v-show="showSpinner" spin></icon>

    <v-progress-linear v-bind:indeterminate="true"></v-progress-linear>

    <!--
    <input type="checkbox" id="show-only-frees" v-model="checkedNames" v-show="domains.length > 0">
    <label for="jack" v-show="domains.length > 0">Nur freie Domains anzeigen</label>
    -->

    <ul id="domaincheck-result">
      <div class="view" v-for="domain in domains">
        <span class="domainname">{{ domain.name }}</span>
        <span :class="domain.availability">{{ domain.availability }}</span>
        <span v-show="domain.availability == 'frei' && !contains(domainlist, domain.name)"
              @click="addToDomainlist(domain.name)"
        >
          auf Merkliste
        </span>
        <span v-show="contains(domainlist, domain.name)">
          vorgemerkt
        </span>
      </div>
    </ul>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'domaincheck',
  data () {
    return {
      domains: [],
      domainlist: [],
      domainname: '',
      showDomainList: false,
      showSpinner: false
    }
  },
  methods: {
    startDomaincheck: function () {
      this.refresh
      this.msg = 'Domaincheck starting...'
      this.showSpinner = true
      getDomainStatus(this.domainname, (err, res) => {
        if (err) console.error('HTTP ' + err)
        this.showSpinner = false
        this.domains = res
      })
    },
    addToDomainlist: function (domain) {
      this.domainlist.push(domain)
    },
    removeFromDomainList: function (domain) {
      this.domainlist.splice(this.domainlist.indexOf(domain), 1)
    },
    contains: function (a, obj) {
      var i = a.length
      while (i--) {
        if (a[i] === obj) {
          return true
        }
      }
      return false
    }
  }
}

function getDomainStatus (domainname, cb) {
  axios.get('http://www.artfiles.de/ajax/domainabfrage/ajax_whois.html', {
    params: {
      domainname: domainname,
      group: 'main'
    }
  })
  .then(function (response) {
    cb(null, parseRes(response.data))
  })
  .catch(function (error) {
    cb(error)
  })
}

function parseRes (s) {
  const res = []
  for (let e of s.split(',')) {
    const f = e.split('|')
    const name = f[0]
    const availability = f[1]
    res.push({ name, availability })
  }
  return res
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
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

div .frei {
  color: green;
}

div .vergeben {
  color: red;
}

.domainname {
  width: 100px;
  display: block;
  float: left;
}

.domainlist-button {
  border: 0;
  background: #dddddd;
  transition: all .1s ease-out;
  position: absolute;
  top: 10px;
  left: 10px;
}

.domainlist-container {
  border: 0;
  background: #dddddd;
  transition: all .1s ease-out;
  position: absolute;
  padding: 10px;
  top: 10px;
  left: 85px;
  width: 200px;
}
</style>
