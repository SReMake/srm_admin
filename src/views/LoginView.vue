<template>
  <div
    class="flex justify-center items-center h-screen bg-[url('@/assets/login_bg.png')] bg-cover bg-scroll"
  >
    <div
      class="w-2xl h-3xs flex bg-(--color-background)/30 shadow-md backdrop-blur-md justify-center items-center"
    >
      <div class="w-full gap-8 h-full flex flex-col justify-center items-center">
        <span class="text-2xl font-bold">欢迎使用SRM管理系统</span>
        <p class="text-gray-600">
          <a :href="hitokotoLink">{{ hitokotoText }}</a>
        </p>
      </div>
      <n-form
        class="flex pt-5 flex-col flex-wrap justify-center items-center"
        ref="formRef"
        inline
        :label-width="80"
        :model="formValue"
        :rules="rules"
        size="large"
      >
        <n-form-item label="用户名" path="user.username">
          <n-input v-model:value="formValue.user.username" placeholder="用户名" />
        </n-form-item>
        <n-form-item label="密码" path="user.password">
          <n-input type="password" v-model:value="formValue.user.password" placeholder="密码" />
        </n-form-item>
        <n-form-item>
          <img
            class="w-24 h-12"
            :src="captchaImage"
            alt="验证码"
            v-on:click="handleRefreshCaptcha"
          />
        </n-form-item>
        <n-form-item label="验证码" path="user.captcha">
          <n-input v-model:value="formValue.user.captcha" placeholder="验证码" />
        </n-form-item>
        <n-form-item>
          <n-button
            style="width: 200px"
            :disabled="loginFlg"
            attr-type="button"
            @click="handleLogin"
          >
            登入
          </n-button>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>

<script lang="ts">
import { api } from '@/ApiInstance'
import type { FormInst } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { defineComponent, onMounted, ref, type Ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter, type Router } from 'vue-router'
import type { Store } from 'pinia'

let authStore: Store<
  'auth',
  Pick<
    {
      token: Ref<string | null, string | null>
      setToken: (newToken: string) => void
      removeToken: () => void
    },
    'token'
  >,
  Pick<
    {
      token: Ref<string | null, string | null>
      setToken: (newToken: string) => void
      removeToken: () => void
    },
    never
  >,
  Pick<
    {
      token: Ref<string | null, string | null>
      setToken: (newToken: string) => void
      removeToken: () => void
    },
    'setToken' | 'removeToken'
  >
>
let router: Router

const formValue = ref({
  user: {
    captchaId: '',
    username: '',
    password: '',
    captcha: '',
  },
})
const captchaImage = ref('')
function handleRefreshCaptcha() {
  api.authController.captcha().then((captcha) => {
    formValue.value.user.captchaId = captcha.data.id
    captchaImage.value = captcha.data.captcha
  })
}

async function handleLoginRequest() {
  return await api.authController.login({
    body: formValue.value.user,
  })
}

export default defineComponent({
  setup() {
    const hitokotoLink = ref<string>('')
    const hitokotoText = ref<string>('')
    onMounted(() => {
      authStore = useAuthStore()
      router = useRouter()
      handleRefreshCaptcha()
      fetch('https://v1.hitokoto.cn?c=a&c=b&c=c&c=d&c=h&c=i&c=j')
        .then((response) => response.json())
        .then((data) => {
          hitokotoLink.value = 'https://hitokoto.cn/?uuid=' + data.uuid
          hitokotoText.value = '『' + data.hitokoto + '』\t\t————\t\t' + data.from
          if (data.from_who) {
            hitokotoText.value += '\t「' + data.from_who + '」'
          }
        })
        .catch(console.error)
    })
    const formRef = ref<FormInst | null>(null)
    const message = useMessage()
    const loginFlg = ref(false)
    const bingImageUrl = ref('')

    return {
      hitokotoLink,
      hitokotoText,
      captchaImage,
      loginFlg,
      formRef,
      formValue,
      rules: {
        user: {
          username: {
            required: true,
            message: '请输入用户名',
            trigger: ['input', 'blur'],
          },
          password: {
            required: true,
            message: '请输入密码',
            trigger: ['input', 'blur'],
          },
          captcha: {
            required: true,
            message: '请输入验证码',
            trigger: ['input', 'blur'],
          },
        },
      },
      handleRefreshCaptcha,
      handleLogin(e: MouseEvent) {
        loginFlg.value = true
        e.preventDefault()
        formRef.value?.validate(async (errors) => {
          if (!errors) {
            const result = await handleLoginRequest()
            if (result.code == 200) {
              authStore.setToken(result.data.token)
              message.success('登录成功')
              router.replace('/home')
            } else {
              console.log(result.message)
              message.error(result.message)
              loginFlg.value = false
            }
          } else {
            console.log(errors)
            let flg = false
            loginFlg.value = false
            errors.forEach((error) => {
              error.forEach((err) => {
                if (!flg) {
                  message.error(err.message)
                  flg = true
                }
              })
            })
          }
        })
      },
      bingImageUrl,
    }
  },
})
</script>

<style scoped></style>
