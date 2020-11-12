import osApi from 'apis/modules/OsApi';

const state = {
    namespace: 'os',

    operatingSystems: [],
};

const getters = {};

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
        const osPromise = dispatch('getOses');

        return Promise.all([osPromise])
            .then(() => Promise.resolve())
            .catch(() => {});
    },

    getOses: ({ commit }) =>
        osApi
            .get()
            .then((response) => {
                commit('dataUpdate', { operatingSystems: response.data.data });
                return Promise.resolve();
            })
            .catch(() => {}),
};

export default { state, getters, mutations, actions };
