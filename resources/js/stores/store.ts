import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import appModule from './app/module';
import { RootState } from 'interfaces/app';
import deviceModule from './device/module';
import osModule from './os/module';
import serviceModule from './service/module';
import statusModule from './status/module';

Vue.use(Vuex);

const store = new Vuex.Store<RootState>({
    modules: {
        app: appModule,
        device: deviceModule,
        os: osModule,
        service: serviceModule,
        status: statusModule,
    },
});

export default store;
