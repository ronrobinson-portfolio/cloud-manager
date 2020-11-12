import statusApi from 'apis/modules/StatusApi';

const state = {
    namespace: 'status',

    statuses: [],
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
        const statusPromise = dispatch('getStatuses');

        return Promise.all([statusPromise])
            .then(() => Promise.resolve())
            .catch(() => {});
    },

    getStatuses: ({ commit }) =>
        statusApi
            .get()
            .then((response) => {
                commit('dataUpdate', { statuses: response.data.data });
                return Promise.resolve();
            })
            .catch(() => {}),
};

export default { state, getters, mutations, actions };
