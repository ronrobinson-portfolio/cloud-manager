import VueRouter from 'vue-router';

let routes = [
    {
        path      : '/emulator',
        name      : 'emulator',
        component : require('../Emulator').default
    },
    {
          path      : '/',
          name      : 'home',
          component : require('../DeviceList').default
    },
    /* Default */
    {
        path     : '*',
        redirect : '/'
    }
];

export default new VueRouter({
    routes: routes
});
