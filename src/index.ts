import {print, parse, ASTNode} from 'graphql'
import createQueryWrapper from 'query-ast'
import {buildFragment} from './fragment'
import {buildMutation} from './mutation'
import {buildQuery} from './query'

/**
 * 기본 type을 찾는다.
 */
const getTypes = (typeNodes: any) => {
  const types = []
  const cnt = typeNodes.length()
  for (let i = 0; i < cnt; i++) {
    const node = typeNodes.get(i)
    if (!/Mutation|Query/.test(node.name.value)) {
      types.push(node.name.value)
    }
  }
  return types
}

export const convertSdl = (schema: string, options: Options) => {
  const $ = createQueryWrapper(parse(schema), {
    hasChildren: (node: any) => Array.isArray(node.definitions),
    getChildren: (node: any) => node.definitions,
    getType: (node: any) => node.kind,
  })

  const typeNodes = $(/^ObjectTypeDefinition/)
  const cnt = typeNodes.length()
  const types = getTypes(typeNodes)

  // 1. type 먼저 구성한다.
  for (let i = 0; i < cnt; i++) {
    const node = typeNodes.get(i)

    if (!/Mutation|Query/.test(node.name.value)) {
      buildFragment(node, options)
    }
  }

  // 2. Muation | Query 구성한다.
  for (let i = 0; i < cnt; i++) {
    const node = typeNodes.get(i)

    if (/Mutation/.test(node.name.value)) {
      for (let field of node.fields) {
        buildMutation(field, types, options)
      }
    } else if (/Query/.test(node.name.value)) {
      for (let field of node.fields) {
        buildQuery(field, types, options)
      }
    }
  }
}
