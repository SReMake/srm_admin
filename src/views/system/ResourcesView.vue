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
      <div class="flex-2">
        内容
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import type { TreeOption } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { repeat } from 'seemly'
import { defineComponent, ref } from 'vue'

function createData(level = 4, baseKey = ''): TreeOption[] | undefined {
  if (!level) return undefined
  return repeat(6 - level, undefined).map((_, index) => {
    const key = `${baseKey}${level}${index}`
    return {
      label: createLabel(level),
      key,
      children: createData(level - 1, key),
    }
  })
}

function createLabel(level: number): string {
  if (level === 4) return '道生一'
  if (level === 3) return '一生二'
  if (level === 2) return '二生三'
  if (level === 1) return '三生万物'
  return ''
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
