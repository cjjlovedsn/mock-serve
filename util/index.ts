import { readdir, stat } from 'fs'
import { promisify } from 'util'
import { join } from 'path'
import { PathParams, Request, Response } from 'express-serve-static-core'
import mockjs from 'mockjs'
import { Application } from 'express'
import detect from 'detect-port'
import inquirer from 'inquirer'
import chalk from 'chalk'
export const resolve = (...args: string[]) => join(__dirname, ...args)

export const loadenv = async (basedir: string) => {
  const dirs = await promisify(readdir)(basedir)
  const files = dirs.filter(async file => {
    if (!/^\.env/.test(file)) return false
    const s = await promisify(stat)(join(basedir, file))
    return s && s.isFile()
  })

  for (let path of files) {
    require('dotenv-expand')(require('dotenv').config({ path }))
  }
}

export interface ResponseData {
  [prop: string]: any
  [prop: number]: any
}

export interface CallbackArguments {
  req: Request
  res: Response
  mockjs: mockjs.Mockjs
  mock: mockjs.MockjsMock
  random: mockjs.MockjsRandom
}

export interface Config {
  path: PathParams
  /**
   * @default 'all'
   */
  method?: 'get' | 'post' | 'all'
  data?: ResponseData
  callback? (arg: CallbackArguments): any,
  params?: { [prop: string]: string | number },
  desc?: string
}

export const loadData = (source: Array<Config>, server: Application) => {
  for (const { path, method, data = {}, callback } of source) {
    let handler = (req: Request, res: Response) => {
      let mockData: ResponseData
      if (callback) {
        mockData = callback({
          req,
          res,
          mockjs,
          mock: mockjs.mock,
          random: mockjs.Random
        } as CallbackArguments)
      } else {
        mockData = Object.keys(data).reduce<any>((obj, k: string) => {
          const value = data[k]
          if (typeof value === 'function') {
            obj[k] = value.call(data, {
              req,
              mock: mockjs.mock,
              random: mockjs.Random
            })
          } else {
            obj[k] = value
          }
          return obj
        }, {})
      }
      mockData = Object.prototype.toString.call(mockData) === '[object Object]' ? mockjs.mock(mockData) : mockData.toString()
      res.send(mockData).end()
    }
    switch (method) {
      case 'post':
        server.post(path, handler)
        break
      case 'get':
        server.get(path, handler)
        break
      default:
        server.post(path, handler)
        server.get(path, handler)
        break
    }
  }
}

export const choosePort = async (defaultPort: number) => {
  const port = await detect(defaultPort)
  if (port === defaultPort) return port
  const question = {
    type: 'input',
    name: 'shouldChangePort',
    message: chalk.yellow(`${defaultPort}端口被占用，请重新指定端口`),
    default: port
  }
  const answer: { shouldChangePort: number } = await inquirer.prompt(question)
  return answer.shouldChangePort
}
