<template>
  <div class="h-full">
    <h1 class="text-2xl font-bold">用户管理</h1>
    <hr style="margin-bottom: 1rem; margin-top: 0.25rem" />
    <div class="flex justify-between items-center">
      <div>
        <n-form ref="formRef" inline :label-width="80" :model="formValue" size="large">
          <n-form-item label="用户名">
            <n-input v-model:value="formValue.username" placeholder="输入用户名" />
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
        style="width: 100%"
        :rules="editRules"
        ref="editFormRef"
        inline
        :label-width="80"
        :model="editFormValue"
        size="large"
      >
        <n-form-item style="width: 100%" label="角色" path="roles">
          <n-select
            v-model:value="editFormValue.roles"
            multiple
            filterable
            placeholder="选择角色"
            :options="roleOptions"
          />
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
import { dateFormat, dateTimeOptions } from '@/utils/dateUtils'

interface RowData {
  id: number
  username: string
  phone: string
  email: string
  status: string
  createAt: string
  updateAt: string
  createBy: string
  updateBy: string
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
      title: '用户名',
      key: 'username',
    },
    {
      title: '手机',
      key: 'phone',
    },
    {
      title: '邮箱',
      key: 'email',
    },
    {
      title: '状态',
      key: 'status',
    },
    {
      title: '角色',
      key: 'role',
    },
    { title: '创建者', key: 'createBy' },
    { title: '修改者', key: 'updateBy' },
    {
      title: '创建时间',
      key: 'createAt',
    },
    {
      title: '修改时间',
      key: 'updateAt',
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
    const roleOptions = ref([])
    const showModalRef = ref(false)
    const data = ref<RowData[]>([])
    const formRef = ref<FormInst | null>(null)
    const editFormRef = ref<FormInst | null>(null)
    const message = useMessage()
    const formValue = ref({
      username: '',
    })
    const editFormValue = ref({
      id: undefined,
      roles: [],
      password: undefined,
      phone: undefined,
      email: undefined,
      status: undefined,
    })
    const paginationReactive = reactive({
      page: 1,
      pageSize: 10,
      showSizePicker: true,
      pageSizes: [5, 10, 20, 25, 50],
      onChange: (page: number) => {
        paginationReactive.page = page
        listUser(page, paginationReactive.pageSize, formValue.value.username)
      },
      onUpdatePageSize: (pageSize: number) => {
        paginationReactive.pageSize = pageSize
        paginationReactive.page = 1
        listUser(paginationReactive.page, pageSize, formValue.value.username)
      },
    })
    async function listUser(page: number, size: number, username: string | undefined) {
      const res = await api.userController.listUser({ page, size, params: { username } })
      if (res.code == 200) {
        data.value = res.data.map((item) => {
          return {
            id: item.id,
            username: item.username,
            phone: item.phone,
            email: item.email,
            status: item.status,
            createAt: item.createAt && dateFormat(new Date(item.createAt), dateTimeOptions),
            updateAt: item.updateAt && dateFormat(new Date(item.updateAt), dateTimeOptions),
            // createBy: item.createBy.username,
            // updateBy: item.updateBy.username,
          }
        })
      }
    }
    onMounted(async () => {
      listUser(1, 10, formValue.value.username)
      const roleRes = await api.roleController.listRole({ size: 2147483640, role: {} })
      if (roleRes.code == 200) {
        roleOptions.value = roleRes.data.map((role) => {
          return {
            label: role.name,
            value: role.id,
          }
        })
      }
    })
    const editButtonDisableRef = ref(false)
    return {
      roleOptions,
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
        console.log(formValue.value)

        listUser(
          paginationReactive.page,
          paginationReactive.pageSize,
          formValue.value.username?.trim(),
        )
      },
      handleResetClick(e: MouseEvent) {
        e.preventDefault()
        formValue.value = {
          username: '',
        }
        listUser(
          paginationReactive.page,
          paginationReactive.pageSize,
          formValue.value.username?.trim(),
        )
      },
      data,
      columns: createColumns({
        editRole(rowData) {
          editFormValue.value = {
            id: rowData.id,
            username: rowData.username,
            password: undefined,
            phone: rowData.phone,
            email: rowData.email,
            status: rowData.status,
          }
          showModalRef.value = true
        },
        deleteRole(rowData) {
          api.userController
            .disableUser({ id: rowData.id })
            .then((res) => {
              if (res.code == 200) {
                message.success(`禁用${rowData.username}成功`)
                listUser(
                  paginationReactive.page,
                  paginationReactive.pageSize,
                  formValue.value.username?.trim(),
                )
              } else {
                message.error(`禁用${rowData.username}失败`)
              }
            })
            .catch((err) => {
              if (err) {
                message.error(`禁用${rowData.username}失败`)
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
          api.userController
            .updateUser({
              id: editFormValue.value.id,
              body: { ...editFormValue.value },
            })
            .then((res) => {
              if (res.code == 200) {
                message.success(`修改成功`)
              } else {
                message.error(`修改失败`)
              }
              showModalRef.value = false
              editButtonDisableRef.value = false
              listUser(
                paginationReactive.page,
                paginationReactive.pageSize,
                formValue.value.username?.trim(),
              )
            })
            .catch((err) => {
              if (err) {
                message.error(`修改失败`)
              }
              showModalRef.value = false
              editButtonDisableRef.value = false
            })
        } else {
          api.userController
            .addUser({
              body: {
                ...editFormValue.value,
              },
            })
            .then((res) => {
              if (res.code == 200) {
                message.success(`添加成功`)
              } else {
                message.error(`添加失败`)
              }
              showModalRef.value = false
              editButtonDisableRef.value = false
              listUser(
                paginationReactive.page,
                paginationReactive.pageSize,
                formValue.value.username?.trim(),
              )
            })
            .catch((err) => {
              if (err) {
                message.error(`添加失败`)
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
          username: undefined,
          password: undefined,
          phone: undefined,
          email: undefined,
          status: undefined,
        }
        showModalRef.value = false
      },
      handleCloseEditAfter() {
        editFormValue.value = {
          id: undefined,
          username: undefined,
          password: undefined,
          phone: undefined,
          email: undefined,
          status: undefined,
        }
      },
    }
  },
})
</script>
