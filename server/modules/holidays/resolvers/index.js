const getHolidays = require('./holidays');
const createHolidays = require('./createholidays');
const editHolidays = require('./editholidays');

const resolvers = {
  Query: {
    getHolidays,
  },
  Mutation: {
    createHolidays,
    editHolidays,
  },
};

module.exports = resolvers;
