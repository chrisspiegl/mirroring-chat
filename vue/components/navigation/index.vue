<template lang='pug'>
  div
    v-app-bar(app, clipped-left, dense)
      //- TODO: remember the state of the menu in the users local storage? (eventually once there is a unified global 'settings' page or such)
      v-app-bar-nav-icon(@click.stop="miniVariant = !miniVariant")
      v-toolbar-title mirroring.chat
        = ' '
        em(style="font-size: .7rem;") v{{version}}
      v-spacer
      v-toolbar-items.hidden-sm-and-down
        v-btn(to="/home") Home
        //- v-btn(to="/about") About
        v-btn(to="/login", v-if="!isAuthenticated && !authLoading") Login
        v-btn(to="/logout", v-if="isAuthenticated && !authLoading") Logout

    v-navigation-drawer(v-model="miniVariant", app, top, clipped, :permanent="!isMobile", :mini-variant="miniVariant && !isMobile")
      vue-scroll
        v-list(nav, dense)
          v-list-item(link, to="/home", :class="(isAuthenticated ? 'hidden-md-and-up' : '')")
            v-list-item-action
              v-icon(title="Home") $home
            v-list-item-content
              v-list-item-title Home

          v-list-item.hidden-md-and-up(link, to="/about")
            v-list-item-action
              v-icon(title="About") $about
            v-list-item-content
              v-list-item-title About

          v-divider.hidden-md-and-up

          v-list-item.hidden-md-and-up(v-if="!isAuthenticated && !authLoading", link, to="/login")
            v-list-item-action
              v-icon(title="Login") $user
            v-list-item-content
              v-list-item-title Login

          v-list-item(v-if="isAuthenticated && !authLoading", link, to="/dashboard")
            v-list-item-action
              v-icon(title="Dashboard") $dashboard
            v-list-item-content
              v-list-item-title Dashboard

          v-list-item(v-if="isAuthenticated && !authLoading", link, to="/chat")
            v-list-item-action
              v-icon(title="Chat") $chat
            v-list-item-content
              v-list-item-title Chat

          v-divider(v-if="isAuthenticated && !authLoading")

          v-list-item(v-if="isAuthenticated && !authLoading", link, to="/account")
            v-list-item-action
              v-icon(title="Account") $user
            v-list-item-content
              v-list-item-title Account

          //- v-list-item(v-if="isAuthenticated && !authLoading", link, to="/settings")
          //-   v-list-item-action
          //-     v-icon(title="Settings") $settings
          //-   v-list-item-content
          //-     v-list-item-title Settings

          v-list-item.hidden-md-and-up(v-if="isAuthenticated && !authLoading", link, to="/logout")
            v-list-item-action
              v-icon(title="Logout") $logout
            v-list-item-content
              v-list-item-title Logout

          v-divider

          v-list-item(link, to="/support")
            v-list-item-action
              v-icon(title="Support/Help") $help
            v-list-item-content
              v-list-item-title Support/Help

</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'navigation',
  computed: {
    ...mapGetters(['getProfile', 'isAuthenticated', 'isProfileLoaded']),
    ...mapState({
      version: (state) => state.version,
      authLoading: (state) => state.auth.status === 'loading',
      displayName: (state) => `${state.user.profile.displayName}`,
      isMobile: (state) => state.isMobile,
    }),
  },

  data: () => ({
    miniVariant: false,
  }),

  mounted() {
    this.$log.debug('components/navigation/index.vue mounted')
  },
}

</script>

<style>
</style>
