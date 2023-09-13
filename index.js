const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require('@apollo/server/standalone');
const { typeDefs } = require("./db/schema");
const { resolvers } = require("./db/resolvers");
const { connectMongoDB } = require("./connection/mongodb.connection");
const verifyToken = require("./utils/jwt.verify");

const srv = new ApolloServer({
  typeDefs,
  resolvers,
});

connectMongoDB();
startStandaloneServer(srv, {
  listen: {
    port: 4000
  },
  context: ({ req }) => {
    try{
      const token = req.headers['authorization'] || '';
      const user = verifyToken(token);

      return {
        user
      }
    }catch(e) {
      console.error('authentication error');
    }
  }
}).then(({ url }) => console.log(`Running at: ${url}`));