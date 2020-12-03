<template>
    <v-card>
        <v-app-bar dark dense color="grey darken-3">
            <v-toolbar-title>Network</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-app-bar>

        <v-card-text>
            <v-container>
                <v-row>
                    <v-col v-for="device in devices" :key="device.id">
                        <v-sheet
                            :color="getSheetColor(device)"
                            class="caption pa-2"
                            width="200"
                            height="100"
                        >
                            <div>{{ device.name }}</div>
                            <div>{{ device.deviceable_value }}</div>
                            <div>{{ device.ip }}</div>
                            <div>{{ getDeviceStatus(device) }}</div>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';

    const deviceStore = createNamespacedHelpers('device');
    const statusStore = createNamespacedHelpers('status');

    export default {
        data: () => ({
            devices: [],
        }),

        computed: {
            ...statusStore.mapState(['statuses']),
        },

        methods: {
            ...deviceStore.mapActions(['getDevices']),

            getDeviceStatus(device) {
                return this.statuses.find(
                    (status) => status.id === device.status_id
                ).status;
            },

            getSheetColor(device) {
                return this.getDeviceStatus(device) === 'Online'
                    ? 'green lighten-4'
                    : 'red lighten-4';
            },

            refreshDevices() {
                this.getDevices().then((devices) => (this.devices = devices));
            },
        },

        mounted() {
            this.refreshDevices();

            Echo.channel('emulator')
                .listen('DeviceUpdatedEvent', (e) => {
                    this.refreshDevices();
                })
                .listen('ListDevicesEvent', (e) => {
                    this.$router.push({name: 'home'})
                });
        },

        beforeDestroy() {
            Echo.leaveChannel('emulator');
        },
    };
</script>

<style></style>
