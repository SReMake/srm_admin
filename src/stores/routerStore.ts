import type { ResourcesVo } from '@/__generated/model/static/ResourcesVo'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRouterStore = defineStore('router', () => {
  const data = ref<ResourcesVo[]>([])

  function update(res: ResourcesVo[]) {
    data.value = res
  }
  return {
    data,
    update,
  }
})
