<template>
  <div class="h-full">
    <h1 class="text-2xl font-bold">资源管理</h1>
    <hr style="margin-bottom: 1rem; margin-top: 0.25rem" />
    <div class="flex justify-between w-full h-full">
      <div class="w-md">
        <div class="pr-4">
          <n-input size="small" v-model:value="pattern" placeholder="搜索" />
        </div>
        <n-tree
          class="h-full pr-4 overflow-y-auto"
          :pattern="pattern"
          show-irrelevant-nodes
          block-line
          :data="data"
          :node-props="nodeProps"
        />
        <n-dropdown
          trigger="manual"
          placement="bottom-start"
          :show="showDropdown"
          :options="options as any"
          :x="x"
          :y="y"
          @select="handleSelect"
          @clickoutside="handleClickoutside"
        ></n-dropdown>
      </div>

      <div class="w-full h-full">
        <n-form
          class="w-full h-full"
          ref="formRef"
          :label-width="80"
          :model="formValue"
          :rules="rules"
          size="large"
        >
          <n-form-item label="类型" path="type">
            <n-select
              :value="formValue.type"
              placeholder="选择类型"
              default-value="MENU"
              :options="[
                { label: '菜单', value: 'MENU' },
                { label: 'VUE视图', value: 'VIEW' },
                { label: '后端接口', value: 'ROUTER' },
                { label: '按钮', value: 'BUTTON' },
              ]"
              @update:value="handleSelectType"
            />
          </n-form-item>
          <n-form-item label="父节点" path="parentId">
            <n-tree-select
              filterable
              :value="formValue.parentId"
              placeholder="选择父节点"
              clearable
              :options="data"
              @update:value="handleTreeSelectParent"
            />
          </n-form-item>
          <n-form-item label="名称" path="name">
            <n-input v-model:value="formValue.name" placeholder="输入名称" />
          </n-form-item>
          <n-form-item v-if="!hideResources" label="资源路径" path="resources">
            <n-input v-model:value="formValue.resources" placeholder="输入资源路径" />
          </n-form-item>
          <n-form-item v-if="!hidePath" label="url地址" path="path">
            <n-input v-model:value="formValue.path" placeholder="输入url地址" />
          </n-form-item>
          <n-form-item v-if="!hideAction" label="请求类型" path="action">
            <n-select
              v-model:value="formValue.action"
              placeholder="选择请求类型"
              default-value="GET"
              :options="[
                { label: 'GET', value: 'GET' },
                { label: 'POST', value: 'POST' },
                { label: 'PUT', value: 'PUT' },
                { label: 'DELETE', value: 'DELETE' },
              ]"
            />
          </n-form-item>

          <n-form-item class="w-full">
            <div class="w-full flex gap-4 justify-end">
              <n-button attr-type="button" type="info"> 提交 </n-button>
              <n-button attr-type="button" type="warning"> 取消 </n-button>
              <n-button v-if="formValue.id" attr-type="button" type="error"> 删除 </n-button>
            </div>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import type { ResourcesVo } from '@/__generated/model/static'
import type { DropdownOption, FormInst, TreeOption } from 'naive-ui'
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
        ...r,
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
          ...r,
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
    const optionsRef = ref<DropdownOption[]>([
      {
        key: 'CREATE',
        label: '新增',
      },
      {
        key: 'Edit',
        label: '编辑',
      },
      {
        key: 'DELETE',
        label: '删除',
      },
    ])
    const xRef = ref(0)
    const yRef = ref(0)
    const formRef = ref<FormInst | null>(null)
    const formValue = ref({
      id: undefined,
      name: undefined,
      resources: undefined,
      path: undefined,
      action: undefined,
      type: undefined,
      parentId: undefined,
    })
    const hideResources = ref(true)
    const hidePath = ref(true)
    const hideAction = ref(true)
    const handleSelectType = (value: string | number | Array<string | number> | null) => {
      switch (value) {
        case 'MENU':
          hideResources.value = true
          hidePath.value = true
          hideAction.value = true
          break
        case 'VIEW':
          hideResources.value = false
          hidePath.value = false
          hideAction.value = true
          break
        case 'ROUTER':
          hideResources.value = false
          hidePath.value = true
          hideAction.value = false
          break
        case 'BUTTON':
          hideResources.value = true
          hidePath.value = false
          hideAction.value = true
          break
      }
    }
    onMounted(async () => {
      const menuRes = await api.resourcesController.listResources()
      if (menuRes.code == 200) {
        const rs = JSON.parse(JSON.stringify(menuRes.data))
        data.value = createData(rs, null)
      }
    })
    return {
      hideResources,
      hidePath,
      hideAction,
      formRef,
      formValue,
      rules: {},
      data,
      showDropdown: showDropdownRef,
      x: xRef,
      y: yRef,
      options: optionsRef,
      pattern: ref(''),
      handleSelect: (key: 'Edit' | 'DELETE' | 'CREATE', option: TreeOption) => {
        console.log(option)
        switch (key) {
          case 'Edit':
            formValue.value = {
              id: option.id,
              name: option.name,
              resources: option.resources,
              path: option.path,
              action: option.action,
              type: option.type,
              parentId: option.parentId,
            }
            handleSelectType(option.type)
            break
          case 'DELETE':
            break
          case 'CREATE':
            break
        }
        showDropdownRef.value = false
      },
      handleClickoutside: () => {
        showDropdownRef.value = false
      },
      nodeProps: ({ option }: { option: TreeOption }) => {
        return {
          onClick() {
            formValue.value = {
              id: option.id,
              name: option.name,
              resources: option.resources,
              path: option.path,
              action: option.action,
              type: option.type,
              parentId: option.parentId,
            }
            handleSelectType(option.type)
          },
          onContextmenu(e: MouseEvent): void {
            optionsRef.value = [
              {
                ...option,
                key: 'CREATE',
                label: '新增',
                id: option.key,
              },
              {
                ...option,
                key: 'Edit',
                label: '编辑',
                id: option.key,
              },
              {
                ...option,
                key: 'DELETE',
                label: '删除',
                id: option.key,
              },
            ]
            showDropdownRef.value = true
            xRef.value = e.clientX
            yRef.value = e.clientY
            console.log(e.clientX, e.clientY)
            e.preventDefault()
          },
        }
      },
      handleSelectType,
      handleTreeSelectParent(value: string | number | Array<string | number> | null) {
        formValue.value.parentId = value
      },
    }
  },
})
</script>
