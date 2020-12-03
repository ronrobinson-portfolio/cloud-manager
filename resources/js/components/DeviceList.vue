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

<script lang="ts">
    import Vue from 'vue';
    import { createNamespacedHelpers } from 'vuex';
    import DeviceForm from 'components/device/DeviceForm.vue';
    import { Device, DeviceListData } from 'interfaces/device';
    import { Status } from 'interfaces/status';
    import Echo from 'laravel-echo';

    const deviceStore = createNamespacedHelpers('device');
    const statusStore = createNamespacedHelpers('status');

    const DeviceList = Vue.extend({
        components: {
            DeviceForm,
        },

        data: (): DeviceListData => ({
            selectedDevice: null,
            echo: null,
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
            getDeviceStatus(device: Device) {
                return this.statuses.find(
                    (status: Status) => status.id === device.status_id
                ).status;
            },

            openEditDeviceForm(device: Device) {
                this.selectedDevice = device;
            },
        },

        mounted() {
            this.echo = new Echo({
                broadcaster: 'pusher',
                key: process.env.MIX_PUSHER_APP_KEY,
                cluster: process.env.MIX_PUSHER_APP_CLUSTER,
                forceTLS: false,
                encrypted: false,
            });

            this.echo.channel('emulator').listen('ShowEmulatorEvent', () => {
                this.$router.push({name: 'emulator'});
            });
        },

        beforeDestroy() {
            if (this.echo) {
                this.echo.leaveChannel('emulator');
            }
        },

        /*
        mounted() {

            var socket = new WebSocket(
                'wss://brg4vyb9oc.execute-api.us-east-1.amazonaws.com/production'
            );

            // Connection opened
            socket.addEventListener('open', function (event) {
                socket.send('Hello Server!');
                console.log(new Date())
            });

            // Listen for messages
            socket.addEventListener('message', function (event) {
                console.log('Message from servers2', event.data);
                console.log(new Date())
            });

            // Listen for messages
            socket.addEventListener('close', function (event) {
                console.log('Closing', event);
                console.log(new Date())
            });
        },

         */
    });

    export default DeviceList;
</script>

<style></style>
