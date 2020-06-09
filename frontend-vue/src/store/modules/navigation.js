const state = {
    drawerOpen: false,
}
const getters = {
    getDrawerOpen: (state) => state.drawerOpen,
}
const actions = {
    toggleDrawer({ state, commit }) {
        commit('setDrawerOpen', !state.drawerOpen);
    }
}

const mutations = {
    setDrawerOpen: (state, value) => {
        state.drawerOpen = value;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}