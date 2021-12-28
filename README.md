# schema-to-graphql
After reading the schema file of nexus, it creates a graphql file.

## install
```js
yarn add -D schema-to-graphql
```

## usage

> Create a stg.json file in root.
> schema: generated nexus schema file
> dest: destination folder for graphql


```js
{
  "overwrite": false,
  "schema": "./test/schema.graphql",
  "dest": "./test/gql",
  "alias": {
    "Post": ["Draft"]
  }
}
```

## command

```js
npx stg [--config stg.json]
```