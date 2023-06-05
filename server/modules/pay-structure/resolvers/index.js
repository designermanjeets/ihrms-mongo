const getPayStructures = require('./paystructures')
const createPayStructure = require('./createpaystructure')
const editPayStructure = require('./editpaystructures')
const calculatePayStructure = require('./calculatepaystructure');

const resolvers = {
  Query: {
    getPayStructures,
  },
  Mutation: {
    createPayStructure,
    editPayStructure,
    calculatePayStructure
  }
};

module.exports = resolvers;
