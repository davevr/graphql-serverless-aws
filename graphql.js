// graphql.js

const { ApolloServer, gql } = require('apollo-server-lambda');

// Construct a schema, using GraphQL schema language
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const {createSql} = require('./sqldatabase');
const WTFAPI = require('./WTFAPI');

const store = createSql();



// the server again and again
const wtfAPI = new WTFAPI({ store });

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ event, context }) => ({
        headers: event.headers,
        functionName: context.functionName,
        event,
        context,
      }),
    playground: {
      endpoint: "/dev/graphql"
    },
    introspection: true,
    dataSources: () => ({
        wtfAPI: wtfAPI,
      }),
  });

exports.graphqlHandler = server.createHandler({
    cors: {
      origin: '*',
      credentials: true,
    },
  });

  