import {getFieldsByType, typeFields} from './fragment'
import {getArgsPlain, getType, getType2, writeFile} from './helper'

const getMutation = (name: string, args: any[]) => {
  const argsPlain1 = getArgsPlain(args, 'outer')
  const argsPlain2 = getArgsPlain(args, 'inner')
  const firstLine = `mutation ${name}${argsPlain1} {
  ${name}${argsPlain2} {`
  const lastLine = `  }\n}`

  return {firstLine, lastLine}
}

export const buildMutation = (
  node: any,
  types: any,
  {dest, alias, overwrite}: Options,
) => {
  const name = node.name.value
  const type = getType(name, types, alias)
  const {firstLine, lastLine} = getMutation(name, node.arguments)
  const fields = getFieldsByType(node)
  const ctx = [firstLine, fields, lastLine].join('\n')

  writeFile(dest, `mutation/${type}`, name, ctx, overwrite)
}
