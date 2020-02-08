import { MockServe } from '../typings/index'
const api: Array<MockServe.MockRequest> = [
  {
    path: '/userInfo',
    callback: () => ({
      code: 0,
      data: {
        name: '@cname'
      }
    })
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
