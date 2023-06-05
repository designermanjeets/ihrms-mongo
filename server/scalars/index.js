const DateTime = require('./date-time')
const FileUpload = require('./file-upload')
const Void = require('./void')

module.exports = {
  typeDefs: [
    DateTime.typeDef,
    FileUpload.typeDef,
    Void.typeDef
  ],
  resolvers: {
    ...DateTime.resolvers,
    ...FileUpload.resolvers,
    ...Void.resolvers
  }
}
