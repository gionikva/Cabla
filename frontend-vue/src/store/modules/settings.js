const state = {
    local: {
        dark: false,
        searchBy: {
            title: true,
            content: true
        }
    },
    synced: {

    }
}

const getters = {
    getDark: (state) => state.local.dark,
    getSearchOptions: (state) => state.local.searchBy,
    getEnabledSearchOptions: (state) => Object.entries(state.local.searchBy).filter((entry) => entry[1]).map((entry) => entry[0])
    
}
const actions = {

}

const mutations = {
    setDark: (state, value) => state.local.dark = value,
    setEnabledSearchOptions: (state, enabledOptions) => {
        Object.entries(state.local.searchBy).forEach((entry) => {
            if (enabledOptions.indexOf(entry[0]) != -1) {
                state.local.searchBy[entry[0]] = true;
            } else {
                state.local.searchBy[entry[0]] = false;
            }
        })
        console.log(getters.getEnabledSearchOptions(state));
    },
    setSearchOptions: (state, options) => {
        Object.entries(options).forEach((entry) => {
            state.local.searchBy[entry[0]] = entry[1]
        })
    }
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}