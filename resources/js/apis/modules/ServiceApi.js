import api from '../client';

let baseUrl = '/api/service/';

export default {
    get() {
        return api().get(baseUrl);
    },
}
