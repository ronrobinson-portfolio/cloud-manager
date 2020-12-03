import { ActionTree, GetterTree, MutationTree, StoreOptions } from 'vuex';
import { ApiResponse } from 'interfaces/apiResponse';
import { RootState } from '../../../interfaces/app';
import { DeviceState } from 'interfaces/device';
import deviceApi from 'apis/modules/DeviceApi';

const state: DeviceState = {
    namespace: 'device',
    devices: [],
};

const getters: GetterTree<DeviceState, RootState> = {
    getDevices: (state: DeviceState) => state.devices,
};

const mutations: MutationTree<DeviceState> = {
    dataUpdate: (state, payload: ApiResponse) => {
        Object.keys(state).forEach((key) => {
            if (payload.hasOwnProperty(key)) {
                state[key] = payload[key];
            }
        });
    },
};

const actions: ActionTree<DeviceState, RootState> = {
    init: ({ dispatch }) => {
        const devicePromise = dispatch('getDevices');

        return Promise.all([devicePromise])
            .then(() => Promise.resolve())
            .catch(() => {});
    },

    getDevices: ({ state, commit }) =>
        deviceApi
            .get()
            .then((response: any) => {
                commit('dataUpdate', { devices: response.data.data });
                return Promise.resolve(state.devices);
            })
            .catch(() => {}),

    addDevice: ({ dispatch }, device) =>
        deviceApi
            .add(device)
            .then(() => dispatch('getDevices'))
            .catch((err: Error) => Promise.reject(err)),

    updateDevice: ({ dispatch, commit }, device) =>
        deviceApi
            .update(device)
            .then(() => dispatch('getDevices'))
            .catch((err: Error) => Promise.reject(err)),

    deleteDevice: ({ dispatch, commit }, device) =>
        deviceApi
            .delete(device)
            .then(() => dispatch('getDevices'))
            .catch((err: Error) => Promise.reject(err)),
};

export default { state, getters, mutations, actions };
