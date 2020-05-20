import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
//import FullscreenWord from '../views/FullscreenWord.vue'
import NotFound from '../views/NotFound.vue'
import Settings from '../views/Settings.vue'
//import WordRender from '../views/WordRender.vue'

Vue.use(VueRouter)

const routes = [
/*   {
    path: '/words/:word',
    name: 'word',
    component: FullscreenWord
  }, */

  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/Words/*',
    component: () => import(/* webpackChunkName: "about" */ '../views/CollectionView.vue')
  }
  ,
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    // will match everything
    path: '*',
    name: '404',
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})


export default router
