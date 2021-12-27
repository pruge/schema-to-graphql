import * as fs from 'fs'
import {join} from 'path'

export const firstCharUppercase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
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
) => {
  try {
    const dir = join(process.cwd(), dest, type)
    mkdir(dir)
    fs.writeFileSync(dir + `/${name}.graphql`, ctx)
  } catch (error) {
    console.log(error)
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
 * Query, Mutation의 arguments 반환.
 */
export const getArgsPlain = (args: any[], type: string) => {
  if (type === 'outer') {
    return args
      .reduce((arr: any, arg: any) => {
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
      .join(', ')
  } else {
    return args
      .reduce((arr: any, arg: any) => {
        if (/after|before|first|last/.test(arg.name.value)) {
          return arr
        } else {
          arr.push(arg.name.value + ': $' + arg.name.value)
          return arr
        }
      }, [])
      .join(', ')
  }
}
