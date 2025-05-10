import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const isLogin = ref<boolean>(!!token.value);
  // 监听 token 变化，将其持久化到 localStorage
  watch(token, (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  });

  const setToken = (newToken: string) => {
    token.value = newToken;
  };

  const removeToken = () => {
    token.value = null;
  };

  return {
    token,
    isLogin,
    setToken,
    removeToken,
  };
});
