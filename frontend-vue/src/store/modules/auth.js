import firebase from "firebase/app"
import { onMobile } from '../../shared/utils'
import 'firebase/analytics'
import 'firebase/auth'
import '../../shared/firebaseConfig'

firebase.analytics();
let provider = new firebase.auth.GoogleAuthProvider();

const state = {
    user: null,
    signInStarted: false,
}

const getters = {
    getWords: (state) => state.words,
    getArchivedWords: (state) => state.archivedWords,
    getUser: (state) => state.user,
    getSignInStarted: (state) => state.signInStarted,
}

const actions = {
    signInStart({ commit }) {
        console.log('signinstarted');
        commit('setSignInStarted', true);
    },

    async SignInWithGoogle({ commit }) {
        if (onMobile) {
            await firebase.auth().signInWithRedirect(provider);
        } else {
            await firebase.auth().signInWithPopup(provider);

        }

        commit('setSignInStarted', true);

    },

    async BindSignIn({ commit }) {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                commit('setUser', user);
                console.log(state.words, state.archivedWords)
            } else {
                console.log(state.words, state.archivedWords)
                
                commit('setUser', null);
                commit('words/clearCollections', undefined, {root: true});
            }
        });
    },

    async SignOut({ commit }) {
        await firebase.auth().signOut();
        commit('setSignInStarted', false);
    }
}

const mutations = {
    setUser: (state, user) => state.user = user,
    setSignInStarted: (state, value) => state.signInStarted = value,
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}