<template>
  <div
    class="h-full flex flex-col items-center justify-center min-h-[300px] p-6 text-center transition-all"
  >
    <div class="text-4xl font-bold mb-4 px-6 py-3 rounded-lg transition-all">
      {{ greeting }}
    </div>
    <div class="text-gray-600 text-lg max-w-md leading-relaxed">
      {{ additionalMessage }}
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue'
// 定义时间段类型
type TimeOfDay = 'morning' | 'noon' | 'afternoon' | 'evening'

export default defineComponent({
  setup() {
    // 响应式变量，带有类型注解
    const hour = ref<number>(0)

    // 更新时间的函数
    const updateTime = (): void => {
      const now = new Date()
      hour.value = now.getHours()
    }

    // 计算时间段
    const timeOfDay = computed<TimeOfDay>(() => {
      if (hour.value >= 5 && hour.value < 10) {
        return 'morning'
      } else if (hour.value >= 10 && hour.value < 14) {
        return 'noon'
      } else if (hour.value >= 14 && hour.value < 18) {
        return 'afternoon'
      } else {
        return 'evening'
      }
    })

    // 计算问候语
    const greeting = computed<string>(() => {
      switch (timeOfDay.value) {
        case 'morning':
          return '早上好！'
        case 'noon':
          return '中午好！'
        case 'afternoon':
          return '下午好！'
        case 'evening':
          return '晚上好！'
      }
    })

    // 计算附加信息
    const additionalMessage = computed<string>(() => {
      switch (timeOfDay.value) {
        case 'morning':
          return '新的一天开始了，祝您有个美好的早晨！'
        case 'noon':
          return '午餐时间快到了，记得按时吃饭哦！'
        case 'afternoon':
          return '下午的时光，继续加油努力！'
        case 'evening':
          return '忙碌的一天结束了，好好休息一下吧！'
      }
    })

    // 定时器ID，用于清理
    let timerId: number | null = null

    // 组件挂载时初始化
    onMounted(() => {
      updateTime()
      // 使用window.setInterval确保类型正确
      timerId = window.setInterval(updateTime, 1000)
    })

    // 组件卸载时清理
    onUnmounted(() => {
      if (timerId) {
        clearInterval(timerId)
      }
    })

    return {
      hour,
      greeting,
      additionalMessage,
      timeOfDay,
    }
  },
})
</script>
