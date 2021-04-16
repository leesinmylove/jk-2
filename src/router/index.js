import Vue from 'vue'
import Router from 'vue-router'
import cockpit from '../components/cockpit.vue'
import list from '../components/list.vue'
import iframe from '../components/iframe.vue'
import gis from "../components/gis.vue";
import search from "../components/search.vue"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'cockpit',
      component: cockpit
    },
    {
      path: '/list',
      name: 'list',
      component: list
    },{
      path: '/iframe',
      name: 'iframe',
      component: iframe
    },{
      path: '/gis',
      name: 'gis',
      component: gis
    },{
      path: '/search',
      name: 'search',
      component: search
    }
  ]
})
