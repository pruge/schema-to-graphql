import * as fs from 'fs'
import {join} from 'path'

const LCERROR = '\x1b[31m%s\x1b[0m' //red
const LCWARN = '\x1b[33m%s\x1b[0m' //yellow
const LCINFO = '\x1b[36m%s\x1b[0m' //cyan
const LCSUCCESS = '\x1b[32m%s\x1b[0m' //green
export const logger = class {
  static error(message: string, ...optionalParams: any[]) {
    console.error(LCERROR, message, ...optionalParams)
  }
  static warn(message: string, ...optionalParams: any[]) {
    console.warn(LCWARN, message, ...optionalParams)
  }
  static info(message: string, ...optionalParams: any[]) {
    console.info(LCINFO, message, ...optionalParams)
  }
  static success(message: string, ...optionalParams: any[]) {
    console.info(LCSUCCESS, message, ...optionalParams)
  }
}

/**
 * folder 생성
 */
export const mkdir = (dirPath: string) => {
  const isExists = fs.existsSync(dirPath)
  if (!isExists) {
    fs.mkdirSync(dirPath, {recursive: true})
  }
}

/**
 * 파일 출력
 */
export const writeFile = (
  dest: string,
  type: string,
  name: string,
  ctx: string,
  overwrite: boolean = false,
) => {
  try {
    const dir = join(process.cwd(), dest, type)
    mkdir(dir)
    fs.writeFileSync(dir + `/${name}.graphql`, ctx, {
      encoding: 'utf8',
      flag: overwrite ? 'w' : 'wx',
    })
  } catch (error) {
    // console.log(error)
  }
}

/**
 * 기본 type을 찾는다. alias 반영
 */
export const getType = (name: string, types: string[], alias: any) => {
  for (let type of types) {
    const tester = new RegExp(type, 'i')
    if (tester.test(name)) {
      return type
    }

    const _alias = !alias[type]
      ? []
      : Array.isArray(alias[type])
      ? alias[type]
      : [alias[type]]
    // alias 를 검사하여 추가한다.
    for (let al of _alias) {
      const tester = new RegExp(al, 'i')
      if (tester.test(name)) {
        return type
      }
    }
  }
  return ''
}

/**
 * query / muation의 return type을 찾는다.
 */
export const getType2: any = (node: any) => {
  if (node?.name?.value) {
    return node.name.value
  } else {
    return getType2(node.type)
  }
}

/**
 * Query, Mutation의 arguments 반환.
 */
export const getArgsPlain = (args: any[], type: string) => {
  if (type === 'outer') {
    const rst = args.reduce((arr: any, arg: any) => {
      if (/after|before|first|last/.test(arg.name.value)) {
        return arr
      }
      if (arg.type?.type?.name?.value) {
        // nonNull
        arr.push('$' + arg.name.value + ': ' + arg.type.type.name.value + '!')
      } else {
        // nullable
        arr.push('$' + arg.name.value + ': ' + arg.type.name.value)
      }
      return arr
    }, [])
    if (rst.length === 0) {
      return ''
    } else {
      return `(${rst.join(', ')})`
    }
  } else {
    const rst = args.reduce((arr: any, arg: any) => {
      if (/after|before|first|last/.test(arg.name.value)) {
        return arr
      } else {
        arr.push(arg.name.value + ': $' + arg.name.value)
        return arr
      }
    }, [])
    if (rst.length === 0) {
      return ''
    } else {
      return `(${rst.join(', ')})`
    }
  }
}
