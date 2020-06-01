<template lang='pug'>
  v-container.notActivated
    h1 Not Activated
    p Your user account is currently not activated.
    p Since mirroring.chat is in early development, user activation is done manually and only for testers.
    p Please join the Telegram group #[a(href="https://t.me/MirroringChat") @MirroringChat] so that we can have a chat and I can activate your account.
</template>

<script>
export default {
  name: 'NotActivated',
}
</script>
