<template>
  <div class="login_container">
    <n-card class="login_card">
      <n-form
        ref="formRef"
        inline
        :label-width="80"
        :model="formValue"
        :rules="rules"
        size="large"
        class="login_form"
      >
        <n-form-item label="用户名" path="user.username">
          <n-input
            v-model:value="formValue.user.username"
            placeholder="用户名"
            class="blur-input"
          />
        </n-form-item>
        <n-form-item label="密码" path="user.password">
          <n-input
            type="password"
            v-model:value="formValue.user.password"
            placeholder="密码"
            class="blur-input"
          />
        </n-form-item>
        <div class="login_captcha_image">
          <img :src="captchaImage" alt="验证码" v-on:click="handleRefreshCaptcha" />
        </div>
        <n-form-item label="验证码" path="user.captcha">
          <n-input v-model:value="formValue.user.captcha" placeholder="验证码" class="blur-input" />
        </n-form-item>
        <n-form-item>
          <n-button
            :disabled="loginFlg"
            class="login_button"
            attr-type="button"
            @click="handleLogin"
          >
            登入
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>
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
    onMounted(() => {
      authStore = useAuthStore()
      router = useRouter()
      handleRefreshCaptcha()
    })
    const formRef = ref<FormInst | null>(null)
    const message = useMessage()
    const loginFlg = ref(false)
    const bingImageUrl = ref('')

    return {
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
        e.preventDefault()
        formRef.value?.validate(async (errors) => {
          if (!errors) {
            const result = await handleLoginRequest()
            if (result.code == 200) {
              loginFlg.value = true
              authStore.setToken(result.data.token)
              message.success('登录成功')
              router.replace('/')
            } else {
              console.log(result.message)
              message.error(result.message)
            }
          } else {
            console.log(errors)
            let flg = false
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

<style scoped>
.login_container {
  position: fixed;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/login_bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  /* 让内容靠右对齐 */
  justify-content: flex-end;
  align-items: center;
  /* 给右侧添加一些内边距，避免卡片紧贴屏幕边缘 */
  padding-right: 10%;
}
.blur-input {
  backdrop-filter: blur(10px); /* 高斯模糊效果 */
  -webkit-backdrop-filter: blur(10px); /* 兼容 Safari 浏览器 */
  background-color: rgba(255, 255, 255, 0.1); /* 更低的透明度 */
  border: none; /* 去掉边框 */
}
.login_card {
  width: 450px;
  /* 移除原有的 margin，使用 flex 布局居中 */
  backdrop-filter: blur(10px); /* 添加高斯模糊效果，数值越大模糊程度越高 */
  -webkit-backdrop-filter: blur(10px); /* 兼容 Safari 浏览器 */
  background-color: rgba(255, 255, 255, 0.3); /* 添加半透明背景，使模糊效果更明显 */
  border: none; /* 去掉边框 */
}
.login_form {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.login_captcha_image {
  height: 40px;
  margin-left: -155px;
}
.login_captcha_image img {
  height: 100%;
  width: 100%;
}
.login_button {
  width: 242px;
  margin-left: -14px;
}
</style>
