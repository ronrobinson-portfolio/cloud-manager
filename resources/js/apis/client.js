import axios from 'axios';
import store from '../stores/store';

let client = null;

if (client == null) {
    client = axios.create({
        headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/json',
        },
    });

    // Request interceptors
    client.interceptors.request.use(
        (config) => {
            config.requestType = 'general';

            if (config && config.data && config.data.requestType) {
                config.requestType = config.data.requestType;
                delete config.data.requestType;
            }

            store.commit('app/startedAjax', config.requestType, { root: true });

            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptors
    client.interceptors.response.use(
        (response) => {
            let data = response.data;

            if (data && data.type == 'notification') {
                store.commit('app/updateNotification', data, { root: true });
            }

            if (response.config.requestType) {
                store.commit('app/finishedAjax', response.config.requestType, {
                    root: true,
                });
            }

            return response;
        },
        (error) => {
            let data =
                error.response && error.response.data
                    ? error.response.data
                    : {};

            // Form error messages
            if (error.response.status == 422) {
                store.commit('app/updateErrors', error, { root: true });
            } else {
                const response = error.response;
                const config = error.config;
                const data = error.response.data;
                let message = '';

                if (response.data && response.data.message) {
                    message = `${data.message} (${data.file} line ${data.line})`;
                } else {
                    message = `${response.status}: ${response.statusText} (${config.url})`;
                }

                store.commit('app/updateErrors', message, { root: true });
            }

            // All error messages
            if (
                error.response &&
                error.response.config &&
                error.response.config.requestType
            ) {
                store.commit(
                    'app/finishedAjax',
                    error.response.config.requestType,
                    { root: true }
                );
            } else {
                store.commit('app/fatalError', null, { root: true });
            }

            return Promise.reject(error);
        }
    );
}

export default () => client;
