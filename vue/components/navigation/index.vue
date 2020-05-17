<template>
  <v-container>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      :permanent=!miniVariant
      :mini-variant=miniVariant
      :expand-on-hover=miniVariant
    >
      <v-list dense>
        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/about">
          <v-list-item-action>
            <v-icon>mdi-info</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item-content>
        </v-list-item>


        <v-divider></v-divider>

        <v-list-item v-if="!isAuthenticated && !authLoading" link to="/login">
          <v-list-item-action>
            <v-icon>mdi-face</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="isAuthenticated && !authLoading" link to="/dashboard">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="isAuthenticated && !authLoading" link to="/chat">
          <v-list-item-action><v-icon>mdi-chat</v-icon></v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Chat</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider v-if="isAuthenticated && !authLoading"></v-divider>

        <v-list-item v-if="isAuthenticated && !authLoading" link to="/account">
          <v-list-item-action>
            <v-icon>mdi-face</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Account: {{ displayName }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="isAuthenticated && !authLoading" link to="/settings">
          <v-list-item-action><v-icon>mdi-settings</v-icon></v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="isAuthenticated && !authLoading" link to="/logout">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item link to="/support">
          <v-list-item-action><v-icon>mdi-help</v-icon></v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Support/Help</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
        app
        clipped-left
      >
      <v-app-bar-nav-icon @click.stop="miniVariant = !miniVariant" />
      <v-toolbar-title>mirroring.chat</v-toolbar-title>
    </v-app-bar>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'navigation',
  computed: {
    ...mapGetters(['getProfile', 'isAuthenticated', 'isProfileLoaded']),
    ...mapState({
      authLoading: (state) => state.auth.status === 'loading',
      displayName: (state) => `${state.user.profile.displayName}`,
    }),
  },
  data: () => ({
    drawer: null,
    miniVariant: false,
  }),
}
console.log('components/navigation/index.vue')

</script>

<style>

</style>
