<template>
    <v-dialog width="500" :value="visible" persistent>
        <v-card>
            <v-app-bar dark dense color="grey darken-3">
                <v-toolbar-title>Add Device</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="closeModal">
                    <v-icon>mdi-close-circle-outline</v-icon>
                </v-btn>
            </v-app-bar>

            <v-card-text>
                <v-row>
                    <v-col>
                        <v-text-field
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
                            label="Status"
                            hide-details="auto"
                            outlined
                            dense
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-actions>
                <v-btn color="primary" text @click="addDevice">Add</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    // Deprecated - Use Device Form
    import { createNamespacedHelpers } from 'vuex';

    const deviceStore = createNamespacedHelpers('device');

    export default {
        props: {
            visible: {
                type: Boolean,
                required: true,
            },
        },

        data: () => ({}),

        methods: {
            ...deviceStore.mapActions({ _addDevice: 'addDevice' }),

            addDevice() {
                this._addDevice().then(() => this.closeModal());
            },

            closeModal() {
                this.$emit('update:visible', false);
            },
        },
    };
</script>

<style></style>
