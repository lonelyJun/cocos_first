import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import GetGift from '../views/GetGift.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/getGift',
    name: 'GetGift',
    component: GetGift
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router