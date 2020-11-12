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
        </v-data-table>
        <DeviceForm v-bind:device.sync="selectedDevice" />
    </v-card>
</template>

<script>

    import { createNamespacedHelpers } from 'vuex';
    import DeviceForm from 'components/device/DeviceForm';

    const deviceStore = createNamespacedHelpers('device');

    export default {
        components: {
            DeviceForm,
        },

        data: () => ({
            selectedDevice: null,
            dialogs: {
                addDevice: false,
            },
        }),

        computed: {
            ...deviceStore.mapState(['devices']),

            headers() {
                return [
                    {
                        text: 'Name',
                        align: 'start',
                        sortable: true,
                        value: 'name',
                    },
                    {
                        text: 'IP',
                        align: 'start',
                        sortable: true,
                        value: 'ip',
                    },
                ];
            },
        },

        methods: {
            openEditDeviceForm(device) {
                this.selectedDevice = device;
            },
        },
    };
</script>

<style></style>
