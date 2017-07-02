import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Domaincheck from '@/components/Domaincheck'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/domaincheck',
      // name: 'Domaincheck',
      component: Domaincheck
    }
  ]
})
