// const dateStr = '2025-08-24T13:58:15.668863+08:00';
// const date = new Date(dateStr);

// 格式化配置
const dateTimeOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false, // 24小时制
}
// 格式化配置
const dateOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}
const timeOptions = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false, // 24小时制
}
/**
 *
 * @param {Date} date
 * @returns
 */
const dateFormat = (date: Date, options: undefined) => {
  return new Intl.DateTimeFormat('zh-CN', options).format(date)
}

export { dateTimeOptions, dateOptions, timeOptions, dateFormat }
