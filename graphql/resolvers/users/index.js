const queryResolver = require('./Query');
const mutationResolver = require('./Mutation');

module.exports = {
    Query: {
        ...queryResolver.Query,
    },
    Mutation: {
        ...mutationResolver.Mutation,
    }
}