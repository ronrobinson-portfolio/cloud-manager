import deviceApi from 'apis/modules/DeviceApi';

const state = {
    namespace: 'device',

    devices: [],
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
        const devicePromise = dispatch('getDevices');

        return Promise.all([devicePromise])
            .then(() => Promise.resolve())
            .catch(() => {});
    },

    getDevices: ({ state, commit }) =>
        deviceApi
            .get()
            .then((response) => {
                commit('dataUpdate', { devices: response.data.data });
                return Promise.resolve(state.devices);
            })
            .catch(() => {}),

    addDevice: ({ dispatch }, device) =>
        deviceApi
            .add(device)
            .then(() => dispatch('getDevices'))
            .catch((err) => Promise.reject(err)),

    updateDevice: ({ dispatch, commit }, device) =>
        deviceApi
            .update(device)
            .then(() => dispatch('getDevices'))
            .catch((err) => Promise.reject(err)),
};

export default { state, getters, mutations, actions };
