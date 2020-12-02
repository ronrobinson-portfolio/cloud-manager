<template>
    <v-dialog width="500" :value="device" persistent>
        <v-card>
            <v-app-bar dark dense flat color="grey darken-3">
                <v-toolbar-title>Edit Device</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="closeModal">
                    <v-icon>mdi-close-circle-outline</v-icon>
                </v-btn>
            </v-app-bar>

            <v-card-text>
                <v-row>
                    <v-col>
                        <v-text-field
                            v-model="editableDevice.name"
                            :error-messages="errorBag.first('name')"
                            label="Name"
                            hide-details="auto"
                            outlined
                            dense
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-text-field
                            v-model="editableDevice.ip"
                            :error-messages="errorBag.first('ip')"
                            label="IP"
                            hide-details="auto"
                            outlined
                            dense
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-text-field
                            v-model="editableDevice.status_id"
                            :error-messages="errorBag.first('status_id')"
                            label="Status"
                            hide-details="auto"
                            outlined
                            dense
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-actions>
                <v-btn color="primary" text @click="saveDevice">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
     // Deprecated - Use Device Form
    import { createNamespacedHelpers } from 'vuex';

    const app = createNamespacedHelpers('app');
    const deviceStore = createNamespacedHelpers('device');

    export default {
        props: {
            device: {
                type: Object,
                default: null,
            },
        },

        data: () => ({
            editableDevice: {},
        }),

        computed: {
            ...app.mapState(['errorBag']),
        },

        methods: {
            ...deviceStore.mapActions({ _updateDevice: 'updateDevice' }),

            closeModal() {
                this.errorBag.clear();
                this.$emit('update:device', null);
            },

            saveDevice() {
                this._updateDevice(this.editableDevice)
                    .then(() => this.closeModal())
                    .catch(() => {});
            },
        },

        watch: {
            device(newVal) {
                this.editableDevice = newVal ? { ...newVal } : {};
                
            },
        },
    };
</script>

<style></style>
