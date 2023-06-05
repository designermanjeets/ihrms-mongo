const me = require('./me')
const uploadFile = require('./fileupload')
const createUser = require('./createuser')
const updateUser = require('./edituser')
const getUsers = require('./getusers')
const getAllUsers = require('./getallusers')
const login = require('./login')
const insertManyUsers = require('./insertmanyusers')
const changePassword = require('./changepassword')

const resolvers = {
  Query: {
    me,
    getUsers,
    getAllUsers,
  },
  Mutation: {
    uploadFile,
    createUser,
    updateUser,
    login,
    insertManyUsers,
    changePassword
  }
}

module.exports = resolvers
