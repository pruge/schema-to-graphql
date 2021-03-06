import {getType2, writeFile} from './helper'

const getFragment = (name: string) => {
  const sampleName = `${name}Fields`
  const firstLine = `fragment ${sampleName} on ${name} {`
  const lastLine = '}'

  return {firstLine, lastLine}
}

const getFields = (fields: any, level: string) => {
  return fields.map((field: any) => `${level}${field.name.value}`).join('\n')
}

// Query/Mutation에서 사용
export const typeFields: {[key: string]: string} = {}

export const getFieldsByType = (node: any) => {
  const type = getType2(node.type)
  return typeFields[type]
}

export const buildFragment = (node: any, {dest, overwrite}: Options) => {
  const name = node.name.value
  const {firstLine, lastLine} = getFragment(name)
  const fields = getFields(node.fields, '  ')
  const ctx = [firstLine, fields, lastLine].join('\n')

  typeFields[name] = getFields(node.fields, '    ')

  writeFile(dest, 'fragment', name, ctx, overwrite)
}
