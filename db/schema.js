const typeDefs = `
  type Query {
    getRandom   : String
  }
  type User {
    id         : ID
    email      : String
    firstName  : String  
    lastName   : String
    createdAt  : String
  }
  input UserInput {
    email     : String!
    password  : String!
    firstName : String!
    lastName  : String! 
  }
  type Mutation {
    addUser(input: UserInput!): User
  }
`

module.exports = { typeDefs };