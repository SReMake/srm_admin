<template>
  <div class="h-full">
    <h1 class="text-2xl font-bold">角色管理</h1>
    <hr style="margin-bottom: 1rem; margin-top: 0.25rem" />
    <div class="flex justify-between items-center">
      <div>
        <n-form ref="formRef" inline :label-width="80" :model="formValue" size="large">
          <n-form-item label="角色名称">
            <n-input v-model:value="formValue.roleName" placeholder="输入姓名" />
          </n-form-item>
          <n-form-item>
            <n-button attr-type="button" type="primary" @click="handleSearchClick"> 搜索 </n-button>
          </n-form-item>
          <n-form-item>
            <n-button attr-type="button" type="warning" @click="handleResetClick"> 重置 </n-button>
          </n-form-item>
        </n-form>
      </div>
      <div>
        <n-button size="large" type="info" @click="handleCreateClick"> 新增 </n-button>
      </div>
    </div>
    <n-data-table
      class="min-h-[calc(100%-8rem)] pb-2"
      :single-line="false"
      size="large"
      :columns="columns"
      :data="data"
      :pagination="pagination"
    />
    <n-modal
      style="width: 48rem"
      v-model:show="showModal"
      :on-after-leave="handleCloseEditAfter"
      :mask-closable="false"
      preset="card"
    >
      <n-form
        :rules="editRules"
        ref="editFormRef"
        inline
        :label-width="80"
        :model="editFormValue"
        size="large"
      >
        <n-form-item label="角色名称" path="role">
          <n-input v-model:value="editFormValue.role" placeholder="角色名称" />
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="flex gap-4 justify-end">
          <n-button
            size="large"
            type="info"
            @click="handleEditSubmit"
            :disabled="editButtonDisableRef"
          >
            提交
          </n-button>
          <n-button size="large" @click="handleEditCancel" :disabled="editButtonDisableRef">
            取消
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>
<script lang="ts">
import type { DataTableColumns, FormInst } from 'naive-ui'
import { NButton, useMessage } from 'naive-ui'
import { defineComponent, h, onMounted, reactive, ref } from 'vue'
import { api } from '@/ApiInstance'

interface RowData {
  id: number
  role: string
}
function createColumns({
  editRole,
  deleteRole,
}: {
  editRole: (rowData: RowData) => void
  deleteRole: (rowData: RowData) => void
}): DataTableColumns<RowData> {
  return [
    {
      title: 'ID',
      key: 'id',
    },
    {
      title: '角色名称',
      key: 'role',
    },
    {
      title: 'Action',
      key: 'actions',
      render(row) {
        return h('div', { class: 'flex gap-4 items-center' }, [
          h(
            NButton,
            {
              type: 'info',
              size: 'small',
              onClick: () => editRole(row),
            },
            { default: () => '编辑' },
          ),
          h(
            NButton,
            {
              type: 'error',
              size: 'small',
              onClick: () => deleteRole(row),
            },
            { default: () => '删除' },
          ),
        ])
      },
    },
  ]
}

