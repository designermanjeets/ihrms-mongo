const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {
    getRoles(query: Pagination!): [RoleTypes]
  }

  extend type Mutation {
    createRole (
      role_name: String!
      isDefault: Boolean
      status: Boolean
      comments: String
      privileges: privilegesInputs
      audit: auditInputs
    ): RoleTypes

    editRole (
      _id: ID
      role_name: String!
      isDefault: Boolean
      status: Boolean
      comments: String
      privileges: privilegesInputs
      audit: auditInputs
    ): RoleTypes
  }

  type RoleTypes {
    _id: ID
    role_name: String
    isDefault: Boolean
    status: Boolean
    comments: String
    privileges: privilegesTypes
    audit: auditTypes
  }

  input RoleInputs {
    _id: ID
    role_name: String
    isDefault: Boolean
    status: Boolean
    comments: String
    privileges: privilegesInputs
    audit: auditInputs
  }

  type privilegesTypes {
    module: [moduleType]
  }

  input privilegesInputs {
    module: [moduleInput]
  }

  input moduleInput {
    name: String
    iconName: String
    url: String
    isChild: Boolean
    sub_module: [subModuleInputs]
  }

  type moduleType {
    name: String
    iconName: String
    url: String
    isChild: Boolean
    sub_module: [subModuleTypes]
  }

  type subModuleTypes {
    db: String
    name: String
    iconName: String
    isChild: Boolean
    url: String
    actions: actionsTypes
  }

  input subModuleInputs {
    db: String
    name: String
    iconName: String
    isChild: Boolean
    url: String
    actions: actionsInputs
  }

  input actionsInputs {
    show: Boolean
    add: Boolean
    edit: Boolean
    delete: Boolean
    authorize: Boolean
    cancel: Boolean
    import: Boolean
    export: Boolean
  }

  type actionsTypes {
    show: Boolean
    add: Boolean
    edit: Boolean
    delete: Boolean
    authorize: Boolean
    cancel: Boolean
    import: Boolean
    export: Boolean
  }

  type auditTypes {
    created_by: String
    created_at: ISODate
    modified_by: String
    modified_at: ISODate
  }

  input auditInputs {
    created_by: String
    created_at: ISODate
    modified_by: String
    modified_at: ISODate
  }
`

const resolvers = require('./resolvers')

module.exports = {
  // typeDefs is an array, because it should be possible to split your schema if the schema grows to big, you can just export multiple here
  typeDefs: [
    typeDefs
  ],
  resolvers
}
