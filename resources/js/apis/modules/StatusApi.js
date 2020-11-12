import api from '../client';

let baseUrl = '/api/status/';

export default {
    get() {
        return api().get(baseUrl);
    },
}
