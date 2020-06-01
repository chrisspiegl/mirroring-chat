import { mapState, mapGetters, mapActions } from 'vuex'

export const authComputed = {
  ...mapState('auth', {
    userCurrent: (state) => state.userCurrent,
  }),
  ...mapGetters('auth', ['loggedIn', 'activated']),
}

export const authMethods = mapActions('auth', ['logIn', 'logOut'])
