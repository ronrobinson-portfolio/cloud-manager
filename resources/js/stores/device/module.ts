import { Module } from 'vuex';
import DeviceStore from './store/DeviceStore';
import { RootState } from 'interfaces/app';
import { DeviceState } from 'interfaces/device';

const device: Module<DeviceState, RootState> = {
    ...DeviceStore,
    namespaced: true,
};
export default device;