export default defineComponent({
  setup() {
    const showModalRef = ref(false)
    const data = ref<RowData[]>([])
    const formRef = ref<FormInst | null>(null)
    const editFormRef = ref<FormInst | null>(null)
    const message = useMessage()
    const formValue = ref({
      roleName: '',
    })
    const editFormValue = ref({
      id: undefined,
      role: undefined,
    })
    const paginationReactive = reactive({
      page: 1,
      pageSize: 10,
      showSizePicker: true,
      pageSizes: [5, 10, 20, 25, 50],
      onChange: (page: number) => {
        paginationReactive.page = page
        listRole(page, paginationReactive.pageSize, formValue.value.roleName)
      },
      onUpdatePageSize: (pageSize: number) => {
        paginationReactive.pageSize = pageSize
        paginationReactive.page = 1
        listRole(paginationReactive.page, pageSize, formValue.value.roleName)
      },
    })
    async function listRole(page: number, size: number, roleName: string | undefined) {
      const res = await api.roleController.listRole({ page, size, role: { name: roleName } })
      if (res.code == 200) {
        data.value = res.data.map((item) => {
          return {
            id: item.id,
            role: item.name,
          }
        })
      }
    }
    onMounted(async () => {
      listRole(1, 10, formValue.value.roleName)
    })
    const editButtonDisableRef = ref(false)
    return {
      showModal: showModalRef,
      formRef,
      formValue,
      editButtonDisableRef,
      editFormRef,
      editFormValue,
      editRules: {
        role: {
          required: true,
          message: '请输入角色名称',
          trigger: 'blur',
        },
      },
      handleSearchClick(e: MouseEvent) {
        e.preventDefault()
        listRole(
          paginationReactive.page,
          paginationReactive.pageSize,
          formValue.value.roleName?.trim(),
        )
      },
      handleResetClick(e: MouseEvent) {
        e.preventDefault()
        formValue.value = {
          roleName: '',
        }
        listRole(
          paginationReactive.page,
          paginationReactive.pageSize,
          formValue.value.roleName?.trim(),
        )
      },
      data,
      columns: createColumns({
        editRole(rowData) {
          editFormValue.value = {
            id: rowData.id,
            role: rowData.role,
          }
          showModalRef.value = true
        },
        deleteRole(rowData) {
          api.roleController
            .deleteRole({ id: rowData.id })
            .then((res) => {
              if (res.code == 200) {
                message.success(`删除${rowData.role}成功`)
                listRole(
                  paginationReactive.page,
                  paginationReactive.pageSize,
                  formValue.value.roleName?.trim(),
                )
              } else {
                message.error(`删除${rowData.role}失败`)
              }
            })
            .catch((err) => {
              if (err) {
                message.error(`删除${rowData.role}失败`)
              }
            })
        },
      }),
      pagination: paginationReactive,
      handleCreateClick(e: MouseEvent) {
        e.preventDefault()
        showModalRef.value = true
      },
      handleEditSubmit(e: MouseEvent) {
        editButtonDisableRef.value = true
        e.preventDefault()
        formRef.value?.validate((errors) => {
          if (errors) {
            return
          }
        })
        if (editFormValue.value.id) {
          api.roleController
            .updateRole({
              id: editFormValue.value.id,
              body: { name: editFormValue.value.role },
            })
            .then((res) => {
              if (res.code == 200) {
                message.success(`修改${editFormValue.value.role}成功`)
              } else {
                message.error(`修改${editFormValue.value.role}失败`)
              }
              showModalRef.value = false
              editButtonDisableRef.value = false
              listRole(
                paginationReactive.page,
                paginationReactive.pageSize,
                formValue.value.roleName?.trim(),
              )
            })
            .catch((err) => {
              if (err) {
                message.error(`修改${editFormValue.value.role}失败`)
              }
              showModalRef.value = false
              editButtonDisableRef.value = false
            })
        } else {
          api.roleController
            .addRole({
              body: {
                name: editFormValue.value.role,
              },
            })
            .then((res) => {
              if (res.code == 200) {
                message.success(`添加${editFormValue.value.role}成功`)
              } else {
                message.error(`添加${editFormValue.value.role}失败`)
              }
              showModalRef.value = false
              editButtonDisableRef.value = false
              listRole(
                paginationReactive.page,
                paginationReactive.pageSize,
                formValue.value.roleName?.trim(),
              )
            })
            .catch((err) => {
              if (err) {
                message.error(`添加${editFormValue.value.role}失败`)
              }
              showModalRef.value = false
              editButtonDisableRef.value = false
            })
        }
      },
      handleEditCancel(e: MouseEvent) {
        e.preventDefault()
        editFormValue.value = {
          id: undefined,
          role: undefined,
        }
        showModalRef.value = false
      },
      handleCloseEditAfter() {
        editFormValue.value = {
          id: undefined,
          role: undefined,
        }
      },
    }
  },
})
</script>
