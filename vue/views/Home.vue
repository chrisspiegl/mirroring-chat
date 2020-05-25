<template lang='pug'>
  v-container.home
    h1 mirroring.chat ~ All Your Live Streaming Chat's in One Place
    p With this platform, we are building a system with which you can see all your live streaming chats from Twitch, YouTube, and Facebook in one place and get usefull tools to forward them to Telegram, highlight them in your stream with web widgets, and more.
    p This project is under development and not fully functional yet, but you can register an account and see how it is working so far. To connect with me and talk about the next steps, new features, and ideas you may have, please reach out on Telegram via the group chat #[a(href="https://t.me/MirroringChat") @MirroringChat].
    h2 FAQ
    h3 Who is this for?
    p mirroring.chat is for everybody who likes to live stream and especially those who like to live stream to multiple platforms at the same time and yet want to interact with all the chats as well.
    h3 Current Project Status?
    p Right now this project is in early development (#[em v{{version}}]) and the server may be restarted randomly giving an interruption to the service. I will try to give a headsup to all those outages via the #[a(href="https://t.me/MirroringChat") Telegram Group] but that can not be guaranteed.
    h3 What about the future?
    p I have some grand ideas for what is going to be possible with mirroring.chat as well as mirroring.stream. Building an all in one interface for your restreaming, chat interaction, as well as functional and exciting web widget implementations.
    p Right now, the focus is on making it possible to see all chat messages from Twitch, Facebook, and YouTube chats. Once that's done, the next step is to have the option to forward the messages between these services, followed by replying, and then the ability to highlight chat messages in your stream as a lower third.
    p Eventually, the idea is to build a whole backend solution for streamers and for any discussions, please join us in the #[a(href="https://t.me/MirroringChat") Telegram Group].
    h3 Pricing?
    p At this time, mirroring.chat is provided without a payment plan and is free to use for everybody for the time being. In the future, I may start limiting functionality to paying customers with reasonable pricing tiers to offset server, api, and development costs.
    h3 How can I support this project?
    p Developing a service like this is a time consuming task and however much fun it is, it's easier when certian things in life are taken care of. If you'd like to help me spend more time on this project and get more features and functions out to you, please consider #[a(href="https://buymeacoff.ee/chrisspiegl") supporting me].
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapState({
      version: (state) => state.version,
    }),
  },
}
console.log('Home initialized')
</script>
