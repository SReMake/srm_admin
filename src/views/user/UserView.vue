<template>
  <div class="h-full">
    <h1 class="text-2xl font-bold">用户管理</h1>
    <hr style="margin-bottom: 1rem; margin-top: 0.25rem;">
    <div class="flex justify-between items-center">
      <div>
        <n-form ref="formRef" inline :label-width="80" :model="formValue" size="large">
          <n-form-item label="姓名" path="user.name">
            <n-input v-model:value="formValue.user.name" placeholder="输入姓名" />
          </n-form-item>
          <n-form-item label="年龄" path="user.age">
            <n-input v-model:value="formValue.user.age" placeholder="输入年龄" />
          </n-form-item>
          <n-form-item label="电话号码" path="phone">
            <n-input v-model:value="formValue.phone" placeholder="电话号码" />
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
        <n-button size="large" type="primary"> 新增 </n-button>
      </div>
    </div>
    <n-data-table class="min-h-[calc(100%-8rem)] pb-2" :single-line="false" size="large" :columns="columns" :data="data" :pagination="pagination" />
  </div>
</template>
<script lang="ts">
import type { DataTableColumns, FormInst } from 'naive-ui'
import { NButton, NTag, useMessage } from 'naive-ui'
import { defineComponent, h, reactive, ref } from 'vue'
interface RowData {
  key: number
  name: string
  age: number
  address: string
  tags: string[]
}
function createColumns({
  sendMail,
}: {
  sendMail: (rowData: RowData) => void
}): DataTableColumns<RowData> {
  return [
    {
      title: 'Name',
      key: 'name',
    },
    {
      title: 'Age',
      key: 'age',
    },
    {
      title: 'Address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      render(row) {
        const tags = row.tags.map((tagKey) => {
          return h(
            NTag,
            {
              style: {
                marginRight: '6px',
              },
              type: 'info',
              bordered: false,
            },
            {
              default: () => tagKey,
            },
          )
        })
        return tags
      },
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
              onClick: () => sendMail(row),
            },
            { default: () => '编辑' },
          ),
          h(
            NButton,
            {
              type: 'error',
              size: 'small',
              onClick: () => sendMail(row),
            },
            { default: () => '删除' },
          ),
        ])
      },
    },
  ]
}

function createData(): RowData[] {
  return [
    {
      key: 0,
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: 1,
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['wow'],
    },
    {
      key: 2,
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
    {
      key: 3,
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: 4,
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['wow'],
    },
    {
      key: 5,
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
    {
      key: 6,
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: 7,
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['wow'],
    },
    {
      key: 8,
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
    {
      key: 9,
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: 10,
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['wow'],
    },
    {
      key: 11,
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ]
}
export default defineComponent({
  setup() {
    const formRef = ref<FormInst | null>(null)
    const message = useMessage()
    const formValue = ref({
      user: {
        name: '',
        age: '',
      },
      phone: '',
    })
    const paginationReactive = reactive({
      page: 1,
      pageSize: 10,
      showSizePicker: true,
      pageSizes: [5, 10, 20, 25, 50],
      onChange: (page: number) => {
        paginationReactive.page = page
      },
      onUpdatePageSize: (pageSize: number) => {
        paginationReactive.pageSize = pageSize
        paginationReactive.page = 1
      },
    })
    return {
      formRef,
      formValue,
      handleSearchClick(e: MouseEvent) {
        e.preventDefault()
        console.log(formRef.value)
        message.info(`send mail to ${JSON.stringify(formValue.value)}`)
      },
      handleResetClick(e: MouseEvent) {
        e.preventDefault()
        formValue.value = {
          user: {
            name: '',
            age: '',
          },
          phone: '',
        }
      },
      data: createData(),
      columns: createColumns({
        sendMail(rowData) {
          message.info(`send mail to ${rowData.name}`)
        },
      }),
      pagination: paginationReactive,
    }
  },
})
</script>
