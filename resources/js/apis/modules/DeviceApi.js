import api from '../client';

let baseUrl = '/api/device/';

export default {
    add(device) {
        return api().post(baseUrl, device);
    },

    update(device) {
        return api().put(baseUrl + device.id, device);
    },

    get() {
        return api().get(baseUrl);
    },
}
