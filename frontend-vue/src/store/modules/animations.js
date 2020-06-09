const state = {
  wordAddition: {
    queued: false,
    wordTitle: null,
    collection: null,
  },
  navBarHidden: false,
};

const getters = {
  getNavBarHidden: (state) => state.navBarHidden,
  getWordAdditionQueued: (state) => state.wordAddition.queued,
  getWordAdditionData: (state) => state.wordAddition,
};

const actions = {};

const mutations = {
  setNavBarHidden: (state, value) => {
    state.navBarHidden = value;
  },
  setWordAdditionQueued: (state, value) => {
    state.wordAddition.queued = value;
  },
  toggleWordAdditionQueued: (state) =>
    (state.wordAddition.queued = !state.wordAddition.queued),
  setWordAdditionData: (state, object) => {
    for (let entry of Object.entries(object)) {
      state.wordAddition[entry[0]] = entry[1];
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
