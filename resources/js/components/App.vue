<template>
    <v-app style="background-color: #f0f0f0">
        <v-app-bar
            app
            :flat="true"
            color="grey darken-3"
            dark
            :fixed="false"
            hide-on-scroll
            clipped-left
        >
            <span>Cloud Manager</span>

            <v-spacer></v-spacer>
        </v-app-bar>

        <v-navigation-drawer permanent mini-variant app clipped>
            <v-list dense>
                <v-list-item
                    v-for="item in items"
                    :key="item.title"
                    :to="item.route"
                    link
                >
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-container style="background-color: #f0f0f0">
                <!-- Page Error -->
                <v-alert
                    v-if="errorBag.has('pageError')"
                    border="top"
                    color="red lighten-2"
                    dark
                    dismissible
                    @input="clearPageError"
                >
                    {{ errorBag.first('pageError') }}
                </v-alert>

                <router-view v-if="isInited"></router-view>
            </v-container>
        </v-main>

        <v-footer app></v-footer>
    </v-app>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';

    const app = createNamespacedHelpers('app');

    export default {
        data: () => ({
            isInited: false,
            items: [
                {
                    title: 'Devices',
                    icon: 'mdi-view-dashboard',
                    route: 'home',
                },
                { title: 'Emulator', icon: 'mdi-monitor', route: 'emulator' },
            ],
            right: null,
        }),

        computed: {
            ...app.mapState(['errorBag']),
        },

        methods: {
            ...app.mapMutations(['clearPageError']),

            ...app.mapActions(['init']),
        },

        mounted() {
            this.init().then(() => (this.isInited = true));
        },
    };
</script>

<style></style>
