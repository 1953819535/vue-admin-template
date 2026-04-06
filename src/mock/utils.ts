/** 模拟网络延迟 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))