<template>
  <div class="h-full">
    <h1 class="text-2xl font-bold">资源管理</h1>
    <hr style="margin-bottom: 1rem; margin-top: 0.25rem" />
    <div class="flex justify-between w-full h-full">
      <n-tree
        class="flex-1"
        block-line
        :data="data"
        :default-expanded-keys="defaultExpandedKeys"
        :node-props="nodeProps"
      />
      <div class="flex-2">内容</div>
    </div>
  </div>
</template>
<script lang="ts">
import type { ResourcesVo } from '@/__generated/model/static'
import type { TreeOption } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { defineComponent, ref } from 'vue'

function createData(
  data: ResourcesVo[],
  parentId: number | null | undefined,
): TreeOption[] | undefined {
  if (parentId) {
    const child = data.filter((r) => {
      return r.parentId == parentId
    })
    return child.map((r) => {
      return {
        key: r.id,
        label: r.name,
        children: createData(data, r.id),
      }
    })
  } else {
  }
}
export default defineComponent({
  setup() {
    const message = useMessage()
    const showDropdownRef = ref(false)
    const xRef = ref(0)
    const yRef = ref(0)
    return {
      data: createData(),
      defaultExpandedKeys: ref(['40', '41']),
      showDropdown: showDropdownRef,
      x: xRef,
      y: yRef,
      handleSelect: () => {
        showDropdownRef.value = false
      },
      handleClickoutside: () => {
        showDropdownRef.value = false
      },
      nodeProps: ({ option }: { option: TreeOption }) => {
        return {
          onClick() {
            message.info(`[Click] ${option.label}`)
          },
          onContextmenu(e: MouseEvent): void {
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
