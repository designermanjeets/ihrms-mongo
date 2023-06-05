const { GraphQLScalarType, Kind } = require('graphql')
const { gql } = require('apollo-server-express')

const typeDef = gql`
  scalar Upload
`

const Upload = new GraphQLScalarType({
  name: 'Upload',
  description: 'JavaScript Uploader',
  parseValue (value) {
    return value || null;
  },
  serialize (value) {
    return value || null;
  },
  parseLiteral (ast) {
    return ast.kind === Kind.STRING || null;
  }
})

module.exports = {
  typeDef,
  resolvers: {
    Upload
  }
}
