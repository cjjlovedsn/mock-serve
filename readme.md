# JsonServer结合Mock伪造数据
  通过mockjs生成假数据，用json-server启动一个本地服务生成对应的接口，nodemon监控文件的改动重启服务

## 安装方法
- npm install
- npm start

## 生成接口
- 在api目录下创建对应的接口ts文件。
  ```typescript
  /* 'api/common.ts' */
  import { Config } from '../util'
  const common: Array<Config> = [
    {
      path: '/common/example1',
      // 参数描述[可选]
      params: {},
      // 接口描述[可选]
      desc: '',
      // 回调方式
      callback ({ mock, random }) {
        const success = random.boolean()
        return mock({
          success,
          rows: success ? '@title()' : ''
        })
      }
    },
    {
      path: '/common/example2',
      // 直接引入json文件
      data: require('./example2.json')
    },
    {
      path: '/common/example3',
      // 以mock模版方式生成数据
      data: {
        'id|1+': 2,
        name: '@name()',
        // 单个属性也可以使用function
        gender ({ req, random }) {
          return _req.body.id === 1 ? 1 : ~~random.boolean()
        }
      }
    }
  ]
  ```

> [mockjs文档](https://github.com/nuysoft/Mock/wiki)