const { GraphQLScalarType, Kind } = require('graphql')
const { gql } = require('apollo-server-express')

const typeDef = gql`
  scalar Void
`

const Void  = new GraphQLScalarType({

  name: 'Void',
  description: 'Represents NULL values',

  parseValue (value) {
    return value
  },
  serialize (value) {
    return value
  },
  parseLiteral (value) {
    return value
  }
})

module.exports = {
  typeDef,
  resolvers: {
    Void
  }
}
