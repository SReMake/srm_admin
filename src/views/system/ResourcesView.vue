<template>
  <div class="h-full">
    <h1 class="text-2xl font-bold">资源管理</h1>
    <hr style="margin-bottom: 1rem; margin-top: 0.25rem" />
    <div class="flex justify-between w-full h-full">
      <n-tree class="w-md h-full" block-line :data="data" :node-props="nodeProps" />
      <n-dropdown
        trigger="manual"
        placement="bottom-start"
        :show="showDropdown"
        :options="options as any"
        :x="x"
        :y="y"
        @select="handleSelect"
        @clickoutside="handleClickoutside"
      />
      <div class="w-full">内容</div>
    </div>
  </div>
</template>
<script lang="ts">
import type { ResourcesVo } from '@/__generated/model/static'
import type { DropdownOption, TreeOption } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { defineComponent, onMounted, ref } from 'vue'
import { api } from '@/ApiInstance'

function createData(
  data: ResourcesVo[],
  parentId: number | null | undefined,
): TreeOption[] | undefined {
  if (parentId) {
    const child = data.filter((r) => {
      return r.parentId == parentId && (r.type === 'VIEW' || r.type === 'MENU')
    })
    return child.map((r) => {
      return {
        key: r.id,
        label: r.name,
        children: createData(data, r.id),
      }
    })
  } else {
    return data
      .filter((r) => {
        return r.parentId == null && (r.type === 'VIEW' || r.type === 'MENU')
      })
      .map((r) => {
        return {
          key: r.id,
          label: r.name,
          children: createData(data, r.id),
        }
      })
  }
}
export default defineComponent({
  setup() {
    const message = useMessage()
    const data = ref<TreeOption[] | undefined>([])
    const showDropdownRef = ref(false)
    const optionsRef = ref<DropdownOption[]>([])
    const xRef = ref(0)
    const yRef = ref(0)
    onMounted(async () => {
      const menuRes = await api.resourcesController.listResources()
      if (menuRes.code == 200) {
        const rs = JSON.parse(JSON.stringify(menuRes.data))
        data.value = createData(rs, null)
      }
    })
    return {
      data,
      showDropdown: showDropdownRef,
      x: xRef,
      y: yRef,
      options: optionsRef,
      handleSelect: () => {
        showDropdownRef.value = false
      },
      handleClickoutside: () => {
        showDropdownRef.value = false
      },
      nodeProps: ({ option }: { option: TreeOption }) => {
        return {
          onClick() {
            message.info(`[Click] ${option.key} ${option.label}`)
          },
          onContextmenu(e: MouseEvent): void {
            optionsRef.value = [option]
            showDropdownRef.value = true
            xRef.value = e.clientX
            yRef.value = e.clientY
            console.log(e.clientX, e.clientY)
            e.preventDefault()
          },
        }
      },
    }
  },
})
</script>
