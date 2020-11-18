require('./bootstrap');
import Vue from 'vue';
import store from './stores/store';
import router from './components/routes/routes';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import App from './components/App.vue';
import VueRouter from 'vue-router';

//window.Vue = Vue;
Vue.config.productionTip = false;
Vue.use(Vuetify);
Vue.use(VueRouter);

const app = new Vue({
    vuetify: new Vuetify(),
    store,
    router,
    el: '#app',
    render: (h) => h(App),
});
