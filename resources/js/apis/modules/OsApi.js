import api from '../client';

let baseUrl = '/api/os/';

export default {
    get() {
        return api().get(baseUrl);
    },
}
