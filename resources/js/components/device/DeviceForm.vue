<template>
    <v-dialog width="500" :value="device" persistent>
        <v-card>
            <v-app-bar dark dense flat color="grey darken-3">
                <v-toolbar-title
                    >{{ isAddMode ? 'Add' : 'Edit' }} Device</v-toolbar-title
                >
                <v-spacer></v-spacer>
                <v-btn icon @click="closeModal">
                    <v-icon>mdi-close-circle-outline</v-icon>
                </v-btn>
            </v-app-bar>

            <v-card-text class="mt-2">
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
                        <v-select
                            v-model="editableDevice.status_id"
                            :error-messages="errorBag.first('status_id')"
                            label="Status"
                            :items="statuses"
                            item-text="status"
                            item-value="id"
                            hide-details="auto"
                            outlined
                            dense
                        ></v-select>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <v-select
                            v-model="deviceType"
                            label="Device Type"
                            :items="deviceTypes"
                            :disabled="!isAddMode"
                            hide-details="auto"
                            outlined
                            dense
                        ></v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-select
                            v-if="deviceType === 'Computer'"
                            v-model="editableDevice.os"
                            :error-messages="errorBag.first('os')"
                            label="OS"
                            :items="operatingSystems"
                            :disabled="!isAddMode"
                            item-text="os"
                            item-value="id"
                            hide-details="auto"
                            outlined
                            dense
                        ></v-select>
                        <v-select
                            v-else
                            v-model="editableDevice.service"
                            :error-messages="errorBag.first('service')"
                            label="Services"
                            :items="services"
                            :disabled="!isAddMode"
                            item-text="service"
                            item-value="id"
                            hide-details="auto"
                            outlined
                            dense
                        ></v-select>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-actions>
                <v-btn color="primary"  @click="handleButtonClick">{{
                    isAddMode ? 'Add' : 'Update'
                }}</v-btn>
                <v-spacer />
                <v-btn v-if="!isAddMode" color="error" small @click="handleDeleteButtonClick">Delete</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';

    const appStore = createNamespacedHelpers('app');
    const deviceStore = createNamespacedHelpers('device');
    const osStore = createNamespacedHelpers('os');
    const serviceStore = createNamespacedHelpers('service');
    const statusStore = createNamespacedHelpers('status');

    export default {
        props: {
            device: {
                type: Object,
                default: null,
            },
        },

        data: () => ({
            deviceType: 'Computer',
            deviceTypes: ['Computer', 'AWS Service'],
            editableDevice: {},
        }),

        computed: {
            ...appStore.mapState(['errorBag']),
            ...osStore.mapState(['operatingSystems']),
            ...serviceStore.mapState(['services']),
            ...statusStore.mapState(['statuses']),

            isAddMode() {
                return !this.editableDevice.id;
            },
        },

        methods: {
            ...deviceStore.mapActions(['addDevice', 'updateDevice', 'deleteDevice']),

            closeModal() {
                this.errorBag.clear();
                this.$emit('update:device', null);
            },

            handleButtonClick() {
                const actionPromise = this.isAddMode
                    ? this.addDevice({
                          ...this.editableDevice,
                          device_type: this.deviceType,
                      })
                    : this.updateDevice(this.editableDevice);

                actionPromise.then(() => this.closeModal()).catch(() => {});
            },

            handleDeleteButtonClick() {
                this.deleteDevice(this.editableDevice)
                    .then(() => this.closeModal())
                    .catch(() => {});
            }
        },

        watch: {
            device(newVal) {
                this.editableDevice = newVal ? { ...newVal } : {};
            },
        },
    };
</script>

<style></style>
