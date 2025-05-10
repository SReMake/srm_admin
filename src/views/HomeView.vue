<script lang="ts">
import { defineComponent, inject, onMounted } from 'vue'

export default defineComponent({
  setup() {
    onMounted(() => {
      const triggerHeader = inject<() => void>('triggerHeader')
      if (triggerHeader) {
        triggerHeader()
      }
    })
  },
})
</script>

<template>
  <main>HOME</main>
</template>
