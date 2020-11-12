import VueRouter from 'vue-router';

let routes = [
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
