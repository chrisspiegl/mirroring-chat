<template lang='pug'>
  v-container.timeout
    h1 Timeout
    p The page timed out while loading. Are you sure you're still cnnected to the internet?
</template>

<script>
export default {
  page: {
    title: 'Page timeout',
    meta: [
      { name: 'description', content: 'The page timed out while loading.' },
    ],
  },
}
</script>
