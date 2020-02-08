import { MockServe } from '../typings/index'
export default [
  {
    path: '/api/login',
    callback ({ req }) {
      const { type, username, phone, code, passowrd } = req.body
      const valid = type === 0 ?
        username && passowrd
        : phone && String(phone).length === 11 && code && String(code).length === 4
      if (valid) {
        return {
          errcode: 0,
          message: 'success',
          data: []
        }
      }
      return {
        errcode: 1,
        message: `参数不正确`
      }
    }
  },
  {
    path: '/api/sendsms',
    data: {
      errcode: 0,
      message: '验证码已发送，请在手机上查看'
    }
  }
] as MockServe.MockRequest[]
