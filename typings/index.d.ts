import mockjs from 'mockjs'
import * as ExpressServeStaticCore from 'express-serve-static-core'
export namespace MockServe {

  interface MockRequest {
    path: ExpressServeStaticCore.PathParams,
    /**
     * @default 'all'
     */
    method?: 'get' | 'post' | 'all',
    data?: ResponseData,
    callback?(arg: CallbackArguments): any,
    params?: { [prop: string]: string | number },
    desc?: string
  }

  interface ResponseData {
    [prop: string]: any
    [prop: number]: any
  }

  interface CallbackArguments {
    req: ExpressServeStaticCore.Request,
    res: ExpressServeStaticCore.Response,
    mockjs: mockjs.Mockjs,
    mock: mockjs.MockjsMock,
    random: mockjs.MockjsRandom,
  }

}
