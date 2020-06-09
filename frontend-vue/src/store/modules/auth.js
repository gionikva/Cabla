import { onMobile } from "../../shared/utils";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import { firebase } from "../../shared/firebaseConfig";

firebase.analytics();
let provider = new firebase.auth.GoogleAuthProvider();
const state = {
  user: null,
  signInStarted: false,
};

const getters = {
  getWords: (state) => state.words,
  getArchivedWords: (state) => state.archivedWords,
  getUser: (state) => state.user,
  getSignInStarted: (state) => state.signInStarted,
};

const actions = {
  signInStart({ commit }) {
    commit("setSignInStarted", true);
  },

  async SignInWithGoogle({ commit }) {
    if (onMobile) {
      await firebase.auth().signInWithRedirect(provider);
    } else {
      await firebase.auth().signInWithPopup(provider);
    }

    commit("setSignInStarted", true);
  },

  async BindSignIn({ commit }) {
    firebase.auth().onAuthStateChanged( (user) => {
      if (user) {
        commit("setUser", user);
      } else {

        commit("setUser", null);
        commit("words/clearCollections", undefined, { root: true });
      }
    });
  },

  async SignOut({ commit }) {
    await firebase.auth().signOut();
    commit("setSignInStarted", false);
  },
};

const mutations = {
  setUser: (state, user) => (state.user = user),
  setSignInStarted: (state, value) => (state.signInStarted = value),
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
