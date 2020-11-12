import Vue from 'vue';
import Vuex from 'vuex';
import appModule from './app/module';
import deviceModule from './device/module';
import osModule from './os/module';
import serviceModule from './service/module';
import statusModule from './status/module';

Vue.use(Vuex);
const store = new Vuex.Store({
    modules: {
        app      : appModule,
        device   : deviceModule,
        os       : osModule,
        service  : serviceModule,
        status   : statusModule,
    },
});

export default store;
