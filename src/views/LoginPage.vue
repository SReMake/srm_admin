<template>
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
        <n-input v-model:value="formValue.user.username" placeholder="用户名" />
      </n-form-item>
      <n-form-item label="密码" path="user.password">
        <n-input v-model:value="formValue.user.password" placeholder="密码" />
      </n-form-item>
      <div class="login_captcha_image">
        <img
          src="data:image/png;base64,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"
          alt="验证码"
        />
      </div>
      <n-form-item label="验证码" path="user.captcha">
        <n-input v-model:value="formValue.user.captcha" placeholder="验证码" />
      </n-form-item>
      <n-form-item>
        <n-button :disabled="loginFlg" class="login_button" attr-type="button" @click="handleLogin">
          登入
        </n-button>
      </n-form-item>
    </n-form>
  </n-card>
</template>

<script lang="ts">
import type { FormInst } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const formRef = ref<FormInst | null>(null)
    const message = useMessage()
    const loginFlg = ref(false)
    return {
      loginFlg,
      formRef,
      formValue: ref({
        user: {
          username: '',
          password: '',
          captcha: '',
        },
      }),
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
      handleLogin(e: MouseEvent) {
        e.preventDefault()
        formRef.value?.validate((errors) => {
          if (!errors) {
            loginFlg.value = true
            message.success('登录成功')
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
    }
  },
})
</script>

<style scoped>
.login_card {
  width: 450px;
  margin: 200px auto;
}
.login_form {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.login_captcha_image {
  height: 50px;
  margin-left: -150px;
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
