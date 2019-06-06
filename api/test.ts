import { Config } from '../util'

/**
 * ```html
 * 15456136421
 * ```
 */
const api: Array<Config> = [
  {
    path: '/userInfo',
    callback: (): any => {
      return {
        success: true,
        rows: {
          name: '张三',
          age: 18
        }
      }
    }
  },
  {
    path: '/test',
    method: 'get',
    data: {
      success: true,
      rows: 'hello world'
    }
  }
]

export default api
