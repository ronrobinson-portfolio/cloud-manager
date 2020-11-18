import serviceApi from 'apis/modules/ServiceApi';

const state = {
    namespace: 'status',

    services: [],
};

const getters = {
    getServices: (state) => state.services
};

const mutations = {
    dataUpdate: (state, payload) => {
        Object.keys(state).forEach((key) => {
            if (payload.hasOwnProperty(key)) {
                state[key] = payload[key];
            }
        });
    },
};

const actions = {
    init: ({ dispatch }) => {
        const servicesPromise = dispatch('getServices');

        return Promise.all([servicesPromise])
            .then(() => Promise.resolve())
            .catch(() => {});
    },

    getServices: ({ commit }) =>
        serviceApi
            .get()
            .then((response) => {
                commit('dataUpdate', { services: response.data.data });
                return Promise.resolve();
            })
            .catch(() => {}),
};

export default { state, getters, mutations, actions };
