const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require('@apollo/server/standalone');
const { typeDefs } = require("./db/schema");
const { resolvers } = require("./db/resolvers");
const { connectMongoDB } = require("./connection/mongodb.connection");

const srv = new ApolloServer({
  typeDefs,
  resolvers,
});

connectMongoDB();
startStandaloneServer(srv, {
  listen: {
    port: 4000
  } 
}).then(({ url }) => console.log(`Running at: ${url}`));