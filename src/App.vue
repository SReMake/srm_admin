<template>
  <n-config-provider :theme="useThemeStore().theme">
    <n-message-provider>
      <RouterView />
    </n-message-provider>
  </n-config-provider>
</template>
<script lang="ts">
import { useThemeStore } from '@/stores/theme'
import { defineComponent, onMounted, onRenderTriggered } from 'vue'
import { RouterView } from 'vue-router'

export default defineComponent({
  setup() {

    onRenderTriggered(() => {})
    onMounted(async () => {})
    return {
      useThemeStore,
      RouterView,
    }
  },
})
</script>
<style scoped>
.app_nav_card {
  height: 50px;
  line-height: 50px;
  padding-right: 20px;
  align-items: center;
  /* 垂直顶部对齐 */
  border-bottom: 1px solid var(--color-border);
}
</style>
