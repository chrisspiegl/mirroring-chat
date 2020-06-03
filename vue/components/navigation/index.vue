<template lang='pug'>
  div
    v-app-bar(app, clipped-left, dense)
      //- TODO: remember the state of the menu in the users local storage? (eventually once there is a unified global 'settings' page or such)
      v-app-bar-nav-icon(@click.stop="interfaceHasSidebarClosed = !interfaceHasSidebarClosed")
      v-toolbar-title mirroring.chat
        = ' '
        em(style="font-size: .7rem;") v{{version}}
      v-spacer
      v-toolbar-items.hidden-sm-and-down
        v-btn(to="/home") Home
        //- v-btn(to="/about") About
        v-btn(v-if="!loggedIn", to="/login") Login
        v-btn(v-if="loggedIn", @click="actionLogOut") Logout

    v-navigation-drawer(v-model="interfaceHasSidebarClosed", app, top, clipped, :permanent="!isMobile", :mini-variant="interfaceHasSidebarClosed && !isMobile")
      vue-scroll
        v-list(nav, dense)
          v-list-item(link, to="/home", :class="(loggedIn && activated ? 'hidden-md-and-up' : '')")
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

          v-list-item.hidden-md-and-up(v-if="!loggedIn", link, to="/login")
            v-list-item-action
              v-icon(title="Login") $user
            v-list-item-content
              v-list-item-title Login

          v-list-item(v-if="loggedIn && activated", link, to="/dashboard")
            v-list-item-action
              v-icon(title="Dashboard") $dashboard
            v-list-item-content
              v-list-item-title Dashboard

          v-list-item(v-if="loggedIn && activated", link, to="/chat")
            v-list-item-action
              v-badge(color="green", :value="chatMessagesUndone.length", :content="(chatMessagesUndone.length < 10) ? chatMessagesUndone.length : '9+'")
                v-icon(title="Chat") $chat
            v-list-item-content
              v-list-item-title Chat

          v-divider(v-if="loggedIn && activated")

          v-list-item(v-if="loggedIn && activated", link, to="/account")
            v-list-item-action
              v-icon(title="Account") $user
            v-list-item-content
              v-list-item-title Account

          //- v-list-item(v-if="loggedIn && activated", link, to="/settings")
          //-   v-list-item-action
          //-     v-icon(title="Settings") $settings
          //-   v-list-item-content
          //-     v-list-item-title Settings

          v-list-item.hidden-md-and-up(v-if="loggedIn", @click="actionLogOut")
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
      template(v-slot:append)
        v-btn.py-8(block href="https://ChrisSpiegl.com" title="Made by Chris" target="_self")
          v-icon(v-if="interfaceHasSidebarClosed") $madeBy
          span(v-if="!interfaceHasSidebarClosed") Made with ❤ by Chris

</template>

<script>

import { mapState } from 'vuex'
import { authComputed, authMethods, chatMessagesComputed } from '@/state/helpers'


export default {
  name: 'navigation',
  data() {
    return {
      interfaceHasSidebarClosed: true,
    }
  },
  computed: {
    ...authComputed,
    ...chatMessagesComputed,
    ...mapState({
      version: (state) => state.version,
      isMobile: (state) => state.isMobile,
    }),
  },
  methods: {
    ...authMethods,
    actionLogOut() {
      this.$router.push({ name: 'home' }).then(() => {
        this.logOut().then(() => {
          console.log('action Log Out Success')
        })
      })
    },
  },
  mounted() {
    this.$log.debug('components/navigation/index.vue mounted')
  },
}

</script>

<style>
</style>
