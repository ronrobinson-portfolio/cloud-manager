<template>
    <v-card>
        <v-app-bar dark dense color="grey darken-3">
            <v-toolbar-title>Devices</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="openEditDeviceForm({})">
                <v-icon>mdi-plus-circle-outline</v-icon>
            </v-btn>
        </v-app-bar>

        <v-data-table
            :headers="headers"
            :items="devices"
            item-key="id"
            dense
            must-sort
            @click:row="openEditDeviceForm"
        >
            <template v-slot:item.status_id="{ item }">
                {{ getDeviceStatus(item) }}
            </template>
        </v-data-table>
        <DeviceForm v-bind:device.sync="selectedDevice" />
    </v-card>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';
    import DeviceForm from 'components/device/DeviceForm';

    const deviceStore = createNamespacedHelpers('device');
    const statusStore = createNamespacedHelpers('status');

    export default {
        components: {
            DeviceForm,
        },

        data: () => ({
            selectedDevice: null,
        }),

        computed: {
            ...deviceStore.mapState(['devices']),
            ...statusStore.mapState(['statuses']),

            headers() {
                return [
                    {
                        text: 'Name',
                        align: 'start',
                        sortable: true,
                        value: 'name',
                    },
                    {
                        text: 'Device',
                        align: 'start',
                        sortable: true,
                        value: 'deviceable_value',
                    },
                    {
                        text: 'IP',
                        align: 'start',
                        sortable: true,
                        value: 'ip',
                    },
                    {
                        text: 'Status',
                        align: 'start',
                        sortable: true,
                        value: 'status_id',
                    },
                ];
            },
        },

        methods: {
            getDeviceStatus(device) {
                return this.statuses.find(
                    (status) => status.id === device.status_id
                ).status;
            },

            openEditDeviceForm(device) {
                this.selectedDevice = device;
            },
        },
    };
</script>

<style></style>
