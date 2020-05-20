import Vue from 'vue'
import Vuex from 'vuex'
import navigation from './modules/navigation'
import auth from './modules/auth'
import animations from './modules/animations'
import settings from './modules/settings'
import words from './modules/words.js'
import createPersistedState from "vuex-persistedstate";

import {vuexfireMutations} from 'vuexfire'
Vue.use(Vuex)

export default new Vuex.Store({
  plugins:[createPersistedState({
    paths: [
      'settings.local'
    ]
  })],

  modules: {
    navigation,
    animations,
    settings,
    auth,
    words,
  },
  mutations: vuexfireMutations

})
